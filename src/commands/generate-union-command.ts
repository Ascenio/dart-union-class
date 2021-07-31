import camelCase from "camelcase";
import { Command } from "./command";
import vscode, { Position } from "vscode";

export type GenerateUnionParams = {
  className: string;
  subclasses: string[];
};

export const generateUnionCommand: Command<GenerateUnionParams> = {
  title: "Generate union class",
  command: "dart-union-class.createUnion",
  handler: generateUnion,
};

function generateUnion(params: GenerateUnionParams): void {
  const extension = extensionBuilder(params);
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("Coulnd't generate union class");
    return;
  }
  const lineCount = editor.document.lineCount;
  editor.edit((builder) => {
    builder.insert(new Position(lineCount, 0), extension);
  });
  vscode.window.showErrorMessage(`Generated union for ${params.className}`);
}

function extensionBuilder(params: GenerateUnionParams) {
  const args = argumentsBuilder(params);
  const body = bodyBuilder(params);
  const extension = `
extension ${params.className}Union on ${params.className} {
  T map<T>({
${args}
  }) {
${body}
    throw AssertionError('Union does not match any possible values');
  }
}`;
  return extension;
}

function bodyBuilder(params: GenerateUnionParams) {
  return params.subclasses
    .map(
      (subclass) => `    if (this is ${subclass}) {
      return ${camelCase(subclass)}(this as ${subclass});
    }`
    )
    .join("\n");
}

function argumentsBuilder(params: GenerateUnionParams) {
  return params.subclasses
    .map(
      (subclass) =>
        `    required T Function(${subclass}) ${camelCase(subclass)},`
    )
    .join("\n");
}
