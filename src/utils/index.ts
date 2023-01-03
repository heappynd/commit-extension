import * as vscode from 'vscode'

export async function findLookupPath() {
  //! FIXME: workspaceFolders.length > 1
  if (!vscode.workspace.workspaceFolders) {
    return undefined
  } else {
    return vscode.workspace.workspaceFolders[0].uri.fsPath
  }
}
