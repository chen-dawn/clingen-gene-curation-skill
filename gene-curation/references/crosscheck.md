# Adversarial cross-check machinery (Step 9)

Verify **every row of evidence against its source paper** before finalizing. Do not trust
the transcription — this pass reliably catches real errors (in one real curation it caught a
swapped ethnicity between two patients, a missing scored phenotype, an inferred cDNA the
paper never stated, and several "cited-not-shown" experiments).

## Orchestration

Run it in **two waves**, **one agent per row**, launched in parallel (Agent tool; or a
Workflow if the user opted into orchestration):

1. **Wave 1 — genetic rows:** one agent per scored individual.
2. **Wave 2 — experimental rows:** one agent per paper × experiment type.

Give each agent (a) the **exact recorded row values** and (b) the **path to that paper's
extracted `.txt`** (from Step 1). Agents cannot render PDFs — always point them at the text
file. Then: collect every agent's findings → **apply corrections** to the **workbook** (the
evidence summary and deck are produced afterward, Steps 11–12, from the corrected data) → give
the user a **changelog**. Re-run `build_workbook.py` after edits.

Each agent returns: a one-line `CONFIRMED:` then `ISSUES:` bullets, **each with the corrected
value and where in the paper it appears (table/figure/section/line)**. If clean: "All fields
verified, no changes."

## Prompt template — individual (genetic) row

```
Cross-check ONE curation row against its source paper. Read the paper text at: <PATH>.
(<Author Year>, <journal>, PMID <PMID>. See especially <Table/Fig>.)

Recorded individual — "<label>":
- Variant 1: <transcript>:<cDNA> (<protein>), <type>
- Variant 2: <...>   ·   Zygosity: <comp-het / homozygous>
- Sex / ancestry / age: <...>
- Methods: <sequencing>; genome-wide = <Y/N>
- HPO recorded: <label list>   ·   NOT-phenotypes: <...>
- PMID: <...>   ·   Proband score: <...>

Report ONLY problems:
1. HGVS accuracy — do the cDNA AND protein change match the paper EXACTLY (position, ref>alt,
   consequence)? Confirm the reference TRANSCRIPT the paper uses; FLAG if it differs from what
   was recorded or from other papers (coordinates differ between transcripts). Flag any cDNA↔protein
   inconsistency. If the paper gives ONLY a protein change, flag the cDNA as inferred/unverified.
2. Zygosity / in-trans / homozygous — matches paper?
3. Phenotypes — is each recorded HPO feature actually reported for THIS individual (check the
   per-patient table column, not the cohort summary)? Any reported feature MISSING? Any recorded
   feature NOT supported (e.g. "ND"/absent for this patient)?
4. Demographics (sex, ancestry, age) — correct for THIS patient?
5. Methods, PMID — correct?
Return "CONFIRMED:" then "ISSUES:" (corrected value + paper location). If all correct, say so.
```

## Prompt template — experimental row

```
Cross-check ONE experimental-evidence row against its source paper. Read: <PATH>.
(<Author Year>, PMID <PMID>.)

Recorded row — <Paper> (PMID <PMID>); Experiment type: <type>:
- Sub-type: <...>   ·   Experiment name: <...>
- Description / model / gene alteration: <...>
- (Model & human phenotype HPO, or phenotype-to-rescue + method + "WT rescues?"/"patient
  variant rescues?" for Rescue)
- Explanation: <...>   ·   Suggested points: <...>

Report ONLY problems:
1. Is each stated finding actually in THIS paper? Quote where (figure/section). CRUCIAL: flag
   anything that is CITED from prior references rather than experimentally shown in this paper.
2. Are model/system, method, and any variants described accurately? Quantitative claims correct?
3. Are the HPO/MP mappings appropriate? Is the score/sub-type reasonable per the SOP?
4. Anything inaccurate, overstated, or missing?
Return "CONFIRMED:" then "ISSUES:" (corrected wording + location). If all correct, say so.
```

## Omission checks (run once over the whole set)

- Probands or experiments present in a paper but **missing** from the table.
- Variants **double-counted**; recurrent/founder variants noted.
- Mouse/cell lines that are the **same allele re-analyzed** in two papers (score once, others "support").
- **Non-PMID** sources (can't enter GCI — document in evidence summary).

## Changelog format (give this to the user)

Group as **Factual errors fixed** / **Precision & provenance fixes** / **Additions** /
**Verified clean**. State whether any change alters the totals or classification (usually it
does not — case-level caps at 12, experimental at 6).

## Pitfall library (check these explicitly — all seen in real curations)

- **Per-patient table columns**: read the *individual's column*, not the cohort row. Wide tables
  wrap in extracted text and columns can shift — a swapped value (e.g., ethnicity between two
  adjacent patients) is easy to make and easy to miss.
- **Non-canonical splice** (+5/−5, deep-intronic) is **not** an automatic null — 0.1 unless
  functional LOF is shown.
- **Inferred cDNA/transcript**: some papers give only a protein change (e.g., "p.Ala99Gly, exon 4").
  Don't record a c. notation or NM version the paper doesn't state — flag as inferred.
- **Transcript mismatch across papers** (e.g., NM_201647 vs NM_006463.4) → coordinates differ;
  harmonize to MANE Select and note.
- **"Cited vs shown"**: biochemical-function and protein-interaction claims are often *cited from
  earlier papers*, not experimentally demonstrated in the paper being scored — don't credit them
  as that paper's experiment.
- **Same model line in two papers** (e.g., a constitutive KO re-analyzed) → not independent; score once.
- **Rescue specifics**: which phenotype was actually rescued, WT vs patient-variant, and whether
  rescue was **partial** (survival extended but animals still die) — papers often overstate if paraphrased.
- **Non-significant trends** reported as findings (e.g., a marker "reduced" that didn't reach significance).
- **Consanguineous homozygous missense** → downgrade unless functional data (runs of homozygosity).
- **Primary paper absent**: if a model/assay is only known via a secondary citation, flag it and
  recommend obtaining the primary PMID.
- **Non-English papers**: verify against the original-language body + figures, not just the English
  abstract (abstracts can carry translation errors, e.g., "described" vs "not described").
