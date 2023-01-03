import { execa } from 'execa'
import * as vscode from 'vscode'
import { CommitMessage } from './class/CommitMessage'
import { findLookupPath } from './utils'

let channel: vscode.OutputChannel

export function activate(context: vscode.ExtensionContext) {
  console.log('your extension "got-commit" is now active!')

  channel = vscode.window.createOutputChannel('commit')
  channel.appendLine('got-commit started')

  let disposable = vscode.commands.registerCommand(
    'got-commit.commit',
    async () => {
      const cm = new CommitMessage()
      if (cm.jiraPrefix) {
        await cm.getJiraIssue()
      }
      await cm.getType()
      await cm.getScope()
      await cm.getSubject()

      if (!cm.completed) {
        vscode.window.showInformationMessage('Canceled!')
        return
      }

      const cwd = await findLookupPath()
      try {
        const result = await execa('git', ['commit', '-m', cm.message], {
          cwd,
          preferLocal: false,
        })
        channel.appendLine(result.stdout)
        vscode.window.showInformationMessage('提交成功')
      } catch (error) {
        const errMsg = (error as Error).message
        channel.appendLine(errMsg)
        vscode.window.showInformationMessage(errMsg)
      }
    }
  )

  context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
