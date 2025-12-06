import { Command, Option } from "clipanion";
import { parseAndStoreInputLine, ParseError } from "@core/parsers";
import {
  getStrongestRelationships,
  formatRelationships,
} from "../../api/services/connections";

export class ProcessCommand extends Command {
  static override paths = [[`process`]];

  static override usage = Command.Usage({
    description: "Process an input file and output the strongest relationships",
    examples: [[`Process a file`, `$0 process input.txt`]],
  });

  filePath = Option.String({ required: true, name: "file" });

  async execute() {
    const file = Bun.file(this.filePath);

    if (!(await file.exists())) {
      this.context.stderr.write(`File not found: ${this.filePath}\n`);
      return 1;
    }

    const content = await file.text();
    const lines = content.split("\n");

    for (const [index, line] of lines.entries()) {
      try {
        await parseAndStoreInputLine(line, index + 1);
      } catch (error) {
        if (error instanceof ParseError) {
          this.context.stderr.write(`${error.message}\n`);
          return 1;
        }
        throw error;
      }
    }

    const relationships = await getStrongestRelationships();
    this.context.stdout.write(formatRelationships(relationships) + "\n");
    return 0;
  }
}
