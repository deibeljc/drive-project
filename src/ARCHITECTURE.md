## System Design

### Brain dump

The CLI takes an input file containing commands (Partner, Company, Employee, Contact) and:

1. Parses and validates each line
2. Stores entities in SQLite via Drizzle ORM
3. Outputs a relationship report showing the strongest partner connection per company

### Tech stack

- Bun runtime
- TypeScript
- Drizzle ORM + SQLite for persistence
- ts-pattern for command matching

### File Structure

```
src/
├── db/
│   ├── schema.ts          # Partner, Company, Employee, Connection tables
│   └── client.ts          # Drizzle client
├── core/
│   ├── parsers.ts         # Command parsing & validation
│   └── logging.ts         # Pino logger
├── api/
│   └── services/
│       └── connections.ts # Query logic for relationships
├── cli/
│   ├── index.ts           # CLI entry point
│   └── generate.ts        # Sample data generator
└── web/                   # (future) React frontend
```
