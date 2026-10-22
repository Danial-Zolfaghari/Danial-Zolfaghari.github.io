# Engineering Hub — maintenance and rollback

This repository contains the **published GitHub Pages output**. The existing React application is currently represented by a compiled JavaScript asset rather than editable React source files. Treat direct edits to `assets/index-BhDQvKz6.js` as fragile; prefer rebuilding from the original React source when available.

## Current site organization

- `/` — professional portfolio, identity and selected projects
- `/work/` — existing engineering projects / case studies
- `/foundation/` — existing engineering foundation
- `/insights/` — reviewed engineering analysis only; one evidence-based note at launch
- `/updates/` — curated engineering milestones and public GitHub releases
- `/assets/engineering-hub.css` — styling for independent editorial pages
- `/assets/engineering-releases.js` — progressively enhances **static** release cards by fetching the latest stable release from public GitHub APIs

Do not turn this into an automated list of every commit. Publish changes only when they demonstrate a substantial engineering decision, public release, documented case study, or verified feature.

## Publishing checklist

1. Verify every technical statement against source code, documentation or released behavior.
2. Avoid exposing private infrastructure, internal logs, confidential customer information, or production security controls.
3. Give an article its own purpose; do not duplicate an existing project case study.
4. Link an article to its relevant portfolio project page and public source repository when available.
5. Add or update the article's canonical URL, metadata, structured data and sitemap entry.
6. For project releases, only use actual published GitHub release records. Never fabricate release dates, tags, activity numbers or uptime.
7. If adding a new public repository to the release feed, update both the static cards in `updates/index.html` and the allowlisted names in `assets/engineering-releases.js`.
8. Run `python scripts/validate_site.py`, `node --check assets/index-BhDQvKz6.js`, and `node --check assets/engineering-releases.js` before publishing.

## Backup / restore point

**Original complete portfolio commit:** `48ea25e9c851caaaf3e80386650d43c4201d77fe`

**Immutable-intent backup branch:** `backup/pre-engineering-hub-2026-10-22`

This branch was created from the exact original commit **before any Engineering Hub edits**. It preserves the previous portfolio content and compiled assets. Do not delete or advance this branch. To roll back, prepare a new restoration commit/PR that makes the publication tree match the backup branch; review changes and tests before merging. Avoid force-pushing `main` as a routine rollback strategy.

Engineering Hub publications were reviewed and merged through:
- PR #1 (feature): `d2aa98862bd28a06eca1da0ff93fd0a5f1b51ea1`
- PR #2 (cache invalidation): `7c9f5af54f3b6ed54cf26a6d59931a7ebd5743fe`
- PR #3 (static GitHub release fallback): `39e7e6ae4ef678c3c974ece6e6508d9127a12285`

## Repository README cross-links

The following **separate public repositories** received README-only backlink commits. Their history is independent of this portfolio backup. Each can be reverted separately if restoring all cross-repo changes.

| Repository | README backlink commit |
| --- | --- |
| ProcDomainSniffer | `9edd92027184aa9cb5e53a1fde8cb99215f4b984` |
| TunnelGate | `9ad4d05c6ff3cf3fa7aec687c027290de1898a97` |
| DZ-Operations-Console | `c41010b8b20248f65a9cbfca8d9b5ff3b794edc3` |
| ELK-Checker | `7089b31828515ab7b4ec6f55566e813e354b1fd1` |
| Round-Robin | `30211d78195e3012b59a407e323844b21ba67154` |

These README commits contain only the link to their respective portfolio case study. If later documentation has changed, review the diff before reverting so unrelated updates are not overwritten.

## Known boundaries

- New content pages are standalone static HTML, deliberately separated from the compiled React SPA.
- Live GitHub release metadata is requested in the visitor's browser; the static cards work without JavaScript or API access.
- GitHub Actions tests validate markup, paths, canonical URLs, JSON-LD, JavaScript syntax, and static release links. They do **not** replace desktop/mobile browser visual regression testing.
- Google's indexing and rankings are not guaranteed and may take time.
