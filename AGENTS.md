# Repository instructions

Read and follow [CONTRIBUTING.md](CONTRIBUTING.md) before making changes or creating commits.

## Git workflow and authorship

- Start every new design change on a new, descriptively named branch. Do not implement or commit new designs directly on `main` or `master`.
- Commit completed, verified changes locally using the user's existing configured Git identity. Stage only files belonging to the requested task.
- Do not add Codex, OpenAI, an AI assistant, or a bot as a commit author, committer, co-author, or project contributor. Do not append assistant `Co-authored-by` or `Signed-off-by` trailers or assistant credit in commit messages.
- If the user's Git identity is missing, ask for their details rather than inventing an identity or changing global Git settings.
- Only the user may push to a remote repository. Never run `git push`, force-push, or upload commits through an API, even after committing locally. Report the branch, commit hash, and verification results so the user can push themselves.
- Preserve existing commit history, original authorship, licenses, and required third-party attribution.

## Documentation lookup

Use Context7 for current library, framework, SDK, API, CLI, and cloud-service documentation. Resolve the library ID before querying unless an exact Context7 ID is supplied. Scope each query to one concept and prefer primary documentation. General programming and source-only reviews that do not depend on an external API do not need a documentation lookup.

## Design guidance

Preserve the approved transit identity and follow `docs/UI.md` and `docs/ANIMATIONS.md` when those local guides are available. Verify representative desktop/mobile views and affected interactions. Do not claim visual checks that were not performed.
