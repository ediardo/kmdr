import cli from "commander";
import { Settings } from "./interfaces";
import { Explain } from "./explain";
import { Upgrade } from "./upgrade";
import { KMDR_CLI_VERSION } from "./constants";

class KMDR {
  private settings: Settings | undefined;
  private cli = cli;
  // tslint:disable-next-line: max-line-length
  private welcomeMsg = `The CLI client for explaining complex shell commands.\n\nkmdr provides command explanations for hundreds of programs including git, docker, kubectl,npm, go and more straight forward programs such as those built into bash.`;

  constructor(settings?: Settings) {
    this.settings = settings;
  }

  public async init() {
    this.cli.description(this.welcomeMsg).version(KMDR_CLI_VERSION, "-v, --version");
    this.cli
      .command("explain")
      .alias("e")
      .description("Explain a shell command")
      .option("--no-show-syntax", "Do not show syntax highlighting")
      .option("-o, --ask-once", "Ask only once")
      .option("--no-show-related", "Do not show related CLI programs")
      .action(this.explain);

    this.cli
      .command("upgrade")
      .alias("u")
      .description("Check for newer releases")
      .action(this.upgrade);

    this.cli.parse(process.argv);

    if (process.argv.length < 3) {
      this.cli.help();
    }
  }

  private async explain(command: any) {
    const { askOnce, noShowSyntax, noShowRelated } = command;
    const explain = new Explain({
      askOnce,
      showRelatedPrograms: !noShowRelated,
      showSyntax: !noShowSyntax,
    });
    await explain.render();
  }

  private async upgrade() {
    const upgrade = new Upgrade();
    await upgrade.render();
  }
}

export default KMDR;
