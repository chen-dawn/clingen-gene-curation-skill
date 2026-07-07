# ClinGen Gene–Disease Validity Curation — a Claude Code Skill

A [Claude Code](https://claude.com/claude-code) **skill** that walks Claude through a complete
**ClinGen gene–disease clinical validity curation** — from a folder of papers to GCEP-ready
deliverables — following the ClinGen Gene Curation **SOP v10.1** and Standardized Evidence
Summary **v7.1**.

You talk to Claude in plain English ("help me curate *GENE* for the … GCEP"); the skill supplies
the expert workflow, the scoring rules, the ontology look-ups, the copy-paste spreadsheets, an
adversarial fact-check of every row against the source papers, and a presentation deck.

> ⚠️ **This is a curation *assistant*, not an authority.** It follows the published ClinGen SOP,
> but every score, HGVS variant, HPO term, and classification must be reviewed by a qualified
> curator and approved by the GCEP. Always confirm against the current SOP version.

---

## What it does

Given the literature for a gene–disease relationship, the skill helps you:

- **Organize** the papers and the ClinGen framework docs into a tidy folder.
- **Read** every paper (it extracts the text so nothing is skipped).
- Make a **lumping/splitting** decision about the disease entity.
- **Score** the genetic evidence (individuals, families, segregation, case-control) and the
  experimental evidence (function, functional alteration, models & rescue) exactly per the SOP.
- Look up the correct **HPO** phenotype codes and the **MONDO** disease id, and verify **PMIDs**.
- Produce a **GCI copy-paste workbook** — every field the Gene Curation Interface asks for,
  laid out so you can paste columns straight onto the website, **plus** human-readable review
  columns (plain-language patient summaries, phenotype names, points, rationale).
- Run an **adversarial cross-check**: one AI reviewer per row of evidence re-reads the source
  paper and flags anything wrong or missing, then the corrections are applied.
- Build a **PowerPoint** for the GCEP meeting — one slide per patient and one per experiment,
  with room for you to drop in figure screenshots.

## Who it's for

Gene curators, GCEP members, variant scientists, and clinical/research geneticists who do
ClinGen gene–disease validity curations. **You do not need to know how to code** — Claude runs
everything for you.

---

## What you'll need (one-time setup)

**You may already have most of this, and you don't have to figure it out yourself.** After you
install Claude Code, just start a curation and Claude will **check** what's on your computer and —
with your permission — **install anything that's missing** (or point you to a one-click
installer). Nothing installs silently, but you won't be left guessing. (For reference: on most
Macs Python 3 is already present; Node.js usually needs a one-time install.)

1. **Claude Code** — install it from **https://claude.com/claude-code** and sign in. This is the
   app you'll talk to. (It runs in your computer's Terminal.)
2. **Python 3** — needed to build the Excel workbook and read PDFs. Get it from
   **https://www.python.org/downloads/** (click the big yellow "Download" button, run the
   installer, accept the defaults).
3. **Node.js** — only needed for the PowerPoint. Get the "LTS" version from
   **https://nodejs.org** (run the installer, accept the defaults).

If you're not sure whether you have Python/Node, don't worry — when the time comes, just ask
Claude ("do I have Python and Node?") and it will check and guide you.

---

## Install the skill (simple — no coding)

A "skill" is just a folder of instructions that Claude reads. You put that folder in Claude's
skills location. Pick **one** of the two ways below.

### Option A — Download (easiest, no Terminal)

1. On this GitHub page, click the green **`<> Code`** button → **Download ZIP**.
2. **Unzip** the downloaded file (double-click it).
3. Inside, find the folder named **`gene-curation`**.
4. Move that `gene-curation` folder into your Claude skills folder:
   - **Mac:** open Finder, press **⌘⇧G**, type `~/.claude/skills` and press Enter, then drag the
     `gene-curation` folder into that window. (If a `skills` folder doesn't exist yet, create it.)
   - **Windows:** open File Explorer, go to `C:\Users\<your-name>\.claude\skills` (create the
     `.claude` and `skills` folders if they're missing), and move the `gene-curation` folder in.
5. Restart Claude Code. Done.

### Option B — One line in the Terminal (Mac/Linux)

Copy–paste this into Terminal and press Enter:

```bash
mkdir -p ~/.claude/skills && git clone https://github.com/chen-dawn/clingen-gene-curation-skill.git /tmp/gcs && cp -R /tmp/gcs/gene-curation ~/.claude/skills/ && echo "Installed. Restart Claude Code."
```

### Check it worked

Open Claude Code and type `/` — you should see **gene-curation** in the list of skills. Or just
start a curation (below) and it will activate automatically.

---

## How to use it

1. **Collect the papers.** Make a new folder anywhere (e.g. `MYGENE_Curation`). Put in it:
   - every relevant paper (the first report, all case reports/cohorts, and any functional/animal
     studies) as PDFs, and
   - the two ClinGen docs: the **Gene Curation SOP** and the **Standardized Evidence Summary**.
2. **Open Claude Code in that folder** and ask, in your own words, for example:

   > *"Help me curate STAMBP for the Cerebral Palsy GCEP. The papers are in this folder."*

3. **Answer Claude's questions** (gene, disease, GCEP, and any lumping/splitting judgment calls).
   Claude then works through the whole curation and, at each stage, shows you what it found and
   asks before big decisions.
4. **Get your files.** You end up with three deliverables — see [Deliverables](#deliverables) below.

You never have to run commands yourself — but if you want to, see [Manual script use](#manual-script-use-optional--claude-normally-does-this) at the end.

## Deliverables

| File | What it is | Built at |
|---|---|---|
| `…_Scoring_Worksheet.xlsx` | GCI copy-paste workbook — every form field (Individual, Experimental, Family, Group, Case-Control) with the scores. **Navy** columns paste straight onto the GCI; **grey** columns are human-readable review helpers (patient summary, phenotype names, points, rationale). | Step 8 (corrected after the cross-check) |
| `…_evidence_summary.md` | The ClinGen evidence-summary text (v7.1 template), **its own file**, to paste into the GCI. | Step 11 |
| `…_Curation_Deck.pptx` | GCEP slide deck — one slide per patient and one per experiment, with placeholders for figure screenshots. | Step 12 (last) |

---

## How the curation actually works (step by step)

This is what Claude is doing under the hood, in plain language. The running example is
**STAMBP → microcephaly–capillary malformation syndrome (MIC-CAP)**. For a concrete,
blow-by-blow record of a real run — the actual probands, scores, what the fact-check caught, and
the final Definitive call — see **[docs/worked-example-STAMBP.md](docs/worked-example-STAMBP.md)**.

**Step 0 — Gather & organize.** Claude asks you to drop all the PDFs in one folder, then sorts
them into `ClinGen_SOP/` (the framework docs) and `Literature/` (the papers), renaming each paper
to `Author Year – short title.pdf` so the folder is legible.

**Step 1 — Read everything.** Because Macs often can't "see" inside PDFs, Claude first converts
every PDF to text, then reads the SOP and all the papers, listing every patient, variant,
phenotype, and experiment as it goes.

**Step 2 — Precuration & lumping/splitting.** Claude notes what the gene does and the inheritance
pattern, then applies ClinGen's **Lumping & Splitting** rules: if the different reported
conditions share the same **molecular mechanism, inheritance, and phenotype spectrum**, they're
"lumped" into one disease entity; otherwise they're "split." (For STAMBP everything lumps into
MIC-CAP, and the cerebral-palsy-like motor signs are noted as an overlapping feature of that
broader syndrome.)

**Step 3 — Build the patient/variant table.** One row per affected individual, with a unique
label, the DNA and protein change, zygosity, demographics, testing method, and the paper's PMID.

**Step 4 — Score the genetic evidence.** Following the SOP's point system: predicted "null"
variants (e.g. nonsense/frameshift) start at 1.5 points, other variants (e.g. missense) at 0.1,
with upgrades for supporting lab data or *de novo* status. For recessive genes both variants are
summed and a homozygous variant is doubled, capped at 3 points per patient and 12 points total.
Claude applies the tricky rules too — a splice change that isn't at the canonical site isn't
automatically a "null"; consanguineous homozygous cases are down-weighted; siblings aren't
double-counted (one is the scored patient, the rest count as *segregation*). Family, group, and
case-control evidence each have their own scoring.

**Step 5 — Score the experimental evidence** (max 6 points): the gene's biochemical
**function**, **protein interactions**, **expression** in relevant tissue, **functional
alteration** in patient cells, **model systems** (mouse/organoid), and **rescue** experiments.

**Step 6 — Total & classify.** Genetic (≤12) + experimental (≤6) → **Definitive / Strong /
Moderate / Limited** (STAMBP totals 18/18 → **Definitive**).

**Step 7 — Get the ontology IDs right.** Claude looks up the official **HPO** phenotype codes for
the disease and the **MONDO** disease id, and verifies every **PMID** — it never invents an id.
Phenotypes are stored as codes for the website plus a plain-English column for you.

**Step 8 — Build the GCI workbook (the main output).** A spreadsheet whose tabs mirror each GCI
form (Individual, Experimental, Family, Group, Case-Control). **Navy** columns are the exact
fields to paste onto the website; **grey** columns are readable helpers (a one-line patient
summary, phenotype names, the points and the reasoning) for your review. The scores live right
next to each patient.

**Step 9 — Adversarial cross-check (the safety net).** Claude launches a separate AI reviewer for
**every single row** — each one re-reads that row's source paper and checks every field:
is the HGVS variant exactly right? the zygosity? are the phenotypes actually reported for *this*
patient? is an experiment genuinely *shown* in the paper or just *cited* from another? It then
applies the corrections and gives you a changelog. (In the STAMBP run this caught a swapped
patient ethnicity, a missing phenotype, and a DNA change the paper never actually stated.)

**Step 10 — Quality-control checklist.** A final pass over unique labels, scoring caps, ontology
ids, provenance, and the classification before it's called done.

**Step 11 — Write the evidence summary (from the template).** Using the ClinGen Standardized
Evidence Summary template (v7.1), Claude drafts the public-facing summary — gene/disease/inheritance,
the lumping decision, the genetic and experimental evidence, the mechanism, and the class-specific
summary statement, citing the guideline versions. It's **saved as its own file**
(`…_evidence_summary.md`) — ready to paste into the GCI.

**Step 12 — Build the presentation (last).** Only after the fact-check, QC, and summary does Claude
build the PowerPoint, so the slides reflect the corrected data: one slide per patient (clinical
picture + variants + PMID + points) and one per experiment (what was done, what was found, PMID,
points, and a placeholder for you to paste the figure).

---

## What's in this repo

```
gene-curation/
├── SKILL.md                     the workflow Claude follows (Steps 0–11)
├── references/
│   ├── scoring_reference.md      SOP v10.1 scoring rules (defaults, caps, segregation, case-control)
│   ├── gci_fields.md             every field of every GCI form (Individual/Family/Group/Case-Control/Experimental)
│   ├── evidence_summary_template.md   the ClinGen summary text template (v7.1)
│   ├── crosscheck.md             the per-row fact-check prompts + a library of common pitfalls
│   └── qc_checklist.md           pre-submission quality-control checklist
└── scripts/
    ├── extract_pdfs.py           turn a folder of PDFs into text
    ├── lookups.py                fetch HPO / MONDO / PMID ids
    ├── classify.py               points → classification
    ├── build_workbook.py         build the GCI copy-paste workbook
    └── build_deck.js             build the PowerPoint
```

## Manual script use (optional — Claude normally does this)

```bash
pip install openpyxl pdfplumber            # one-time
npm install -g pptxgenjs                    # one-time (for the deck)

python3 gene-curation/scripts/extract_pdfs.py <folder-of-pdfs>
python3 gene-curation/scripts/lookups.py hpo OMIM:614261
python3 gene-curation/scripts/classify.py 12 6 11 Y N        # -> Definitive
python3 gene-curation/scripts/build_workbook.py out.xlsx     # after filling in the data blocks
NODE_PATH="$(npm root -g)" node gene-curation/scripts/build_deck.js   # after the cross-check
```

## Notes & limitations

- Scoring values are transcribed from **SOP v10.1**; ClinGen updates the SOP periodically —
  always confirm against the version your GCEP is using.
- On macOS, slides can't be auto-rendered to images, so open the PowerPoint once to check layout.
- Papers **without a PMID** can't be entered into the GCI; the skill flags them to document in the
  evidence-summary text instead.
- This tool does not provide medical advice and is not affiliated with or endorsed by ClinGen.

## License

MIT — see [LICENSE](LICENSE).
