import { Command, Option } from "clipanion";
import {
  parsePartner,
  parseCompany,
  parseEmployee,
  parseContact,
  ParseError,
  type Command as CommandType,
} from "@core/parsers";
import { match } from "ts-pattern";

const VALID_TYPES = ["Partner", "Company", "Employee", "Contact"] as const;

export class CreateCommand extends Command {
  static override paths = [["create"]];

  static override usage = Command.Usage({
    description: "Create a new entity (Partner, Company, Employee, or Contact)",
    examples: [
      [`Create a partner`, `$0 create Partner Alice`],
      [`Create a company`, `$0 create Company Acme`],
      [`Create an employee`, `$0 create Employee Bob Acme`],
      [`Create a contact`, `$0 create Contact Bob Alice email`],
    ],
  });

  type = Option.String({ required: true, name: "type" });
  args = Option.Rest({ required: 1 });

  async execute() {
    if (!VALID_TYPES.includes(this.type as CommandType)) {
      this.context.stderr.write(
        `Invalid type: ${this.type}. Must be one of: ${VALID_TYPES.join(
          ", "
        )}\n`
      );
      return 1;
    }

    try {
      await match(this.type as CommandType)
        .with("Partner", () => parsePartner(this.args))
        .with("Company", () => parseCompany(this.args))
        .with("Employee", () => parseEmployee(this.args))
        .with("Contact", () => parseContact(this.args))
        .exhaustive();

      this.context.stdout.write(`Created ${this.type} successfully\n`);
      return 0;
    } catch (error) {
      if (error instanceof ParseError) {
        this.context.stderr.write(`${error.message}\n`);
        return 1;
      }
      throw error;
    }
  }
}
