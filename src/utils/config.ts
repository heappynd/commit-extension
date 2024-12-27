import * as vscode from "vscode";
import { types } from "conventional-commit-types";

// TODO: support custom types
/**
 * default type is reference to
 * @link https://github.com/commitizen/conventional-commit-types/blob/master/index.json
 */
const items: vscode.QuickPickItem[] = [];
Object.keys(types).forEach((key) => {
  items.push({
    label: key,
    description: types[key].title,
    detail: types[key].description,
  });
});
export const typePickItems: vscode.QuickPickItem[] = items;
