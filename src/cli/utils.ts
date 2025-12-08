import type {
  CompanyConnection,
  CompanyRelationship,
  GroupedConnections,
} from "src/api/services/connections";

const FIRST_NAMES = [
  "Alex",
  "Jamie",
  "Jordan",
  "Taylor",
  "Morgan",
  "Casey",
  "Riley",
  "Quinn",
  "Avery",
  "Parker",
  "Skyler",
  "Reese",
  "Drew",
  "Charlie",
  "Sam",
  "Finley",
  "Sage",
  "Emery",
  "Blair",
  "Rowan",
  "Kai",
  "Hayden",
  "Dakota",
  "Peyton",
];

const COMPANY_NAMES = [
  "Globex",
  "ACME",
  "Hooli",
  "Initech",
  "Umbrella",
  "Cyberdyne",
  "Wonka",
  "Stark",
  "Wayne",
  "Oscorp",
  "Nexus",
  "Vortex",
  "Zenith",
  "Apex",
  "Nova",
];

const CONTACT_TYPES = ["email", "call", "coffee"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function pickUnique<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

export function generateSampleData(options: {
  partners?: number;
  companies?: number;
  employeesPerCompany?: number;
  contacts?: number;
}): string {
  const {
    partners = 3,
    companies = 3,
    employeesPerCompany = 2,
    contacts = 5,
  } = options;

  const lines: string[] = [];

  // Pick unique partners and companies
  const partnerNames = pickUnique(FIRST_NAMES, partners);
  const companyNames = pickUnique(COMPANY_NAMES, companies);

  // Generate partners
  for (const name of partnerNames) {
    lines.push(`Partner ${name}`);
  }

  // Generate companies
  for (const name of companyNames) {
    lines.push(`Company ${name}`);
  }

  // Generate employees (track for contacts)
  const employees: { name: string; company: string }[] = [];
  const usedNames = new Set(partnerNames);

  for (const company of companyNames) {
    let added = 0;
    for (const name of FIRST_NAMES) {
      if (added >= employeesPerCompany) break;
      if (!usedNames.has(name)) {
        usedNames.add(name);
        employees.push({ name, company });
        lines.push(`Employee ${name} ${company}`);
        added++;
      }
    }
  }

  // Generate contacts
  for (let i = 0; i < contacts && employees.length > 0; i++) {
    const emp = pick(employees);
    const partner = pick(partnerNames);
    const type = pick(CONTACT_TYPES);
    lines.push(`Contact ${emp.name} ${partner} ${type}`);
  }

  return lines.join("\n");
}

/**
 * Format relationships as the spec requires:
 * CompanyName: PartnerName (N)
 * CompanyName: No current relationship
 */
export function formatRelationships(
  relationships: CompanyRelationship
): string {
  return relationships
    .map((r) =>
      r.partnerName
        ? `${r.companyName}: ${r.partnerName} (${r.strength})`
        : `${r.companyName}: No current relationship`
    )
    .join("\n");
}

/**
 * Formats grouped connections by company into a string.
 * TODO: Return a nice tree structure of connections by company and partner
 * @param connections Grouped connections by company
 * @returns String of company name and number of total connections
 */
export function formatConnections(connections: GroupedConnections): string {
  return connections
    .map((c) => {
      return `${c.company.name}: ${c.connections.length} connections`;
    })
    .join("\n");
}
