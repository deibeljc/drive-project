# Drive Network

Track partner-company relationships through connection events.

## Getting Started

```bash
bun install
bun cli process input.txt
```

### CLI Commands

```bash
bun cli generate
bun cli process input.txt
bun cli create <type> <args> ...
```

## Architecture

- **CLI** — Takes an input file, parses commands, outputs relationship report
- **Services** — Parsers (ingest) and Connections (query) abstract DB access
- **Storage** — SQLite for structured data

### System Diagram

```mermaid
flowchart LR
    Input["input.txt"] --> CLI

    subgraph CLI["CLI (bun cli)"]
        Parser["Parser"]
    end

    subgraph Services
        Connections["Connections"]
    end

    subgraph DB["Database"]
        SQLite[(SQLite)]
    end

    CLI --> Parser --> SQLite
    CLI --> Connections --> SQLite
    CLI --> Output["stdout"]
```

### Data Model

```mermaid
erDiagram
    direction LR
    Partner ||--o{ Connection : has
    Employee ||--o{ Connection : has
    Company ||--o{ Employee : employs

    Partner
    Company
    Employee
    Connection
```
