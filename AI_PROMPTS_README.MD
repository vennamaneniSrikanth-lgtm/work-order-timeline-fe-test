<!-- #Prompt 1 — Generating realistic manufacturing work center names -->
"I'm building a manufacturing ERP timeline component. Give me 8 realistic work center names that would
exist in a mid-size discrete manufacturing facility (metal fabrication / assembly plant). Include a mix of
CNC machines, assembly stations, and quality/finishing lines. Return them as a TypeScript array of objects
with docId and name fields."
Used for: sample-data.ts — work center seed data.


<!-- Prompt 2 — Generating realistic work orders spread across time -->
"Generate 12 realistic work order records for a manufacturing ERP system. Each order should have a name
(e.g. 'WO-1042 – Bracket Fabrication'), a status of open | in-progress | complete | blocked, a startDate and
endDate in ISO format (YYYY-MM-DD), and a workCenterId referencing one of these IDs: [wc-001 …
wc-005]. Rules:
Spread dates across a 3-month window centred on today's date
Make sure at least one work centre has 2 non-overlapping orders
Every status type must appear at least once
At least one order should span more than 14 days Return valid TypeScript."
Used for: sample-data.ts — work order seed data.


<!-- Prompt 3 — Understanding ERP work order statuses -->
"In a manufacturing ERP system, what is the real-world business meaning of these four work order
statuses: Open, In Progress, Complete, Blocked? Give a one-sentence definition for each so I can write
accurate tooltip/label copy in the UI."
Used for: Status badge label copy and getStatusLabel() helper.


<!-- Prompt 4 — Work center vs. work order data model clarification -->
"In manufacturing ERP terminology, what is the difference between a 'Work Center' and a 'Work Order'?
How do they relate to each other? I'm designing a relational data model where WorkOrder has a
workCenterId foreign key. Is this the standard approach or should I model it differently?"
Used for: Confirming the WorkOrderDocument.data.workCenterId reference pattern.


<!-- Prompt 5 — Overlap detection logic -->
"I have an array of work orders, each with a startDate and endDate string in ISO format. I need a
TypeScript function hasOverlap(workCenterId, newStart, newEnd, excludeId?) that returns true if [newStart,
newEnd] overlaps any existing order on the same work center (excluding the order with excludeId when
editing). Two orders overlap if one starts before the other ends. Write the function with strict TypeScript
types."
Used for: WorkOrderService.hasOverlap() method.
