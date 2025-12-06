import { Command, Option } from "clipanion";
import { generateSampleData } from "../utils";

export class GenerateCommand extends Command {
  static override paths = [[`generate`]];

  static override usage = Command.Usage({
    description: "Generate sample input data for testing",
    examples: [
      [`Generate with defaults`, `$0 generate`],
      [`Custom counts`, `$0 generate --partners 5 --companies 4`],
      [`Output to file`, `$0 generate > sample.txt`],
    ],
  });

  partners = Option.String("--partners,-p", "3", {
    description: "Number of partners to generate",
  });

  companies = Option.String("--companies,-c", "3", {
    description: "Number of companies to generate",
  });

  employees = Option.String("--employees,-e", "2", {
    description: "Number of employees per company",
  });

  contacts = Option.String("--contacts,-n", "5", {
    description: "Number of contacts to generate",
  });

  async execute() {
    const output = generateSampleData({
      partners: parseInt(this.partners, 10),
      companies: parseInt(this.companies, 10),
      employeesPerCompany: parseInt(this.employees, 10),
      contacts: parseInt(this.contacts, 10),
    });

    this.context.stdout.write(output + "\n");
    return 0;
  }
}
