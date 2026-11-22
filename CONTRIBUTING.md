# Contribution and publishing workflow

This project belongs to the user. Coding assistants may prepare changes and create local commits; the user alone publishes them to the remote repository.

## New design changes

1. Check the working tree and preserve unrelated work.
2. Create a new branch with a descriptive name, such as `design/rail-track-background`.
3. Implement the requested design and run the relevant checks.
4. Stage only the files for that change and commit locally.
5. Give the user the branch name, commit hash, change summary, and verification results.
6. Leave the push to the user. Assistants must not push or upload commits through Git or another service.

## Commit identity

Use the user's existing configured Git name and email for local commits. Do not substitute an assistant or bot identity, append AI `Co-authored-by` or `Signed-off-by` trailers, or add the assistant to contributor lists. If identity is not configured, ask the user before committing.

This policy governs new commits. It does not remove contributors from existing history or change how a hosting service derives its contributor list. Preserve original authorship, licenses, and required third-party credits.

## Files to publish

Keep application source, required public assets, dependency manifests, and these repository instructions under version control. Generated builds, installed dependencies, local secrets, and other files covered by `.gitignore` stay out of commits. Local review guides may remain ignored according to the user's `.gitignore` choices.
