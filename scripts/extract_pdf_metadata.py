#!/usr/bin/env python3
"""
Extract title and abstract from PDFs in papers/ directory.
Updates _data/publications.yml with new entries.

Uses PyMuPDF (fitz) for reliable font-size-based title detection
and proper text extraction that preserves reading order.

FILENAME CONVENTION:
  [order]__[name]__[status].pdf

  Examples:
    01__my-paper__UR.pdf          → Order 1, "Under review"
    02__another-paper__RR-JOP.pdf → Order 2, "Revise & Resubmit, Journal of Politics"
    03__third-paper.pdf           → Order 3, "Working paper" (default)

  UR = Under review (journal name hidden)
  RR-XYZ = Revise & Resubmit, with journal abbreviation shown
  WP = Working paper (or omit status entirely)
"""

import re
import sys
import unicodedata
from pathlib import Path

import yaml

try:
    import fitz  # PyMuPDF
except ImportError:
    print("PyMuPDF not installed. Run: pip install PyMuPDF")
    sys.exit(1)


PAPERS_DIR = Path("papers")
PUBLICATIONS_FILE = Path("_data/publications.yml")

CATEGORY_MAP = {
    "working-papers": "working-papers",
    "peer-reviewed": "peer-reviewed",
    "book-chapters": "book-chapters",
    "in-progress": "in-progress",
}

JOURNAL_ABBREVS = {
    "APSR": "American Political Science Review",
    "AJPS": "American Journal of Political Science",
    "JOP": "Journal of Politics",
    "IO": "International Organization",
    "IS": "International Studies Quarterly",
    "ISQ": "International Studies Quarterly",
    "CPS": "Comparative Political Studies",
    "WP": "World Politics",
    "BJPS": "British Journal of Political Science",
    "PA": "Political Analysis",
    "PSQ": "Political Science Quarterly",
    "PRQ": "Political Research Quarterly",
    "PSRM": "Political Science Research and Methods",
    "EJPR": "European Journal of Political Research",
    "JCMS": "Journal of Common Market Studies",
    "JPP": "Journal of Public Policy",
    "GOV": "Governance",
    "LSQ": "Legislative Studies Quarterly",
    "POQ": "Public Opinion Quarterly",
    "RIO": "Review of International Organizations",
    "RIPE": "Review of International Political Economy",
    "REP": "Review of Economics and Politics",
}

# Section headers that signal the end of an abstract
SECTION_HEADERS = {
    "introduction", "related work", "background", "methodology",
    "methods", "experimental", "results", "discussion", "conclusion",
    "conclusions", "references", "bibliography", "appendix",
    "keywords", "acknowledgments", "acknowledgements", "funding",
}


# ---------- Text cleaning ----------

def remove_footnote_markers(text: str) -> str:
    """Remove asterisks, daggers, and superscript footnote markers."""
    # Remove common footnote symbols
    text = re.sub(r'[\*†‡§¶‖※∗]+', '', text)
    # Remove Unicode superscript digits (¹²³ etc.)
    text = ''.join(
        ch for ch in text
        if unicodedata.category(ch) != 'No'
    )
    # Remove bracketed footnote refs like [1] or (*)
    text = re.sub(r'[\[\(][*†‡§¶\d]+[\]\)]', '', text)
    return text


def fix_hyphenation(text: str) -> str:
    """
    Rejoin words split by line-break hyphens (e.g., 'resis- tance' → 'resistance')
    but preserve real compound hyphens (e.g., 'behind-the-border').

    Heuristic: a hyphen followed by a space/newline and a lowercase letter,
    where the fragment before the hyphen is > 3 chars, is likely a soft break.
    Short fragments like 'non-' or 'co-' are intentional prefixes.
    """
    # Pattern: long-fragment- <whitespace> lowercase-continuation
    text = re.sub(r'(\w{4,})-\s+([a-z])', r'\1\2', text)
    return text


def clean_text(text: str) -> str:
    """Full cleaning pipeline for extracted text."""
    text = remove_footnote_markers(text)
    text = fix_hyphenation(text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


# ---------- PDF extraction ----------

def extract_title(pdf_path: Path) -> str:
    """
    Extract title from the first page using font size analysis.
    The title is the largest-font text on page 1.
    """
    try:
        doc = fitz.open(str(pdf_path))
        if not doc:
            return ""

        page = doc[0]
        text_dict = page.get_text("dict", flags=11)

        spans = []
        for block in text_dict.get("blocks", []):
            if block.get("type") != 0:
                continue
            for line in block.get("lines", []):
                for span in line.get("spans", []):
                    t = span.get("text", "").strip()
                    if t:
                        spans.append({
                            "text": t,
                            "size": span.get("size", 0),
                            "y": span.get("origin", [0, 0])[1],
                        })

        doc.close()

        if not spans:
            return ""

        max_size = max(s["size"] for s in spans)
        threshold = max_size * 0.9

        # Gather title spans (largest font, near the top)
        title_spans = [s for s in spans if s["size"] >= threshold]

        if not title_spans:
            return ""

        # Sort by vertical position to get reading order
        title_spans.sort(key=lambda s: s["y"])

        # Only take spans within a reasonable vertical range of each other
        first_y = title_spans[0]["y"]
        title_parts = [
            s["text"] for s in title_spans
            if s["y"] - first_y < 60  # allow ~2 lines
        ]

        title = " ".join(title_parts)
        title = clean_text(title)
        title = title.rstrip('.,;: ')
        return title if len(title) > 5 else ""

    except Exception as e:
        print(f"  Warning: title extraction failed for {pdf_path.name}: {e}")
        return ""


def extract_abstract(pdf_path: Path) -> str:
    """
    Extract the abstract by finding text between 'Abstract' and the next section header.
    Uses PyMuPDF's structured text output for accurate reading order.
    """
    try:
        doc = fitz.open(str(pdf_path))
        full_text = ""
        for page in doc[:3]:  # first 3 pages
            full_text += page.get_text("text") + "\n\n"
        doc.close()

        if not full_text:
            return ""

        # Find "Abstract" keyword
        match = re.search(r'(?i)\bAbstract\b[\s:\.\-—]*', full_text)
        if not match:
            return ""

        after_abstract = full_text[match.end():]

        # Find where the abstract ends (next section header)
        end_pattern = (
            r'(?m)(?:'
            r'^(?:Keywords?|JEL\s*[Cc]|Word\s*[Cc]ount|Forthcoming|Published|Draft)'
            r'|'
            r'^\d+[\.\)]\s+[A-Z]'
            r'|'
            r'^(?:I|II|III|IV|V)[\.\)]\s+[A-Z]'
            r'|'
            r'^(?:' + '|'.join(re.escape(h) for h in SECTION_HEADERS) + r')\b'
            r')'
        )

        end_match = re.search(end_pattern, after_abstract, re.IGNORECASE | re.MULTILINE)
        if end_match:
            abstract_raw = after_abstract[:end_match.start()]
        else:
            # Fallback: take until a double blank line
            double_break = re.search(r'\n\s*\n\s*\n', after_abstract)
            if double_break:
                abstract_raw = after_abstract[:double_break.start()]
            else:
                abstract_raw = after_abstract[:2000]

        abstract = clean_text(abstract_raw)

        # Sanity check
        if len(abstract) < 50:
            return ""

        return abstract

    except Exception as e:
        print(f"  Warning: abstract extraction failed for {pdf_path.name}: {e}")
        return ""


# ---------- Filename parsing ----------

def parse_filename(filename: str) -> dict:
    stem = Path(filename).stem
    default_status = "Working paper"
    sort_order = 999

    parts = stem.split("__")

    if len(parts) >= 2 and parts[0].isdigit():
        sort_order = int(parts[0])
        parts = parts[1:]

    if len(parts) == 1:
        clean_name = parts[0]
        status = default_status
    elif len(parts) >= 2:
        clean_name = "__".join(parts[:-1])
        status = _parse_status_code(parts[-1].strip())
    else:
        clean_name = stem
        status = default_status

    title = clean_name.replace("-", " ").replace("_", " ").title()

    return {"title": title, "status": status, "sort_order": sort_order}


def _parse_status_code(code: str) -> str:
    up = code.upper()
    if up == "UR":
        return "Under review"
    if up == "WP":
        return "Working paper"
    if up.startswith("RR"):
        parts = code.split("-", 1)
        if len(parts) == 2:
            abbrev = parts[1].upper()
            name = JOURNAL_ABBREVS.get(abbrev, abbrev)
            return f"Revise & Resubmit, {name}"
        return "Revise & Resubmit"
    return code


def get_category(pdf_path: Path) -> str:
    return CATEGORY_MAP.get(pdf_path.parent.name, "working-papers")


# ---------- YAML I/O ----------

def load_publications() -> list:
    if PUBLICATIONS_FILE.exists():
        with open(PUBLICATIONS_FILE, "r") as f:
            data = yaml.safe_load(f)
            return data if data else []
    return []


def save_publications(pubs: list):
    PUBLICATIONS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(PUBLICATIONS_FILE, "w") as f:
        yaml.dump(pubs, f,
                  default_flow_style=False,
                  allow_unicode=True,
                  sort_keys=False,
                  width=200)
    print(f"  Saved {len(pubs)} entries to {PUBLICATIONS_FILE}")


# ---------- Main ----------

def main():
    if not PAPERS_DIR.exists():
        print(f"Papers directory {PAPERS_DIR} not found.")
        return

    publications = load_publications()
    existing_paths = {
        p.get("github_pdf", "") for p in publications if p.get("github_pdf")
    }

    new_count = 0
    updated_count = 0

    for pdf_path in sorted(PAPERS_DIR.rglob("*.pdf")):
        relative = str(pdf_path)
        parsed = parse_filename(pdf_path.name)

        if relative in existing_paths:
            for pub in publications:
                if pub.get("github_pdf") == relative:
                    changed = False
                    if pub.get("status") != parsed["status"]:
                        pub["status"] = parsed["status"]
                        changed = True
                    if pub.get("sort_order") != parsed["sort_order"]:
                        pub["sort_order"] = parsed["sort_order"]
                        changed = True
                    if changed:
                        updated_count += 1
                        print(f"  Updated: {pdf_path.name}")
            continue

        print(f"  New: {pdf_path.name}")

        # Extract title from PDF; fall back to filename
        pdf_title = extract_title(pdf_path)
        title = pdf_title if pdf_title else parsed["title"]

        # Extract abstract from PDF
        abstract = extract_abstract(pdf_path)

        entry = {
            "title": title,
            "authors": "Jihye Park",
            "status": parsed["status"],
            "category": get_category(pdf_path),
            "github_pdf": relative,
            "year": 2025,
            "sort_order": parsed["sort_order"],
            "abstract": abstract,
        }

        publications.append(entry)
        new_count += 1

    if new_count > 0 or updated_count > 0:
        save_publications(publications)
        print(f"Done: {new_count} new, {updated_count} updated.")
    else:
        print("No new or changed PDFs found.")


if __name__ == "__main__":
    main()
