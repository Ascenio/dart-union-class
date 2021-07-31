import * as vscode from "vscode";
import { generateUnionCommand } from "./commands/generate-union-command";
import { DartCodeActionProvider } from "./providers/dart-code-action-provider";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "dart-union-class" is now active!'
  );

  vscode.languages.registerCodeActionsProvider(
    "dart",
    new DartCodeActionProvider()
  );
  const disposable = vscode.commands.registerCommand(
    generateUnionCommand.command,
    generateUnionCommand.handler
  );

  context.subscriptions.push(disposable);
}
