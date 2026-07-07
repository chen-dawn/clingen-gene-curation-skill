---
name: gene-curation
description: >
  Perform a ClinGen gene–disease clinical validity curation end to end: organize
  source papers, make a lumping/splitting decision, score genetic (case-level +
  segregation) and experimental evidence against the built-in ClinGen SOP v10.1
  rules (no SOP docs needed), look up HPO/MONDO terms, and produce GCI-ready
  copy-paste sheets, an evidence-summary, and a presentation deck. Use when the
  user mentions ClinGen, a GCEP, gene-disease
  validity, gene curation, scoring probands/variants, or the Gene Curation Interface
  (GCI). Works for any gene/disease, not just the example (STAMBP / MIC-CAP).
---

# ClinGen Gene–Disease Validity Curation

This skill walks through a full ClinGen gene-disease validity curation and produces
the artifacts a curator needs to enter evidence into the **Gene Curation Interface
(GCI)** and present to their **GCEP**. Follow the steps in order; each builds on the
last. Reference files: `references/scoring_reference.md` (SOP scoring rules),
`references/gci_fields.md` (every GCI form field), `references/evidence_summary_template.md`
(summary text), `references/crosscheck.md` (Step-9 agent prompts + pitfall library),
`references/qc_checklist.md` (pre-submission QC). Scripts: `scripts/extract_pdfs.py` (PDF → text),
`scripts/lookups.py` (HPO/MONDO/PMID lookups), `scripts/classify.py` (points → classification),
`scripts/build_workbook.py` (full GCI workbook), `scripts/build_deck.js` (full presentation deck).

**Built on (already baked in — do not ask the user for these):** ClinGen Gene Curation
**SOP v10.1**, Standardized Evidence Summary **v7.1 (June 2026)**, and the current GCI curation
forms (Individual / Family / Group / Case-Control / Experimental). The scoring rules, field maps,
and summary template above are distilled from those. Only ask for a framework doc if the user's
GCEP is on a **newer SOP version** than 10.1 — then read it and defer to it, noting the version.

## Step 0 — Gather the source material (ask the user first)

Before anything else, tell the user **you already have the ClinGen framework built in** (SOP
v10.1, Evidence Summary v7.1, and the GCI form fields — so they do **not** need to provide the
SOP or Evidence Summary docs), then ask them to:

1. **List the relevant papers** (the foundational gene-disease report plus every case report,
   cohort, and functional/model paper) and **put the PDFs in one project folder**.
2. Tell you the **gene**, the **asserted disease(s)/phenotype(s)**, and which **GCEP** is curating.
3. *Optional:* if their GCEP uses a **newer SOP than v10.1**, drop that PDF in and you'll defer to it.

Then **organize the folder** (do this for them):

- `Literature/` — all the papers. **Rename each** to `Author Year - short title.pdf`
  (e.g. `McDonell 2013 - STAMBP mutations cause MIC-CAP (Nat Genet).pdf`). Disambiguate
  same-author-same-year papers by topic.
- `ClinGen_SOP/` — **only if** the user dropped in framework PDFs (e.g. a newer SOP).
- Leave the user's own precuration deck at the root.

## Step 1 — Read everything

macOS often lacks `poppler`, so the Read tool can't render PDFs. Extract text with
**pdfplumber** instead: `scripts/extract_pdfs.py <folder>` writes a `.txt` per PDF to a
scratch dir. Read:

- The scoring rules and summary template are already in `references/` (SOP v10.1 / Evidence
  Summary v7.1) — consult those; only read a framework PDF if the user supplied a newer SOP.
- Every **paper**, building a running list of: probands, families, variants (cDNA +
  protein, zygosity), clinical features, and any functional/model/rescue experiments.

## Step 2 — Precuration & lumping/splitting

- Note gene function, chromosome, protein, and **mode of inheritance (MOI)**.
- Apply the **ClinGen Lumping & Splitting** criteria across all asserted entities:
  compare **(a) molecular mechanism, (b) inheritance pattern, (c) phenotypic variability**.
  - *No difference* on all three → **lump** into one disease entity.
  - Meaningful difference → **split** and curate separately.
- Record the decision and the single (or split) disease entity + OMIM/MONDO id.
- Watch for **phenotype-expansion** cases (a hallmark feature absent) and disease
  **mimics/overlaps** (e.g. a CP-like motor phenotype inside a broader progressive syndrome).

## Step 3 — Build the proband / variant table

One entry per **affected individual** with a unique, author-prefixed label
(`McDonell P1.1`, `Naseer IV-1`). Capture cDNA+protein, zygosity, in-trans/homozygous,
demographics, testing method, and the paper+PMID. This table feeds both scoring and GCI entry.

## Step 4 — Score the genetic evidence

Full rules in `references/scoring_reference.md`. Essentials:

- **Per-variant defaults**: predicted/proven null (nonsense, frameshift, **canonical ±1/2**
  splice, exon/gene deletion) = **1.5** (range 0–2); other variant (missense, in-frame
  indel, **non-canonical/deep-intronic splice**) = **0.1** (range 0–1.5).
- **Upgrades**: supportive functional data (missense → ~0.5); de novo; robust function.
- **Autosomal recessive**: score **each variant, then SUM**; **homozygous = variant ×2**;
  **cap 3 points per proband**; **genetic category caps at 12**.
- **Key judgment calls learned** (document every one in the GCI):
  - Non-canonical (+5/−5) / deep-intronic splice is **NOT** an automatic null — score 0.1
    unless there is functional proof of LOF.
  - **Consanguineous** homozygous missense: downgrade / require functional evidence
    (runs of homozygosity).
  - **Compound-het sums round DOWN** to the nearest GCI increment (SOP Example 1):
    0.1+1.5 = 1.6 → **1.5**; 0.1+1.0 = 1.1 → **1.0**.
  - **Siblings are not double-scored**: score **one proband per family** for variant
    evidence; count additional affected sibs as **segregation** (identical-by-descent).
- **Segregation** (optional, often not needed once case-level caps): AR estimated LOD
  `Z = log10[ 1 / ((0.25)^(affected−1) (0.75)^(unaffected)) ]`; ~0.6 per affected sib; sum across families.
  Aggregate only **AD/XL families with ≥4 segregations** and **AR families with ≥3 affected individuals**.
- **Evidence levels**: genetic evidence can be entered as **Individual / Family / Group / Case-Control**
  (field maps in `references/gci_fields.md`). **Case-control** studies feed the same 12-pt genetic cap,
  scored 0–6/study on power, bias/confounding, detection method, and statistical significance
  (see `references/scoring_reference.md`). Don't double-count an individual as both case-level and case-control.

## Step 5 — Score the experimental evidence (max 6)

Six experiment types → three scoring categories:
- **Function (max 2)**: Biochemical Function, Protein Interactions, Expression.
- **Functional Alteration (max 2)**: patient cells / non-patient cells.
- **Models & Rescue (max 4)**: non-human model organism, cell-culture model, and rescue
  (in human / non-human model / cell culture / patient cells).

One row per **paper × experiment type**. Rescue evidence is strong; an in-vivo rescue
(e.g. AAV gene replacement in a model) is especially compelling. Total experimental caps at 6.

## Step 6 — Total & classification

`Total = genetic (≤12) + experimental (≤6)`. Classify:
**Definitive** (≥12, first report >3 yr ago, replicated in research + clinical settings,
no valid contradictory evidence) · **Strong** (12, <3 yr) · **Moderate** (7–11) ·
**Limited** (1–6) · plus Disputed/Refuted/No-known-relationship. `scripts/classify.py
<genetic> <experimental> [years] [replicated] [contradictory]` computes it. See the Evidence
Summary guide for the exact summary-statement templates.

## Step 7 — Ontology lookups (get IDs right, don't guess)

Use `scripts/lookups.py` (`hpo OMIM:<id>` · `mondo "<disease>"` · `term HP:<id>` · `pmid <author> <year> "<journal>"`).

- **HPO terms**: pull the disease's authoritative annotation set from
  `https://ontology.jax.org/api/network/annotation/OMIM:<id>` (or OLS). Map each
  individual's features to those verified IDs; put features **without** a confident ID in
  free text. For GCI, phenotype fields take **IDs only, comma-separated** (`HP:0000253, HP:0025104`).
- **MONDO disease id**: OLS search
  `https://www.ebi.ac.uk/ols4/api/search?q=<disease>&ontology=mondo`.
- **PMIDs**: verify with the PubMed MCP (`lookup_article_by_citation`) or a web search —
  never invent a PMID. Papers without a PMID (some non-indexed journals) **cannot** be
  entered in the GCI; document them in the evidence-summary text instead.

## Step 8 — Produce the deliverables

The **GCI workbook is the primary output** — build it now, once scoring/curation is complete
and **before** the Step-9 cross-check (which then validates the rows in this file). Use
`scripts/build_workbook.py`. Every tab maps 1:1 to a GCI curation form so the curator can paste
columns straight onto the website, and **includes the scores**. Two header styles: **PASTE
columns (navy)** = GCI fields to paste; **REVIEW columns (grey)** = human-readable helpers
(brief description, HPO labels, per-variant scores, proband total, rationale, eLOD) — for manual
review, not pasted. Tabs (one row per evidence item):

- **GCI Individual Entry** — full Individual form (label, proband?, disease MONDO, HPO IDs +
  descriptors, free-text & NOT phenotypes, demographics, previous testing, genome-wide,
  genotyping methods + description, in-trans/homozygous, Variant 1/2 HGVS **+ ClinVar IDs**,
  additional info, PMID) **+ scores** (per-variant, proband total, rationale) + brief description.
- **GCI Experimental Data** — one row per paper × experiment type with all type-specific fields
  (see `references/gci_fields.md`): **GO IDs** (Biochemical Function, Functional Alteration),
  **Uberon** (Expression), interaction type/method (Protein Interactions), model/human phenotype,
  rescue method + "WT rescues?"/"patient variant rescues?", **ClinVar VariationID**, Select status,
  + suggested points/category.
- **GCI Family**, **GCI Group**, **GCI Case-Control** — full field maps (segregation counts,
  group counts, case/control power + statistics + bias questions); left empty unless that
  evidence type is used.
- **Segregation** (eLOD helper), **Summary** (totals → classification), **HPO Reference**, **Legend**.

The **evidence-summary text** and the **presentation deck** are produced at the **end** (Steps
11–12), *after* the cross-check and QC, so they reflect the corrected data.

## Step 9 — Adversarial cross-check against the papers (required)

Before finalizing, **verify every row of evidence against its source paper** — do not trust
the transcription. **See `references/crosscheck.md`** for ready-to-use per-row agent-prompt
templates (individual + experimental), the two-wave orchestration, the changelog format, and a
pitfall library of concrete traps to check. Launch **one subagent per evidence row** (Agent
tool; run them in parallel, or use a Workflow to pipeline them):

- **Per individual row:** give the agent the individual's row (label, variants cDNA+protein,
  zygosity, in-trans/homozygous, HPO IDs + descriptors, free-text phenotypes, NOT-phenotypes,
  demographics, methods, PMID, points/rationale) and the matching paper's extracted text.
  Ask it to confirm **each field against the paper** and report: (1) any value that
  disagrees with the paper, (2) anything **missing** (a reported phenotype, a second variant,
  consanguinity, age, ancestry, death), (3) HPO IDs that don't match the described feature,
  (4) whether the scoring/rationale is consistent with the SOP. Return a structured list of
  corrections.
- **Per experimental row:** same idea — verify the experiment type, model/cell system, the
  described result, the phenotype HPO IDs, "WT rescues?/patient variant rescues?", PMID, and
  points against the paper.
- **Also check for omissions across the set:** probands or experiments present in a paper but
  missing from the table; variants counted twice; recurrent/founder variants; non-PMID sources.

Collect all agent findings, **apply the corrections** to the workbook & evidence summary, and
give the user a short changelog of what was fixed. Prefer verifying against the actual
extracted paper text (Step 1), citing the specific figure/table/section where each value
comes from. Re-run `build_workbook.py` after edits (the summary & deck aren't built until Steps 11–12).

## Step 10 — Pre-submission QC

Run `references/qc_checklist.md` before declaring the curation ready for GCEP review — it
checks disease-entity/MOI, genetic & experimental scoring, ontology/provenance, that the
cross-check ran, deliverable consistency, and the final classification.

## Step 11 — Write the evidence summary (from the template)

Once the data is corrected and QC'd, write the **evidence-summary text** using
`references/evidence_summary_template.md`. Fill every bracket: gene + synonyms, MOI, disease +
OMIM/MONDO, first-report year & PMID, the lumping/splitting decision, the genetic-evidence
summary (unique-variant count, variant types, # individuals/families, recurrent/founder variants,
"max reached" note), the mechanism, the experimental-evidence summary, "other relevant
information" (phenotype variability, non-PMID sources, variants evaluated-but-not-scored), and the
class-specific **Summary** statement. **State the guideline versions** — Evidence Summary v7.1 and
the SOP version in the approval sentence. This is the text that gets pasted into the GCI and shown
publicly on clinicalgenome.org, so keep it clear for a non-expert reader.

**Save it as its own file** in the curation folder — e.g. `<GENE>_<disease>_evidence_summary.md`
(or `.txt`/`.docx`) — a discrete deliverable, separate from the workbook and the deck.

## Step 12 — Build the presentation deck (LAST)

Build the deck **only after the cross-check (Step 9), QC (Step 10), and the evidence summary
(Step 11)** so the slides carry the corrected, verified data. Use `scripts/build_deck.js` (white theme, Arial): title → framework →
**one slide per proband** (clinical description + variants + PMID + points) → genetic total →
**one detailed slide per experiment** (molecular-level methods & findings + PMID + points + a
dashed **screenshot placeholder** the user fills with figure panels) → experimental total →
classification. Run with `NODE_PATH="$(npm root -g)" node build_deck.js` after
`npm install -g pptxgenjs`. LibreOffice/poppler are usually absent on macOS, so you can't render
slides to images for visual QA — lay out spacing carefully and have the user open the file.

## Hard-won gotchas

- **Unique proband labels across publications** — the GCI treats a reused label as the same person.
- Keep **one** consolidated individual table (don't leave a separate proband-scoring table lying around).
- Show component points but enter the **rounded** GCI value.
- Re-read the SOP for the exact defaults/caps for the SOP **version** in use — they change between versions.
