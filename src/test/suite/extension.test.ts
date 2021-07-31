import * as assert from "assert";
import * as vscode from "vscode";
import {
  generateUnionCommand,
  GenerateUnionParams,
} from "../../commands/generate-union-command";

suite("dart-union-class Test Suite", () => {
  test("generates union correctly", async () => {
    vscode.commands.registerCommand(
      generateUnionCommand.command,
      generateUnionCommand.handler
    );
    const params: GenerateUnionParams = {
      className: "State",
      subclasses: ["LoadingState", "LoadedState", "ErrorState"],
    };
    await vscode.commands.executeCommand(generateUnionCommand.command, params);
    await vscode.workspace.openTextDocument({
      content: "",
      language: "dart",
    });
    const code = vscode.window.activeTextEditor?.document.getText()!;
    const result = `${states}\n${code}`;
    assert.strictEqual(result.trim(), expected.trim());
  });
});

const states = `
abstract class State {}

class LoadingState implements State {}

class LoadedState implements State {}

class ErrorState implements State {}`;

const expected = `${states}

extension StateUnion on State {
  T map<T>({
    required T Function(LoadingState) loadingState,
    required T Function(LoadedState) loadedState,
    required T Function(ErrorState) errorState,
  }) {
    if (this is LoadingState) {
      return loadingState(this as LoadingState);
    }
    if (this is LoadedState) {
      return loadedState(this as LoadedState);
    }
    if (this is ErrorState) {
      return errorState(this as ErrorState);
    }
    throw AssertionError('Union does not match any possible values');
  }
}`;
