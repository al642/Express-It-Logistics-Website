# Color Standardization TODO

## Plan: Standardize color grading across entire site to match localhost design

### STEP 1 — DEFINE BRAND VARIABLES ✓

- [x] Update :root with --brand-primary (#db2777) and --brand-primary-hover (#be185d)
- [x] Add light-bg (#ffffff), light-text (#111111), dark-bg (#0f172a), dark-text (#ffffff) semantic variables
- [x] Keep legacy --brand-pink mapped to --brand-primary for backward compatibility

### STEP 2 — GLOBAL BODY COLORS ✓

- [x] Update body styles to use --light-bg and --light-text variables
- [x] Update body.dark-mode styles to use --dark-bg and --dark-text variables

### STEP 3 — BUTTON CONSISTENCY ✓

- [x] Update .btn-primary to use --brand-primary
- [x] Update .btn-primary:hover to use --brand-primary-hover
- [x] Update .main-nav .btn-primary to use --brand-primary
- [x] Update .support-note to use --brand-primary

### STEP 4 — REMOVE HARD-CODED COLORS ✓

- [x] All buttons now use CSS variables consistently

## Implementation Complete ✓
