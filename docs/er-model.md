# Entity Relationship Model

## Useful links

- Article on Wikipedia about [ER model](https://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model)
- Creating ER diagrams with [Mermaide](https://mermaid-js.github.io/mermaid/#/entityRelationshipDiagram)
- VS Code extension [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid)

## Diagram

```mermaid
erDiagram
  USER ||--|{ ENROLLMENT : request
  FACILITY ||--|{ ENROLLMENT : approves
  USER }o--o{ FACILITY : "enrolled in"
  VACANCY-AD }o--o{ CATEGORY : "categorised in"
  USER {
    uuid id PK
    text name
    text email
    text phoneNumber
    timestamptz createdAt
  }
  FACILITY {
    uuid id PK
    text name
    text email
    text phoneNumber
    text streetWithNumber
    text zipCode
    text city
    timestamptz createdAt
  }
  ENROLLMENT {
    uuid id PK
    uuid facilityId FK
    uuid userId FK
    boolean approved
    varchar approvalTokenHash
    timestamptz expirationAt
    timestamptz createdAt
  }
  CATEGORY {
    uuid id PK
    boolean archived
    jsonb pl
    jsonb en
    timestamptz createdAt
  }
  VACANCY-AD {
    uuid id PK
    uuid facilityId FK
    uuid userId FK
    jsonb categories
    text name
    text description
    boolean active
    timestamptz createdAt
  }
```
