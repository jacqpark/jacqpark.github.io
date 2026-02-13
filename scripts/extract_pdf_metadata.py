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
    from PyPDF2 import PdfReader
except ImportError:
    print("PyPDF2 not installed. Run: pip install PyPDF2")
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


def parse_filename(filename: str) -> dict:
    """
    Parse order, name, and status from filename convention.

    Returns dict with keys: clean_name, status, sort_order.

    Examples:
      "01__my-paper__UR.pdf"       → order=1,  name="my-paper", status="Under review"
      "02__my-paper__RR-APSR.pdf"  → order=2,  name="my-paper", status="R&R, APSR"
      "03__my-paper.pdf"           → order=3,  name="my-paper", status="Working paper"
      "my-paper__UR.pdf"           → order=999, name="my-paper", status="Under review"
      "my-paper.pdf"               → order=999, name="my-paper", status="Working paper"
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
        name_part = "__".join(parts[:-1])  # Everything except last is the name
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


def extract_metadata(pdf_path: Path) -> dict:
    """Extract title and abstract from a PDF file."""
    parsed = parse_filename(pdf_path.name)
    title = parsed["clean_name"].replace("-", " ").replace("_", " ").title()
    abstract = ""

    try:
        reader = PdfReader(str(pdf_path))

        # Try PDF metadata first
        info = reader.metadata
        if info and info.title and len(info.title.strip()) > 5:
            title = info.title.strip()

        # Extract text from first 3 pages (more pages = better abstract capture)
        text = ""
        for page in reader.pages[:3]:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

        if text:
            lines = [l.strip() for l in text.split("\n") if l.strip()]

            # Heuristic: title is often the first substantial line
            if not (info and info.title and len(info.title.strip()) > 5):
                for line in lines[:10]:
                    if len(line) > 15 and not line.startswith("http"):
                        title = line[:200]
                        break

            # Find abstract — no truncation
            abstract_text = extract_abstract(text)
            if abstract_text:
                abstract = abstract_text

    except Exception as e:
        print(f"  Warning: Could not fully parse {pdf_path.name}: {e}")

    return {
        "title": title,
        "abstract": abstract,
        "status": parsed["status"],
        "sort_order": parsed["sort_order"],
    }


def extract_abstract(text: str) -> str:
    """
    Extract the full abstract from PDF text.
    Looks for text between 'Abstract' and common section markers.
    No length truncation — returns the full abstract.
    """
    # Normalize whitespace while preserving paragraph breaks
    # Replace single newlines (within paragraphs) with spaces
    # but keep double newlines (paragraph breaks)
    normalized = re.sub(r'(?<!\n)\n(?!\n)', ' ', text)

    patterns = [
        # Abstract followed by Introduction, Keywords, JEL, 1., or double newline
        r"(?i)\bAbstract\b[\s:\.\-]*(.*?)(?=\b(?:Introduction|Keywords?|JEL|1\.\s+[A-Z])\b|\n\s*\n\s*\n)",
        # Abstract to next double newline
        r"(?i)\bAbstract\b[\s:\.\-]*(.*?)(?:\n\s*\n)",
    ]

    for pattern in patterns:
        match = re.search(pattern, normalized, re.DOTALL)
        if match:
            abstract = match.group(1).strip()
            # Clean up extra whitespace
            abstract = re.sub(r"\s+", " ", abstract)
            # Only accept if it looks like a real abstract (not just a word or two)
            if len(abstract) > 50:
                return abstract

    # Fallback: try to get text between "Abstract" and the next clear section break
    fallback = re.search(
        r"(?i)\bAbstract\b[\s:\.\-]*((?:(?!\b(?:Introduction|Keywords?|JEL|References?|Contents?)\b).)*)",
        normalized,
        re.DOTALL,
    )
    if fallback:
        abstract = fallback.group(1).strip()
        abstract = re.sub(r"\s+", " ", abstract)
        if len(abstract) > 50:
            return abstract

    return ""


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
