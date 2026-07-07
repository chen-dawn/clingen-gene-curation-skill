# Pre-submission QC checklist

Run before declaring a curation ready for GCEP review / GCI entry.

## Disease entity & precuration
- [ ] MOI is correct and matches the GCI record and every scored proband.
- [ ] Lumping/splitting decision documented (mechanism / inheritance / phenotypic variability) with the entity + OMIM/MONDO id.
- [ ] Phenotype-expansion cases and disease mimics/overlaps noted.

## Genetic evidence
- [ ] Every proband has a **unique, author-prefixed label** (GCI treats a reused label as the same person).
- [ ] Each variant scored by type; AR = both variants summed; homozygous ×2; per-proband cap 3; category cap 12.
- [ ] Non-canonical/deep-intronic splice not scored as null without functional support.
- [ ] Consanguineous homozygous missense downgraded appropriately.
- [ ] Siblings not double-scored (one proband/family + segregation).
- [ ] Every HGVS verified against the paper; transcript harmonized (MANE Select) and noted where papers differ; inferred cDNAs flagged.
- [ ] Recurrent/founder variants identified; no variant double-counted.

## Experimental evidence
- [ ] Each row = work actually shown in that paper (not cited from elsewhere).
- [ ] Same model line not counted as two independent models.
- [ ] Function ≤2, Functional Alteration ≤2, Models & Rescue ≤4; experimental total ≤6.
- [ ] Rescue rows state what was rescued, WT vs patient variant, and partial vs full.

## Ontology & provenance
- [ ] HPO IDs verified against the term (IDs-only in the paste column; a readable label column alongside).
- [ ] MONDO id confirmed via OLS; every PMID verified (PubMed) — none invented.
- [ ] Non-PMID sources documented in the evidence summary (not enterable in GCI).

## Cross-check (Step 9)
- [ ] One agent per row ran against the source paper; findings applied; changelog produced.

## Deliverables
- [ ] Workbook tabs map to GCI fields; scores match the scoring reference.
- [ ] Evidence summary follows the template; classification statement matches the calculated class (or override rationale documented).
- [ ] Deck: placeholders (`[Meeting date]`, screenshots) flagged for the user; open once to check layout (no image render available on macOS).

## Classification
- [ ] Total = genetic (≤12) + experimental (≤6); class matches thresholds; Definitive only if >3 yr since first report, replicated in research + clinical settings, and no valid contradictory evidence.
