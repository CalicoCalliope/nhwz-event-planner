# AI usage disclosure

Kept current at each sprint review and at handover (PRD section 12).

| Tool | Used for | Deliverables affected | How output was reviewed and tested |
| --- | --- | --- | --- |
| Claude Code (Anthropic) | Coding assistant used under the developer's direction for implementation, tests and documentation drafts | `src/`, `data/events.json`, `docs/` | Reviewed by the developer; automated tests, lint and build pass; screens checked against the design at mobile and desktop widths |

Event records were transcribed with AI assistance from the client's programme image and prototype, not
generated. The team should check the transcription (`docs/event-data-review.md`). Test-only records and demonstration
descriptions are marked as such in the data and in the UI.
