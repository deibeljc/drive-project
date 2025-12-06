import { db } from "@db/client";
import { Company, Partner } from "@db/schema";
import { match } from "ts-pattern";
import { eq } from "drizzle-orm";
import { Employee, Connection } from "@db/schema";

const VALID_COMMANDS = ["Partner", "Company", "Employee", "Contact"] as const;
const VALID_CONTACT_TYPES = ["email", "call", "coffee"] as const;

export type Command = (typeof VALID_COMMANDS)[number];
export type ContactType = (typeof VALID_CONTACT_TYPES)[number];

export class ParseError extends Error {
  constructor(message: string, public lineNumber?: number) {
    super(lineNumber ? `Line ${lineNumber}: ${message}` : message);
    this.name = "ParseError";
  }
}

export async function parsePartner(
  args: string[],
  lineNumber?: number
): Promise<void> {
  if (args.length !== 1) {
    throw new ParseError(
      `Partner requires 1 argument, got ${args.length}`,
      lineNumber
    );
  }
  await db.insert(Partner).values({ name: args[0]! }).onConflictDoNothing();
}

export async function parseCompany(
  args: string[],
  lineNumber?: number
): Promise<void> {
  if (args.length !== 1) {
    throw new ParseError(
      `Company requires 1 argument, got ${args.length}`,
      lineNumber
    );
  }
  await db.insert(Company).values({ name: args[0]! }).onConflictDoNothing();
}

export async function parseEmployee(
  args: string[],
  lineNumber?: number
): Promise<void> {
  if (args.length !== 2) {
    throw new ParseError(
      `Employee requires 2 arguments, got ${args.length}`,
      lineNumber
    );
  }
  const [name, companyName] = args as [string, string];
  const company = await db
    .select()
    .from(Company)
    .where(eq(Company.name, companyName))
    .get();
  if (!company) {
    throw new ParseError(`Company not found: ${companyName}`, lineNumber);
  }
  await db
    .insert(Employee)
    .values({ name, companyId: company.id })
    .onConflictDoNothing();
}

export async function parseContact(
  args: string[],
  lineNumber?: number
): Promise<void> {
  if (args.length !== 3) {
    throw new ParseError(
      `Contact requires 3 arguments, got ${args.length}`,
      lineNumber
    );
  }
  const [employeeName, partnerName, contactType] = args as [
    string,
    string,
    string
  ];

  if (!VALID_CONTACT_TYPES.includes(contactType as ContactType)) {
    throw new ParseError(
      `Invalid contact type: ${contactType}. Must be one of: ${VALID_CONTACT_TYPES.join(
        ", "
      )}`,
      lineNumber
    );
  }

  const [employee, partner] = await Promise.all([
    db.select().from(Employee).where(eq(Employee.name, employeeName)).get(),
    db.select().from(Partner).where(eq(Partner.name, partnerName)).get(),
  ]);
  if (!employee) {
    throw new ParseError(`Employee not found: ${employeeName}`, lineNumber);
  }
  if (!partner) {
    throw new ParseError(`Partner not found: ${partnerName}`, lineNumber);
  }
  await db.insert(Connection).values({
    employeeId: employee.id,
    partnerId: partner.id,
    type: contactType as ContactType,
    notes: "",
  });
}

export async function parseAndStoreInputLine(
  line: string,
  lineNumber?: number
): Promise<void> {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    return;
  }

  const parts = trimmed.split(" ");
  const command = parts[0];
  const args = parts.slice(1);

  // Validate command
  if (!VALID_COMMANDS.includes(command as Command)) {
    throw new ParseError(`Unknown command: ${command}`, lineNumber);
  }

  await match(command as Command)
    .with("Partner", () => parsePartner(args, lineNumber))
    .with("Company", () => parseCompany(args, lineNumber))
    .with("Employee", () => parseEmployee(args, lineNumber))
    .with("Contact", () => parseContact(args, lineNumber))
    .exhaustive();
}
