#!/usr/bin/env python3
"""
Extract title and abstract from PDFs in papers/ directory.
Updates _data/publications.yml with new entries.

Triggered by GitHub Actions when PDFs are pushed to papers/.

FILENAME CONVENTION:
  [order]__[name]__[status].pdf

  Examples:
    01__my-paper__UR.pdf          → Order 1, "Under review"
    02__another-paper__RR-JOP.pdf → Order 2, "Revise & Resubmit, Journal of Politics"
    03__third-paper__RR-APSR.pdf  → Order 3, "Revise & Resubmit, American Political Science Review"
    04__fourth-paper__WP.pdf      → Order 4, "Working paper"
    05__fifth-paper.pdf           → Order 5, "Working paper" (default)
    my-paper.pdf                  → Order 999 (no number = sorted last), "Working paper"

  UR = Under review (journal name hidden)
  RR-XYZ = Revise & Resubmit, with journal abbreviation shown
  WP = Working paper (or omit status entirely)

ABSTRACT HANDLING:
  The script attempts to extract abstracts from PDFs automatically.
  If extraction is poor, manually edit _data/publications.yml afterward —
  the script will NOT overwrite manually edited abstracts for existing entries.
"""

import os
import re
import sys
from pathlib import Path

import yaml

try:
    import pdfplumber
except ImportError:
    print("pdfplumber not installed. Run: pip install pdfplumber")
    sys.exit(1)


PAPERS_DIR = Path("papers")
PUBLICATIONS_FILE = Path("_data/publications.yml")

# Map folder names to categories
CATEGORY_MAP = {
    "working-papers": "working-papers",
    "peer-reviewed": "peer-reviewed",
    "book-chapters": "book-chapters",
    "in-progress": "in-progress",
}

# Known journal abbreviations — add your own as needed
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


def clean_text(text: str) -> str:
    """Clean extracted text: remove footnote markers, fix hyphenation, normalize whitespace."""
    # Remove footnote markers (asterisks, daggers, superscript numbers at word boundaries)
    text = re.sub(r'[∗\*†‡§¶]+', '', text)
    # Remove superscript-style footnote numbers (standalone digits that look like footnotes)
    text = re.sub(r'(?<=\w)\s*\d{1,2}(?=\s)', ' ', text)
    # Fix hyphenation across lines (re-\njoin → rejoin)
    text = re.sub(r'(\w)-\s+(\w)', r'\1\2', text)
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def parse_filename(filename: str) -> dict:
    """
    Parse order, name, and status from filename convention.

    Returns dict with keys: clean_name, status, sort_order.
    """
    stem = Path(filename).stem
    default_status = "Working paper"
    sort_order = 999

    parts = stem.split("__")

    # Check if first part is a number (sort order)
    if len(parts) >= 2 and parts[0].isdigit():
        sort_order = int(parts[0])
        parts = parts[1:]  # Remove the order prefix

    # Now parts is either [name] or [name, status]
    if len(parts) == 1:
        return {"clean_name": parts[0], "status": default_status, "sort_order": sort_order}

    if len(parts) >= 2:
        name_part = "__".join(parts[:-1])
        status_code = parts[-1].strip()
        status = _parse_status_code(status_code)
        return {"clean_name": name_part, "status": status, "sort_order": sort_order}

    return {"clean_name": stem, "status": default_status, "sort_order": sort_order}


def _parse_status_code(status_code: str) -> str:
    """Convert a status code to display string."""
    code = status_code.upper()

    if code == "UR":
        return "Under review"
    if code == "WP":
        return "Working paper"
    if code.startswith("RR"):
        parts = status_code.split("-", 1)
        if len(parts) == 2:
            journal_abbrev = parts[1].upper()
            journal_name = JOURNAL_ABBREVS.get(journal_abbrev, journal_abbrev)
            return f"Revise & Resubmit, {journal_name}"
        return "Revise & Resubmit"

    # Unknown — use as-is
    return status_code


def extract_title_from_pdf(pdf_path: Path) -> str:
    """
    Extract the title from a PDF using font size analysis.
    The title is typically the largest text on the first page.
    """
    try:
        with pdfplumber.open(str(pdf_path)) as pdf:
            if not pdf.pages:
                return ""

            first_page = pdf.pages[0]
            words = first_page.extract_words(extra_attrs=["fontname", "size"])

            if not words:
                return ""

            # Find the largest font size used (likely the title)
            max_size = max(w.get("size", 0) for w in words)

            # Collect all words in the largest font size (with some tolerance)
            # Title font is usually significantly larger than body text
            body_sizes = sorted(set(w.get("size", 0) for w in words))
            if len(body_sizes) >= 2:
                # Title should be noticeably larger than the second-most-common size
                title_threshold = max_size * 0.9  # Within 10% of max size
            else:
                title_threshold = max_size

            title_words = []
            for w in words:
                if w.get("size", 0) >= title_threshold:
                    title_words.append(w["text"])

            if title_words:
                title = " ".join(title_words)
                title = clean_text(title)
                # Remove common non-title artifacts
                title = re.sub(r'^\s*\d+\s*$', '', title)  # Just a number
                if len(title) > 5:
                    return title

    except Exception as e:
        print(f"  Warning: Font-based title extraction failed for {pdf_path.name}: {e}")

    return ""


def extract_abstract_from_pdf(pdf_path: Path) -> str:
    """
    Extract the abstract from a PDF using text extraction.
    Reads the first 3 pages and looks for the abstract section.
    """
    try:
        with pdfplumber.open(str(pdf_path)) as pdf:
            text = ""
            for page in pdf.pages[:3]:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n\n"

            if not text:
                return ""

            return extract_abstract_from_text(text)

    except Exception as e:
        print(f"  Warning: Abstract extraction failed for {pdf_path.name}: {e}")
        return ""


def extract_abstract_from_text(text: str) -> str:
    """
    Extract abstract from raw text.
    Uses multiple strategies to find and cleanly extract the full abstract.
    """
    # Strategy 1: Find "Abstract" header and extract until next section
    # Common section headers that end an abstract
    end_markers = (
        r'\b(?:Introduction|Keywords?|JEL\s*[Cc]lass|JEL\s*[Cc]ode|'
        r'1\s*\.?\s+[A-Z][a-z]|'
        r'Word\s*count|Forthcoming|Published|Draft|'
        r'(?:I|II|III|IV|V)\.\s+[A-Z])\b'
    )

    # Try to match abstract block
    patterns = [
        # "Abstract" on its own line, content follows until end marker
        rf'(?i)(?:^|\n)\s*Abstract\s*\n(.*?)(?={end_markers}|\n\s*\n\s*\n)',
        # "Abstract:" or "Abstract." inline
        rf'(?i)\bAbstract\s*[:\.\-—]\s*(.*?)(?={end_markers}|\n\s*\n\s*\n)',
        # "Abstract" followed by content (most permissive)
        rf'(?i)\bAbstract\b\s*(.*?)(?={end_markers})',
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.DOTALL)
        if match:
            abstract = match.group(1).strip()
            # Clean up the abstract
            abstract = clean_text(abstract)
            # Remove any leading/trailing quotes
            abstract = abstract.strip('"').strip('"').strip('"')
            # Only accept if it's substantial
            if len(abstract) > 80:
                return abstract

    # Strategy 2: If no "Abstract" header found, try to get the first
    # paragraph-length block after author names (fallback)
    return ""


def extract_metadata(pdf_path: Path) -> dict:
    """Extract title and abstract from a PDF file."""
    parsed = parse_filename(pdf_path.name)

    # Fallback title from filename
    fallback_title = parsed["clean_name"].replace("-", " ").replace("_", " ").title()

    # Try font-based title extraction
    title = extract_title_from_pdf(pdf_path)
    if not title or len(title) < 5:
        title = fallback_title

    # Clean the title
    title = clean_text(title)
    # Remove trailing punctuation artifacts
    title = title.rstrip('.,;: ')

    # Extract abstract
    abstract = extract_abstract_from_pdf(pdf_path)

    return {
        "title": title,
        "abstract": abstract,
        "status": parsed["status"],
        "sort_order": parsed["sort_order"],
    }


def get_category(pdf_path: Path) -> str:
    """Determine the publication category from the file path."""
    parent = pdf_path.parent.name
    return CATEGORY_MAP.get(parent, "working-papers")


def load_existing_publications() -> list:
    """Load existing publications from YAML file."""
    if PUBLICATIONS_FILE.exists():
        with open(PUBLICATIONS_FILE, "r") as f:
            data = yaml.safe_load(f)
            return data if data else []
    return []


def save_publications(publications: list):
    """Save publications to YAML file."""
    PUBLICATIONS_FILE.parent.mkdir(parents=True, exist_ok=True)

    # Use a custom representer for long strings to use block style
    class LiteralStr(str):
        pass

    def literal_str_representer(dumper, data):
        if "\n" in data or len(data) > 120:
            return dumper.represent_scalar("tag:yaml.org,2002:str", data, style="|")
        return dumper.represent_scalar("tag:yaml.org,2002:str", data)

    yaml.add_representer(LiteralStr, literal_str_representer)

    # Convert long abstracts to LiteralStr for readable YAML output
    for pub in publications:
        if pub.get("abstract") and len(pub["abstract"]) > 120:
            pub["abstract"] = LiteralStr(pub["abstract"])

    with open(PUBLICATIONS_FILE, "w") as f:
        yaml.dump(
            publications,
            f,
            default_flow_style=False,
            allow_unicode=True,
            sort_keys=False,
            width=200,
        )
    print(f"Saved {len(publications)} publications to {PUBLICATIONS_FILE}")


def main():
    if not PAPERS_DIR.exists():
        print(f"Papers directory {PAPERS_DIR} not found. Nothing to do.")
        return

    # Load existing
    publications = load_existing_publications()
    existing_paths = {p.get("github_pdf", "") for p in publications}

    # Scan for PDFs
    new_count = 0
    updated_count = 0

    for pdf_path in sorted(PAPERS_DIR.rglob("*.pdf")):
        relative = str(pdf_path)
        category = get_category(pdf_path)

        if relative in existing_paths:
            # Update sort_order and status if filename changed
            parsed = parse_filename(pdf_path.name)
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

        print(f"  Processing: {pdf_path.name}")
        metadata = extract_metadata(pdf_path)

        entry = {
            "title": metadata["title"],
            "authors": "Jihye Park",
            "category": category,
            "github_pdf": relative,
            "year": 2025,
            "status": metadata["status"],
            "sort_order": metadata["sort_order"],
        }

        if metadata["abstract"]:
            entry["abstract"] = metadata["abstract"]

        publications.append(entry)
        new_count += 1

    if new_count > 0 or updated_count > 0:
        save_publications(publications)
        print(f"Added {new_count} new, updated {updated_count} existing publication(s).")
    else:
        print("No new or changed PDFs found.")


if __name__ == "__main__":
    main()
