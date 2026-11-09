# English portfolio

English lives in `en/`; Spanish remains at the repository root. Both use the same CSS, JavaScript and media. Pages work from a GitHub Pages project subdirectory. ES / EN links retain the current page, project, gallery and anchor. Language selection is explicit, without automatic redirection or cookies.

## Editing

Keep each of the three root HTML pages and its counterpart in `en/` in sync when making content or structural changes. Translate public text and accessibility labels, but preserve project IDs, CSS hooks and category codes. English media URLs use `../assets/`.

Update `assets/data/projects.json` and `projects.en.json` together. Publication titles remain bibliographically accurate: `publications.en.json` uses optional `titleTranslation` for English glosses. Do not translate image paths or inventory codes.

Spanish CV: `assets/cv/angeles-solis-cv.pdf`. English CV: `assets/cv/angeles-solis-cv-en.pdf`, with editable full translation in the matching Markdown file. The English PDF includes all source entries, not an abridged résumé.

## Review before release

- Europa Nostra is 2005, following the project's previously verified diploma correction; the unchanged Spanish PDF still says 2006.
- The original CV dates both the cultural-sector AI course and Art in Transit 2.0 to 2006. Retained pending confirmation.
- The original CV dates the La Acebeda triptych to the 13th century. Retained pending confirmation.
- The 2006 Granada entry says three paintings but lists four. All four titles are retained without asserting a count in English.
- Existing project descriptions contain unresolved source conflicts, including the period of the Zamora murals and the artist name “Pato Denis Belgrano” for Málaga. Translation does not resolve these historical assertions.

## Validation

Use Node.js with Playwright and Google Chrome available. Start a local HTTP server, then run:

```
node tests/languages.cjs
node tests/portfolio-audit.cjs
node tests/reduced-motion.cjs
```

Set `TEST_BASE` to test a project subpath (for example `http://127.0.0.1:8766/portfolio-english/`). The audit checks both languages, all 22 projects and their images, publication lists, CV availability, language-switch state and six viewport widths. Screenshots are review artifacts, not website files.

No production branch or Pages setting needs changing to review this branch. Merge and synchronisation to Ángeles' `main` are separate release steps and will update the live site.
