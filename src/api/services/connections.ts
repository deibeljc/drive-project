import { db } from "@db/client";
import { Company, Connection, Employee, Partner } from "@db/schema";
import { eq } from "drizzle-orm";

/**
 * Get all connections for all companies.
 */
export async function getConnectionsForCompanies() {
  const companiesWithConnections = await db
    .select()
    .from(Company)
    .leftJoin(Employee, eq(Employee.companyId, Company.id))
    .leftJoin(Connection, eq(Connection.employeeId, Employee.id))
    .leftJoin(Partner, eq(Connection.partnerId, Partner.id));

  return companiesWithConnections;
}

export interface CompanyRelationship {
  companyName: string;
  partnerName: string | null;
  strength: number;
}

/**
 * Get the strongest partner relationship for each company.
 * Returns companies sorted alphabetically with the partner who has the most contacts.
 */
export async function getStrongestRelationships(): Promise<
  CompanyRelationship[]
> {
  const connections = await getConnectionsForCompanies();

  // Group by company, then by partner with counts
  const companyPartnerCounts = new Map<string, Map<string, number>>();

  // Track all companies (even those with no connections)
  const allCompanies = new Set<string>();

  for (const connection of connections) {
    const companyName = connection.companies.name;
    allCompanies.add(companyName);

    const partnerName = connection.partners?.name;
    if (!partnerName) continue;

    if (!companyPartnerCounts.has(companyName)) {
      companyPartnerCounts.set(companyName, new Map());
    }

    const partnerCounts = companyPartnerCounts.get(companyName)!;
    partnerCounts.set(partnerName, (partnerCounts.get(partnerName) || 0) + 1);
  }

  // Build result with strongest partner per company
  const results: CompanyRelationship[] = [];

  for (const companyName of allCompanies) {
    const partnerCounts = companyPartnerCounts.get(companyName);

    if (!partnerCounts || partnerCounts.size === 0) {
      results.push({ companyName, partnerName: null, strength: 0 });
      continue;
    }

    // Find strongest partner
    let strongestPartner = "";
    let maxStrength = 0;

    for (const [partner, count] of partnerCounts) {
      if (count > maxStrength) {
        maxStrength = count;
        strongestPartner = partner;
      }
    }

    results.push({
      companyName,
      partnerName: strongestPartner,
      strength: maxStrength,
    });
  }

  // Sort alphabetically by company name
  return results.sort((a, b) => a.companyName.localeCompare(b.companyName));
}

/**
 * Format relationships as the spec requires:
 * CompanyName: PartnerName (N)
 * CompanyName: No current relationship
 */
export function formatRelationships(
  relationships: CompanyRelationship[]
): string {
  return relationships
    .map((r) =>
      r.partnerName
        ? `${r.companyName}: ${r.partnerName} (${r.strength})`
        : `${r.companyName}: No current relationship`
    )
    .join("\n");
}
