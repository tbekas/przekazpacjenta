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
  USER {
    uuid id PK
    text name
    text email
    text phoneNumber
    timestamp createdAt
  }
  FACILITY {
    uuid id PK
    text name
    text email
    text phoneNumber
    text streetWithNumber
    text zipCode
    text city
    timestamp createdAt
  }
  ENROLLMENT {
    uuid id PK
    uuid facilityId FK
    uuid userId FK
    boolean approved
    varchar approvalTokenHash
    timestamp expirationAt
    timestamp createdAt
  }
```
