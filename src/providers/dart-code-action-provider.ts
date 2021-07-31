import * as vscode from "vscode";
import {
  generateUnionCommand,
  GenerateUnionParams,
} from "../commands/generate-union-command";

export class DartCodeActionProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    _: vscode.CodeActionContext,
    __: vscode.CancellationToken
  ): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
    const abstractClassRegex = /abstract class (\w+)/;
    const abstractClassRange = document.getWordRangeAtPosition(
      range.start,
      abstractClassRegex
    );
    if (!abstractClassRange) {
      return [];
    }
    const line = document.getText(abstractClassRange);
    const className = abstractClassRegex.exec(line)![1];
    const documentText = document.getText();
    const subclassRegex = RegExp(
      `class\\s+(\\w+)\\s+(implements|extends)\\s+${className}`,
      "g"
    );
    let matches: string[] = [];
    let matchArray: RegExpExecArray | null;
    while ((matchArray = subclassRegex.exec(documentText))) {
      matches.push(matchArray[1]);
    }
    if (matches.length === 0) {
      return [];
    }
    console.log(
      `Found class ${className} with values: [${matches.join(", ")}]`
    );
    const parameters: GenerateUnionParams = {
      className,
      subclasses: matches,
    };
    return [
      {
        title: generateUnionCommand.title,
        command: generateUnionCommand.command,
        arguments: [parameters],
      },
    ];
  }
}
