#!/usr/bin/env python3
"""
Extract title and abstract from PDFs in papers/ directory.
Updates _data/publications.yml with new entries.

Triggered by GitHub Actions when PDFs are pushed to papers/.

STATUS CONVENTION (via filename):
  Append a double-underscore status tag to the filename:
    my-paper__UR.pdf          → "Under review"
    my-paper__RR-JOP.pdf      → "Revise & Resubmit, Journal of Politics"
    my-paper__RR-APSR.pdf     → "Revise & Resubmit, American Political Science Review"
    my-paper__WP.pdf          → "Working paper"
    my-paper.pdf              → "Working paper"  (default)

  The part before __ becomes the paper title fallback.
  UR = Under review (journal name intentionally hidden)
  RR-XYZ = Revise & Resubmit, with journal abbreviation shown
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
    "RIO": "Review of International Organization",
    "ISQ": "International Studies Quarterly",
    "II": "International Interactions",
    "CPS": "Comparative Political Studies",
    "WP": "World Politics",
    "WTR": "World Trade Review",
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
}


def parse_filename_status(filename: str) -> tuple[str, str]:
    """
    Parse status from filename convention.

    Returns (clean_name, status_string).
    Examples:
      "my-paper__UR.pdf"       → ("my-paper", "Under review")
      "my-paper__RR-APSR.pdf"  → ("my-paper", "Revise & Resubmit, American Political Science Review")
      "my-paper__WP.pdf"       → ("my-paper", "Working paper")
      "my-paper.pdf"           → ("my-paper", "Working paper")
    """
    stem = Path(filename).stem
    default_status = "Working paper"

    if "__" not in stem:
        return stem, default_status

    name_part, status_code = stem.rsplit("__", 1)
    status_code = status_code.strip()

    if status_code.upper() == "UR":
        return name_part, "Under review"

    if status_code.upper() == "WP":
        return name_part, default_status

    if status_code.upper().startswith("RR"):
        # Parse journal abbreviation after RR-
        parts = status_code.split("-", 1)
        if len(parts) == 2:
            journal_abbrev = parts[1].upper()
            journal_name = JOURNAL_ABBREVS.get(
                journal_abbrev, journal_abbrev  # Use raw abbreviation if not found
            )
            return name_part, f"Revise & Resubmit, {journal_name}"
        else:
            return name_part, "Revise & Resubmit"

    # Unknown status code — use it as-is
    return name_part, status_code


def extract_metadata(pdf_path: Path) -> dict:
    """Extract title and abstract from a PDF file."""
    clean_name, status = parse_filename_status(pdf_path.name)
    title = clean_name.replace("-", " ").replace("_", " ").title()
    abstract = ""

    try:
        reader = PdfReader(str(pdf_path))

        # Try PDF metadata first
        info = reader.metadata
        if info and info.title and len(info.title.strip()) > 5:
            title = info.title.strip()

        # Extract text from first 2 pages
        text = ""
        for i, page in enumerate(reader.pages[:2]):
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

        if text:
            lines = [l.strip() for l in text.split("\n") if l.strip()]

            # Heuristic: title is often the first substantial line
            if not (info and info.title and len(info.title.strip()) > 5):
                for line in lines[:10]:
                    if len(line) > 15 and not line.startswith("http"):
                        title = line[:150]
                        break

            # Find abstract
            abstract_text = extract_abstract(text)
            if abstract_text:
                abstract = abstract_text[:500]

    except Exception as e:
        print(f"  Warning: Could not fully parse {pdf_path.name}: {e}")

    return {
        "title": title,
        "abstract": abstract,
        "status": status,
    }


def extract_abstract(text: str) -> str:
    """Try to find and extract the abstract from PDF text."""
    patterns = [
        r"(?i)\babstract\b[\s:\.\-]*\n?(.*?)(?:\n\s*\n|\bintroduction\b|\bkeywords?\b|\b1[\.\s])",
        r"(?i)\babstract\b[\s:\.\-]*(.*?)(?:\n\s*\n)",
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.DOTALL)
        if match:
            abstract = match.group(1).strip()
            abstract = re.sub(r"\s+", " ", abstract)
            if len(abstract) > 30:
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
    with open(PUBLICATIONS_FILE, "w") as f:
        yaml.dump(
            publications,
            f,
            default_flow_style=False,
            allow_unicode=True,
            sort_keys=False,
            width=120,
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
        metadata = extract_metadata(pdf_path)

        if relative in existing_paths:
            # Check if status changed (user renamed file)
            for pub in publications:
                if pub.get("github_pdf") == relative:
                    _, new_status = parse_filename_status(pdf_path.name)
                    if pub.get("status") != new_status:
                        pub["status"] = new_status
                        updated_count += 1
                        print(f"  Updated status: {pdf_path.name} → {new_status}")
            continue

        print(f"  Processing: {pdf_path.name}")

        entry = {
            "title": metadata["title"],
            "authors": "Jihye Park",
            "category": category,
            "github_pdf": relative,
            "year": 2025,
            "status": metadata["status"],
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
