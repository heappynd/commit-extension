import * as vscode from 'vscode'
import { typePickItems } from '../utils/config'

interface Configuration {
  jiraPrefix: string
}

function getConfiguration(): Configuration {
  const config = vscode.workspace
    .getConfiguration()
    .get<Configuration>('gotcommit')
  return config!
}

export class CommitMessage {
  private type: string | undefined
  private scope?: string
  private subject: string | undefined
  // TODO: this will need to be implemented
  private body: string | undefined
  private breaking: string | undefined
  private footer: string | undefined
  // add JIRA support to commit
  readonly jiraPrefix: string | undefined
  private jiraIssue: number | undefined
  // a flag indicating whether operation is aborted
  #next = true

  constructor() {
    // maybe empty string
    this.jiraPrefix = getConfiguration().jiraPrefix
  }

  get message() {
    let main = ''

    if (this.jiraPrefix) {
      main += `${this.jiraPrefix}-${this.jiraIssue} `
    }

    main += this.type

    if (this.scope) {
      main += `(${this.scope})`
    }

    main += `: ${this.subject}`

    return main
  }

  get completed() {
    return this.#next && this.type && this.subject
  }

  async getJiraIssue() {
    if (!this.#next) {
      return
    }

    const input = await vscode.window.showInputBox({
      placeHolder: 'jira issue, like 9527',
      ignoreFocusOut: true,
      validateInput(value) {
        if (/^\d+$/.test(value)) {
          return ''
        }
        return `jira key is required, and must be a number`
      },
    })

    if (!input) {
      return (this.#next = false)
    }

    this.jiraIssue = +input!
  }

  async getType() {
    if (!this.#next) {
      return
    }

    const pick = await vscode.window.showQuickPick(typePickItems, {
      placeHolder: 'type用于说明 commit 的类别',
      matchOnDescription: true,
      ignoreFocusOut: true,
    })

    if (!pick) {
      return (this.#next = false)
    }
    this.type = pick.label
  }

  async getScope() {
    if (!this.#next) {
      return
    }

    const input = await vscode.window.showInputBox({
      placeHolder:
        'scope 用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同',
      ignoreFocusOut: true,
    })

    if (!input) {
      return
    }

    this.scope = input
  }

  async getSubject() {
    if (!this.#next) {
      return
    }

    const input = await vscode.window.showInputBox({
      placeHolder: 'subject是 commit 目的的简短描述，不超过50个字符',
      ignoreFocusOut: true,
      validateInput(value) {
        if (value.length === 0 || value.length > 50) {
          return `subject 必填，且不超过50个字符`
        }
        return ''
      },
    })

    if (!input) {
      return (this.#next = false)
    }

    this.subject = input
  }
}
