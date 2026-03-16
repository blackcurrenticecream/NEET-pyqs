#!/usr/bin/env python3
"""
NEET PYQ Scraper + Supabase Importer
=====================================
Run this once to populate your Supabase questions table.

Setup:
  pip install requests beautifulsoup4 supabase python-dotenv

Usage:
  python scraper.py --scrape      # scrape and save to neet_questions.json
  python scraper.py --import      # import neet_questions.json into Supabase
  python scraper.py --all         # scrape then import

Supabase config — create a .env file:
  SUPABASE_URL=https://YOUR_PROJECT.supabase.co
  SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY   # use service role, NOT anon key
"""

import json
import time
import re
import argparse
import os
from pathlib import Path

# ──────────────────────────────────────────
#  CONFIG
# ──────────────────────────────────────────
OUTPUT_FILE = "neet_questions.json"
DELAY_SECS  = 1.5      # polite delay between requests
MAX_PAGES   = 999      # safety cap

SUBJECT_CHAPTER_MAP = {
    "physics": [
        "Laws of Motion", "Work, Energy and Power", "Gravitation",
        "Thermodynamics", "Electrostatics", "Current Electricity",
        "Magnetic Effects of Current", "Electromagnetic Induction",
        "Alternating Current", "Electromagnetic Waves", "Ray Optics",
        "Wave Optics", "Dual Nature of Radiation", "Atoms", "Nuclei",
        "Semiconductor Electronics", "Communication Systems",
        "Units and Measurement", "Motion in a Straight Line",
        "Motion in a Plane", "Laws of Motion", "System of Particles",
        "Mechanical Properties of Solids", "Mechanical Properties of Fluids",
        "Thermal Properties of Matter", "Kinetic Theory", "Oscillations", "Waves",
    ],
    "chemistry": [
        "Some Basic Concepts of Chemistry", "Structure of Atom",
        "Classification of Elements", "Chemical Bonding", "States of Matter",
        "Thermodynamics", "Equilibrium", "Redox Reactions", "Hydrogen",
        "s-Block Elements", "p-Block Elements", "Organic Chemistry - Basics",
        "Hydrocarbons", "Environmental Chemistry", "d and f Block Elements",
        "Coordination Compounds", "Haloalkanes and Haloarenes",
        "Alcohols, Phenols and Ethers", "Aldehydes and Ketones",
        "Carboxylic Acids", "Amines", "Biomolecules", "Polymers",
        "Chemistry in Everyday Life", "Solutions", "Electrochemistry",
        "Chemical Kinetics", "Surface Chemistry",
    ],
    "botany": [
        "The Living World", "Biological Classification", "Plant Kingdom",
        "Morphology of Flowering Plants", "Anatomy of Flowering Plants",
        "Cell: The Unit of Life", "Cell Cycle and Cell Division",
        "Transport in Plants", "Mineral Nutrition", "Photosynthesis",
        "Respiration in Plants", "Plant Growth and Development",
        "Sexual Reproduction in Flowering Plants",
        "Principles of Inheritance and Variation",
        "Molecular Basis of Inheritance", "Evolution",
        "Human Health and Disease", "Strategies for Enhancement",
        "Microbes in Human Welfare", "Biotechnology: Principles",
        "Biotechnology and its Applications", "Organisms and Populations",
        "Ecosystem", "Biodiversity and Conservation", "Environmental Issues",
    ],
    "zoology": [
        "Animal Kingdom", "Structural Organisation in Animals",
        "Human Physiology - Digestion", "Human Physiology - Breathing",
        "Human Physiology - Body Fluids", "Human Physiology - Excretion",
        "Human Physiology - Locomotion", "Human Physiology - Neural Control",
        "Human Physiology - Chemical Coordination",
        "Human Reproduction", "Reproductive Health",
        "Principles of Inheritance and Variation",
        "Molecular Basis of Inheritance", "Evolution",
        "Human Health and Disease", "Biotechnology and its Applications",
        "Organisms and Populations", "Biodiversity and Conservation",
    ],
}

# ──────────────────────────────────────────
#  SCRAPER
# ──────────────────────────────────────────
def scrape_pyqneet():
    """
    Scrape from pyqneet.com — chapter-wise NEET questions.
    Returns list of question dicts.
    """
    try:
        import requests
        from bs4 import BeautifulSoup
    except ImportError:
        print("Install deps: pip install requests beautifulsoup4")
        return []

    questions = []
    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (compatible; educational-scraper/1.0)"
    })

    base = "https://pyqneet.com"

    for subject, chapters in SUBJECT_CHAPTER_MAP.items():
        subject_cap = subject.capitalize()
        print(f"\n── {subject_cap} ──")

        # Try to find chapter URLs
        try:
            r = session.get(f"{base}/{subject}", timeout=10)
            soup = BeautifulSoup(r.text, "html.parser")

            # Find chapter links
            chapter_links = {}
            for a in soup.find_all("a", href=True):
                href = a["href"]
                text = a.get_text(strip=True)
                if subject in href.lower() and "chapter" in href.lower():
                    chapter_links[text.lower()] = href if href.startswith("http") else base + href

        except Exception as e:
            print(f"  Could not fetch {subject} index: {e}")
            chapter_links = {}

        # Scrape each chapter
        for chapter in chapters:
            # Try to find the chapter URL
            chapter_key = chapter.lower().replace(" ", "-").replace(",", "")
            url = chapter_links.get(chapter.lower()) or f"{base}/{subject}/{chapter_key}"

            print(f"  Scraping: {chapter}")
            try:
                r = session.get(url, timeout=10)
                if r.status_code != 200:
                    print(f"    Skipped (HTTP {r.status_code})")
                    time.sleep(DELAY_SECS)
                    continue

                soup = BeautifulSoup(r.text, "html.parser")
                q_blocks = _extract_questions(soup, subject_cap, chapter)
                questions.extend(q_blocks)
                print(f"    Found {len(q_blocks)} questions")

            except Exception as e:
                print(f"    Error: {e}")

            time.sleep(DELAY_SECS)

    print(f"\n✓ Total scraped: {len(questions)} questions")
    return questions


def _extract_questions(soup, subject, chapter):
    """Extract questions from a BeautifulSoup page. Adapt selectors to target site."""
    questions = []

    # Common patterns — adjust these CSS selectors to match the actual site HTML
    # Pattern 1: question divs with class 'question' or similar
    q_containers = (
        soup.find_all("div", class_=re.compile(r"question", re.I)) or
        soup.find_all("div", class_=re.compile(r"q-block|qblock|question-block", re.I)) or
        soup.find_all("article") or
        soup.find_all("div", class_=re.compile(r"card|item", re.I))
    )

    for i, block in enumerate(q_containers[:50]):  # cap per page
        try:
            q = _parse_question_block(block, subject, chapter)
            if q:
                questions.append(q)
        except Exception:
            continue

    return questions


def _parse_question_block(block, subject, chapter):
    """Parse a single question block. Returns dict or None."""
    text = block.get_text(separator=" ", strip=True)
    if len(text) < 30:
        return None

    # Try to extract year from text
    year_match = re.search(r"\b(19[8-9]\d|20[0-2]\d)\b", text)
    year = int(year_match.group()) if year_match else 2020

    # Try to extract options — look for A), (A), A., etc.
    opt_pattern = re.compile(r"(?:^|\s)[(\[]?([A-D])[)\].][\s:](.+?)(?=(?:\s[(\[]?[A-D][)\].]|\Z))", re.DOTALL)
    opts = {m.group(1): m.group(2).strip() for m in opt_pattern.finditer(text)}

    if len(opts) < 4:
        return None  # can't parse options

    # Extract question text (before first option)
    q_text_match = re.match(r"^(.+?)(?=[(\[]?A[)\].])", text, re.DOTALL)
    q_text = q_text_match.group(1).strip() if q_text_match else text[:200]

    # Clean up question text
    q_text = re.sub(r"\s+", " ", q_text).strip()
    if len(q_text) < 15:
        return None

    # Try to find answer — look for "Answer: X" or "Ans: X" or "Correct: X"
    ans_match = re.search(r"(?:Answer|Ans|Correct)[:\s]+([A-D])", text, re.I)
    answer = ans_match.group(1).upper() if ans_match else "A"

    # Extract solution if available
    sol_match = re.search(r"(?:Solution|Explanation)[:\s]+(.+?)(?=\Z|(?:Answer|Ans))", text, re.I | re.DOTALL)
    solution = sol_match.group(1).strip()[:500] if sol_match else None

    return {
        "subject":    subject,
        "chapter":    chapter,
        "year":       year,
        "question":   q_text,
        "option_a":   opts.get("A", ""),
        "option_b":   opts.get("B", ""),
        "option_c":   opts.get("C", ""),
        "option_d":   opts.get("D", ""),
        "answer":     answer,
        "solution":   solution,
        "difficulty": _estimate_difficulty(q_text),
        "tags":       _extract_tags(q_text, chapter),
        "times_asked": 1,
    }


def _estimate_difficulty(text):
    """Rough difficulty estimation based on text patterns."""
    hard_patterns = ["calculate", "find the value", "numerically", "derive", "prove", "joule", "newton", r"\d+\.\d+"]
    medium_patterns = ["which of the following", "identify", "match", "arrange"]
    text_lower = text.lower()
    if any(re.search(p, text_lower) for p in hard_patterns):
        return "Hard"
    if any(p in text_lower for p in medium_patterns):
        return "Medium"
    return "Easy"


def _extract_tags(text, chapter):
    """Extract keyword tags."""
    tags = []
    chapter_words = chapter.lower().split()
    for w in chapter_words:
        if len(w) > 4:
            tags.append(w)
    if "ncert" in text.lower():
        tags.append("NCERT")
    if "important" in text.lower():
        tags.append("important")
    return tags[:5]


# ──────────────────────────────────────────
#  ALTERNATIVE: GitHub JSON source
# ──────────────────────────────────────────
def fetch_github_data():
    """
    Fetch NEET PYQ data from public GitHub repositories.
    Several repos have structured JSON — this is more reliable than scraping.

    Known public sources:
    - https://github.com/dscmbec/neet-pyq  (check for JSON files)
    - Search GitHub for: neet pyq json questions
    """
    try:
        import requests
    except ImportError:
        print("Install: pip install requests")
        return []

    # Example: fetching from a public JSON endpoint
    urls = [
        # Add GitHub raw JSON URLs here after finding them
        # "https://raw.githubusercontent.com/USER/REPO/main/questions.json",
    ]

    all_questions = []
    for url in urls:
        try:
            r = requests.get(url, timeout=15)
            data = r.json()
            if isinstance(data, list):
                all_questions.extend(data)
            print(f"Fetched {len(data)} from {url}")
        except Exception as e:
            print(f"Failed {url}: {e}")

    return all_questions


# ──────────────────────────────────────────
#  IMPORTER
# ──────────────────────────────────────────
def import_to_supabase(filepath=OUTPUT_FILE):
    """Import questions JSON into Supabase in batches."""
    try:
        from supabase import create_client
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        print("Install: pip install supabase python-dotenv")
        return

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    if not url or not key or "YOUR_PROJECT" in url:
        print("Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env")
        return

    if not Path(filepath).exists():
        print(f"File not found: {filepath}. Run --scrape first.")
        return

    with open(filepath) as f:
        questions = json.load(f)

    print(f"Importing {len(questions)} questions into Supabase...")
    sb = create_client(url, key)

    BATCH = 100
    success = 0
    for i in range(0, len(questions), BATCH):
        batch = questions[i:i+BATCH]
        # Clean each record
        clean = []
        for q in batch:
            if not q.get("question") or not q.get("answer"):
                continue
            clean.append({
                "subject":    q.get("subject", ""),
                "chapter":    q.get("chapter", ""),
                "year":       int(q.get("year", 2020)),
                "question":   q["question"][:1000],
                "option_a":   q.get("option_a", "")[:300],
                "option_b":   q.get("option_b", "")[:300],
                "option_c":   q.get("option_c", "")[:300],
                "option_d":   q.get("option_d", "")[:300],
                "answer":     q["answer"].upper()[:1],
                "solution":   q.get("solution", "")[:2000] if q.get("solution") else None,
                "difficulty": q.get("difficulty", "Medium"),
                "tags":       q.get("tags", []),
                "times_asked": int(q.get("times_asked", 1)),
            })
        if clean:
            result = sb.table("questions").upsert(clean).execute()
            success += len(clean)
            print(f"  Batch {i//BATCH + 1}: {len(clean)} rows imported ({success} total)")

    print(f"\n✓ Import complete: {success} questions in Supabase")


# ──────────────────────────────────────────
#  MAIN
# ──────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="NEET PYQ Scraper + Importer")
    parser.add_argument("--scrape",  action="store_true", help="Scrape and save to JSON")
    parser.add_argument("--import",  dest="do_import", action="store_true", help="Import JSON to Supabase")
    parser.add_argument("--all",     action="store_true", help="Scrape then import")
    parser.add_argument("--file",    default=OUTPUT_FILE, help=f"JSON file path (default: {OUTPUT_FILE})")
    args = parser.parse_args()

    if not any([args.scrape, args.do_import, args.all]):
        parser.print_help()
        print("\n📌 Quickstart:")
        print("  1. pip install requests beautifulsoup4 supabase python-dotenv")
        print("  2. Create .env with SUPABASE_URL and SUPABASE_SERVICE_KEY")
        print("  3. python scraper.py --scrape")
        print("  4. python scraper.py --import")
        print("\n💡 Tip: The scraper targets pyqneet.com but you may need to adjust")
        print("   CSS selectors in _extract_questions() to match the live HTML.")
        print("   A better approach: find a GitHub repo with pre-structured NEET JSON")
        print("   and use fetch_github_data() instead.")
    else:
        if args.scrape or args.all:
            print("Starting scrape...")
            questions = scrape_pyqneet()
            if questions:
                with open(args.file, "w", encoding="utf-8") as f:
                    json.dump(questions, f, ensure_ascii=False, indent=2)
                print(f"\n✓ Saved {len(questions)} questions to {args.file}")
            else:
                print("\n⚠ No questions scraped. Check the selectors in _extract_questions()")
                print("  or use fetch_github_data() to pull from a GitHub JSON source.")

        if args.do_import or args.all:
            import_to_supabase(args.file)
