// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "ke-copy-all" is now active!');

  // Copy file content command with recursive directory support
  const copyFileContentDisposable = vscode.commands.registerCommand(
    "ke-copy-all.copyFileContent",
    async function (uri) {
      if (!uri) {
        vscode.window.showErrorMessage(
          "Please select a file or folder to copy"
        );
        return;
      }

      try {
        const stat = await vscode.workspace.fs.stat(uri);
        let content = "";

        if (stat.type === vscode.FileType.Directory) {
          // Recursively copy all files from directory
          content = await copyDirectoryContent(uri);
        } else {
          // Copy single file
          const fileContent = await vscode.workspace.fs.readFile(uri);
          content = new TextDecoder().decode(fileContent);
        }

        // Copy to clipboard
        await vscode.env.clipboard.writeText(content);

        // Show success message
        vscode.window.showInformationMessage(`Copied content successfully`);
      } catch (error) {
        vscode.window.showErrorMessage(`Error copying file: ${error.message}`);
      }
    }
  );

  /**
   * Recursively copy content from all files in a directory
   * @param {vscode.Uri} dirUri - Directory URI
   * @returns {Promise<string>} - Combined content of all files
   */
  async function copyDirectoryContent(dirUri) {
    let allContent = "";
    const entries = await vscode.workspace.fs.readDirectory(dirUri);

    for (const [name, type] of entries) {
      const uri = vscode.Uri.joinPath(dirUri, name);

      if (type === vscode.FileType.Directory) {
        // Recursively process subdirectories
        const subContent = await copyDirectoryContent(uri);
        allContent += subContent;
      } else if (type === vscode.FileType.File) {
        // Read file content
        try {
          const fileContent = await vscode.workspace.fs.readFile(uri);
          const content = new TextDecoder().decode(fileContent);
          allContent += `\n\n\n\n\n`;
          allContent += `file: ${uri.fsPath}\n\n`;
          allContent += content;
          allContent += "\n";
        } catch (error) {
          console.error(`Error reading file ${uri.fsPath}:`, error);
        }
      }
    }

    return allContent;
  }

  context.subscriptions.push(copyFileContentDisposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
