import { Command, Option } from "clipanion";
import {
  getConnectionsForCompanies,
  getConnectionsGroupedByCompany,
  getStrongestRelationships,
} from "src/api/services/connections";
import { formatConnections, formatRelationships } from "../utils";

export class ConnectionsCommand extends Command {
  static override paths = [["connections"]];

  static override usage = Command.Usage({
    description: "Show connections between partners and companies",
    examples: [[`Show all connections`, `$0 connections`]],
  });

  // All connections or just strongest
  all = Option.Boolean("--all,-a", true, {
    description: "Show all connections (default)",
  });

  strongest = Option.Boolean("--strongest,-s", false, {
    description: "Show only the strongest connections",
  });

  async execute() {
    if (this.all) {
      const groupedConnections = await getConnectionsGroupedByCompany();
      this.context.stdout.write(formatConnections(groupedConnections) + "\n");
    } else {
      const relationships = await getStrongestRelationships();
      this.context.stdout.write(formatRelationships(relationships) + "\n");
    }
    return 0;
  }
}
