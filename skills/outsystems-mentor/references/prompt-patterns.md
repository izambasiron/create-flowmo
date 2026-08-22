# Mentor Pattern Vocabulary and Constraints

Mentor maps specific keywords to known implementations more reliably than generic descriptions
("show the data nicely" forces it to guess a pattern). These are the recognized keywords and the
hard constraints Mentor enforces — facts about the interface, not OutSystems' authored prose.
For worked examples and the full cookbook, see the authoritative source linked at the bottom.

## Layout pattern keywords

`table`, `card list`, `gallery`, `master detail`, `dashboard`, `popup`, `accordion`, `sidebar`

Mentor Web's own prompt cookbook also recognizes `map` for location-based patterns ("card list
with map", "list with map") — not in the general cross-tool vocabulary list above, but a real
keyword for that specific tool.

## Dashboard element keywords

`counter`, `bar chart`, `pie chart`, `donut chart`, `line chart` — pair with an aggregation
function (count, sum, avg, min, max) when requesting one, e.g. "a counter for total orders
(count)" rather than just "a counter."

## Relationship keywords

`one-to-many`, `many-to-many`, `foreign key`

## Hard structural constraints

Mentor automatically switches to a compatible pattern when a request exceeds these — worth
knowing up front so the first prompt already asks for something Mentor can actually build:

| Pattern | Constraint |
|---|---|
| Popup, accordion | Max 5 non-ID attributes. Entities with more attributes fall back to a table. |
| Master detail (table view) | Max 5 attributes in the list portion. |
| Dashboard lists | Max 5 records, no filters or pagination. |
| Entities with dependents (other entities reference them) | Cannot use popup or master-detail patterns. |

## Example prompt shapes (illustrative, not from the source docs)

Basic → detailed progression works well for any pattern:

- Basic: "List Invoice records in a table."
- Detailed: "List Invoice records in a table with columns Number, Client, DueDate, Status. Add a status badge colored by Status."

Combining a dashboard with a browsing pattern in one prompt is fine once the data model is
already established:

- "Add a dashboard with a counter for overdue invoices (count) and a bar chart of revenue by month (sum of Amount)."

## Authoritative source

These are facts extracted from OutSystems' own documentation, not a copy of it. For the full
cookbook — entity-first thinking, decomposition, requirement documents, dark themes, and worked
examples per pattern — read directly:

- [Effective prompts for Mentor](https://github.com/OutSystems/docs-odc/blob/main/src/eap/agentic-development/effective-prompts.md)
- [Prompts for Mentor Web](https://github.com/OutSystems/docs-odc/blob/main/src/eap/agentic-development/mentor-web/prompts.md)
- [Prompts for Mentor Studio](https://github.com/OutSystems/docs-odc/blob/main/src/eap/agentic-development/mentor-studio/prompts.md)
