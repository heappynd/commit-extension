import * as vscode from 'vscode'

// TODO: support custom types
// default type is reference to
// `https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html`
export const typePickItems: vscode.QuickPickItem[] = [
  { label: 'feat', description: '新功能 feature' },
  { label: 'fix', description: '修补bug' },
  { label: 'docs', description: '文档 documentation' },
  { label: 'style', description: '格式 不影响代码运行的变动' },
  {
    label: 'refactor',
    description: '重构 即不是新增功能 也不是修改bug的代码变动',
  },
  { label: 'test', description: '增加测试' },
  { label: 'chore', description: '构建过程或辅助工具的变动' },
]
