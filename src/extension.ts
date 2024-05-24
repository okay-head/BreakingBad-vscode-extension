import * as vscode from 'vscode'
import axios from 'axios'

// Extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		'breaking-bad-quotes.insertRandomQuote',
		async () => {
			const editor = vscode.window.activeTextEditor
			if (!editor) {
				vscode.window.showErrorMessage('Please open an editor window')
				return
			}

			// else fetch quote
			try {
				let { data } = await axios.get(
					'https://api.breakingbadquotes.xyz/v1/quotes'
				)
				const resultStr = `"${data[0].quote}" - ${data[0].author}`

				const currentLine = editor.selection.active.line
				const currentChar = editor.selection.active.character
				const currentPosition = new vscode.Position(currentLine, currentChar)

				editor.edit((editBuilder) => {
					editBuilder.insert(currentPosition, resultStr)
				})
			} catch (error) {
				vscode.window.showErrorMessage('An unknown error occurred', {
					modal: true,
					detail:
						'The API might be down or possibly a result of breaking changes in the new vscode API\nSource: Breaking bad quotes extension',
				})
				vscode.window.showInformationMessage(
					'If the issue persists, consider opening an issue'
				)
			}
		}
	)

	context.subscriptions.push(disposable)
}

// Cleanup
export function deactivate() {}
