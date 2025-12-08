import { Cli } from "clipanion";
import { ProcessCommand } from "./commands/process";
import { GenerateCommand } from "./commands/generate";
import { CreateCommand } from "./commands/create";
import { ConnectionsCommand } from "./commands/connections";

const [, , ...args] = process.argv;

const cli = new Cli({
  binaryLabel: "Drive CLI",
  binaryName: "bun cli",
  binaryVersion: "1.0.0",
});

cli.register(ProcessCommand);
cli.register(GenerateCommand);
cli.register(CreateCommand);
cli.register(ConnectionsCommand);

cli.runExit(args);
