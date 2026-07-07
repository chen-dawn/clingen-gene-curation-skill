# GCI form field map (for copy-paste sheets)

> Transcribed from the GCI curation forms (ClinGen Gene Curation Interface, SOP v10.1):
> Individual, Family, Group, Case-Control, and Experimental Data. Evidence can be entered at
> the Individual, Family, or Group level; variants that count toward the classification must be
> captured at the **Family or Individual** level (not Group).

Build the workbook tabs so each column maps to a GCI field. Disease is the same for
every individual — the GCI "Copy disease term from Gene-Disease Record" button fills it,
or paste the MONDO id. (On the Individual form the disease field is optional, not required.)

## Curate Individual Information

- **Individual Label*** — author + case descriptor, unique across publications (`Smith Case 5`).
- **Is this Individual a proband*** — Yes/No.
- **Disease for individual*** — MONDO id.
- **Phenotype(s) in Common (HPO IDs)** — comma-separated IDs only (`HP:0000253, HP:0025104`).
  Keep a *parallel* human-readable "descriptors/labels" column in your sheet (not entered) for review.
- **Phenotype(s) in Common (free text)** — features with no confident HPO id.
- **NOT Phenotype(s) (HPO IDs / free text)** — features explicitly absent (e.g. a hallmark
  feature missing in a phenotype-expansion case).
- **Demographics** — Sex*, Country of Origin, Ethnicity, Race, Age (Type / Value / Unit).
- **Methods** — Previous Testing; Genome-wide method used? (Yes/No — Yes for exome/genome);
  Genotyping Method 1 & 2 (Exome sequencing, Sanger, homozygosity mapping, SNP array…);
  Description of genotyping method.
- **Associated Variant(s)** — checkbox *in trans* (compound het) / checkbox *homozygous*
  (enter only 1 variant if homozygous); Variant 1 / Variant 2 (HGVS; ClinVar VariationID when available).
- **Additional Information**, **PMID(s)**.

Fold the scoring (per-variant scores, proband total, rationale) into this same table so
there is a single consolidated individual table.

## Curate Family Information

Curate the Group first if the family belongs to one. Fields: **Family Label*** · Disease(s) in
common (MONDO) · Phenotype(s) in common (HPO IDs / free text) · NOT phenotype(s) · Demographics
(Country, Ethnicity, Race) · Methods (Previous testing, Genotyping Method 1/2, description).
**Segregation:** # AFFECTED with genotype* · # UNAFFECTED without the biallelic genotype
(required for recessive) · # segregations (for AD/XL LOD) · inconsistent segregations? (explain)
· **consanguineous?** · pedigree location · **Published LOD?** and whether to include it in the
aggregate. To also score the proband, create the **Individual** proband (with variants) under the
family. Additional info · PMID(s).

## Curate Group Information

**Group Label*** · Disease(s)/Phenotype(s) in common · Demographics (# males, # females, Country,
Ethnicity, Race, Age range) · **Group counts:** total individuals*, # with/without family info,
# with/without variant in the gene, # with a variant in another gene (+ HGNC list) · Methods ·
Additional info · PMID(s). Note: **variants counting toward the classification are captured at the
Family/Individual level, not the Group level** — after submitting a Group you're prompted to add
Family/Individual entries.

## Curate Case-Control Evidence

Two cohorts. **Case cohort:** label*, disease/phenotype in common, demographics (# males/females,
country, ethnicity, race, age range), methods, and **Power — # cases with variant in gene* / # all
cases genotyped* (→ case frequency)**; other genes with variants; PMID(s). **Control cohort:**
label*, demographics, methods, **# controls with variant* / # all controls genotyped* (→ control
frequency)**. **Evaluation (required to score):** Study type (single-variant vs aggregate)*;
detection method; **statistics** — test statistic, value, p-value, confidence interval; **four
bias questions** (matched by demographics? matched for genetic ancestry? equivalently evaluated for
disease/family history? differ in other variables?). Score status: Score / Review / Contradicts.
(Scoring guidance in `scoring_reference.md`.)

## Curate Experimental Data Information

Select **Experiment type**, then fill the type-specific fields. Every type ends with a
**Select status: Score / Review / Contradicts**.

- **Biochemical Function** — choose **A** (function shared with other disease genes) or **B**
  (consistent with phenotype). Experiment name*; **Identified function — GO ID*** (molecular
  function / biological process) + free text; **Evidence for the function***; for B:
  **Phenotype(s) consistent with function (HPO ID* + free text)** + explanation of how the
  phenotype is consistent with disease.
- **Protein Interactions** — Experiment name*; **Interacting gene(s) — HGNC symbol***;
  **Interaction Type*** (dropdown); **Method by which interaction detected*** (dropdown, e.g.
  Y2H/coIP); "**Has this gene been implicated in the disease?**" checkbox; explanation of the
  relationship.
- **Expression** — choose **A** (expressed in disease-relevant tissue) or **B** (altered in
  patients). A: **Organ/tissue — Uberon ID*** + free text; "**Is the gene normally expressed in
  that tissue?**" checkbox; evidence.
- **Functional Alteration** — Experiment name*; **patient vs non-patient cells***; **Normal
  function of gene/product — GO ID*** + free text; **Description of gene alteration***; **Evidence
  for altered function***; **Associated variant (ClinVar VariationID)**.
- **Model Systems** — Experiment name*; **non-human model organism vs cell-culture model***;
  **Description of gene alteration***; **Phenotype(s) in model (HPO/MP ID* + free text)**;
  **Human phenotype(s) (HPO ID* + free text)**; **explanation of how model resembles human***;
  associated variant (ClinVar VariationID).
- **Rescue** — Experiment name*; **rescue in human / non-human model / cell-culture / patient
  cells***; **Description of gene alteration***; **Phenotype to rescue (HPO ID* + free text)**;
  **Description of method used to rescue***; **"Does the wild-type rescue?"** checkbox and **"Does
  patient variant rescue?"** checkbox; explanation; associated variant (ClinVar VariationID).

In a single unified experimental sheet, columns G/H ("phenotype") serve as *model
phenotype* for Model Systems and *phenotype-to-rescue* for Rescue; Human-phenotype columns
are Model-Systems-only; Method/WT-rescues/patient-variant-rescues columns are Rescue-only.
Add a GO-ID column (Biochemical Function, Functional Alteration), a Uberon-ID column
(Expression), and Interaction-type/method columns (Protein Interactions) as needed.
