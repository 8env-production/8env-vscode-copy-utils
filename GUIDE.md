# Инструкция по созданию VS Code расширения

## 1. Предварительные требования

Перед началом убедитесь, что у вас установлены:

- **Node.js** (версия 14+) - [скачать](https://nodejs.org/)
- **npm** или **yarn**
- **Git**
- **VS Code** (последняя версия)

Проверьте установку:

```bash
node --version
npm --version
```

## 2. Установка необходимых инструментов

### Установите Yeoman и генератор VS Code расширений

```bash
npm install -g yo generator-code
```

**Что такое Yeoman?** Yeoman — это инструмент для автоматизации создания проектов с помощью генераторов. Он задаёт вопросы о конфигурации, затем автоматически создаёт структуру проекта с нужными файлами. `generator-code` — это генератор Yeoman специально для VS Code расширений.

## 3. Создание нового расширения

### Шаг 1: Запустите генератор

```bash
yo code
```

### Шаг 2: Ответьте на вопросы

Генератор задаст вам несколько вопросов:

```
? What type of extension do you want to create?
→ New Extension (TypeScript) / New Extension (JavaScript) / New Color Theme / и т.д.

? What's the name of your extension?
→ Введите имя расширения (например: my-awesome-extension)

? What's the identifier of your extension?
→ Usually lowercase name (например: my-awesome-extension)

? What's the description of your extension?
→ Короткое описание функционала

? Initialize a git repository?
→ yes

? Bundle the source code with webpack?
→ yes/no (рекомендуется: no для начинающих)

? Which package manager to use?
→ npm / yarn
```

### Шаг 3: Перейдите в директорию проекта

```bash
cd my-awesome-extension
```

## 4. Структура проекта расширения

После создания ваш проект будет содержать:

```
my-awesome-extension/
├── .vscode/
│   ├── launch.json          # Конфигурация отладки
│   ├── settings.json        # Настройки рабочей области
│   └── tasks.json           # Задачи для компиляции
├── src/
│   └── extension.ts         # Основной файл расширения
├── test/
│   └── extension.test.ts    # Тесты
├── .gitignore
├── CHANGELOG.md             # История изменений
├── README.md                # Документация
├── package.json             # Метаданные проекта
├── tsconfig.json            # Конфигурация TypeScript
└── vsc-extension-quickstart.md
```

## 5. Основной файл расширения (src/extension.ts)

```typescript
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("Расширение активировано!");

  // Регистрация команды
  let disposable = vscode.commands.registerCommand(
    "myextension.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello from My Extension!");
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  console.log("Расширение деактивировано!");
}
```

## 6. Конфигурация package.json

Основные поля в `package.json`:

```json
{
  "name": "my-awesome-extension",
  "displayName": "My Awesome Extension",
  "description": "Описание того, что делает ваше расширение",
  "version": "0.0.1",
  "engines": {
    "vscode": "^1.60.0"
  },
  "categories": ["Other"],
  "activationEvents": ["onCommand:myextension.helloWorld"],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "myextension.helloWorld",
        "title": "Hello World"
      }
    ]
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./",
    "pretest": "npm run compile && npm run lint",
    "lint": "eslint src --ext ts",
    "test": "node ./out/test/runTest.js"
  },
  "devDependencies": {
    "@types/vscode": "^1.60.0",
    "@types/node": "^14.0.0",
    "typescript": "^4.0.0",
    "tsc": "latest",
    "eslint": "^7.0.0"
  }
}
```

## 7. Установка зависимостей

```bash
npm install
```

## 8. Разработка и тестирование

### Запуск в режиме отладки

**F5** — это горячая клавиша для запуска отладчика в VS Code. Вместо F5 можно использовать меню:

1. Нажмите **F5** (или **Ctrl+Shift+D** → кнопка "Run and Debug")
2. Альтернативно: **View → Run and Debug** → нажмите зелёную кнопку запуска (▶)
3. Выберите **"Extension Development Host"** из выпадающего списка конфигураций
4. Откроется новое окно VS Code с вашим расширением — это тестовая среда

После запуска:

- Ваше расширение активируется автоматически

### Дополнительно: Рекомендуемые расширения для разработки

Для удобной работы установите эти расширения VS Code:

1. **Debugger for Chrome** — отладка JavaScript (если нужна)
2. **ESLint** — проверка синтаксиса TypeScript/JavaScript
3. **TypeScript Vue Plugin** — если используете Vue
4. **REST Client** — для тестирования API вашего расширения
5. **Code Runner** — быстрый запуск кода для проверки
6. **Markdown Preview** — для просмотра README.md документации

- Вы можете вызывать команды расширения (Ctrl+Shift+P)
- Все логи выводятся в **Debug Console** (внизу окна)
- При изменении кода перезагрузите расширение кнопкой Reload

### Просмотр логов

Откройте **Debug Console** в VS Code для просмотра сообщений из функции `activate()`.

### Вызов команды

1. Нажмите **Ctrl+Shift+P** (Windows/Linux) или **Cmd+Shift+P** (Mac)
2. Введите имя команды: `Hello World`
3. Нажмите Enter

## 9. Добавление функционала

### Пример 1: Команда с вводом текста

```typescript
let disposable = vscode.commands.registerCommand(
  "myextension.greet",
  async () => {
    const name = await vscode.window.showInputBox({
      prompt: "Введите ваше имя",
    });

    if (name) {
      vscode.window.showInformationMessage(`Привет, ${name}!`);
    }
  }
);
```

### Пример 2: Обработка активного файла

```typescript
let disposable = vscode.commands.registerCommand(
  "myextension.processFile",
  () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showErrorMessage("Нет открытого файла");
      return;
    }

    const document = editor.document;
    vscode.window.showInformationMessage(`Текущий файл: ${document.fileName}`);
  }
);
```

### Пример 3: Изменение текста в редакторе

```typescript
let disposable = vscode.commands.registerCommand(
  "myextension.insertText",
  () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) return;

    editor.edit((editBuilder) => {
      editBuilder.insert(editor.selection.active, "Вставленный текст");
    });
  }
);
```

## 10. Компиляция и подготовка к публикации

### Компилирование TypeScript

```bash
npm run compile
```

### Упаковка расширения

Установите инструмент `vsce`:

```bash
npm install -g vsce
```

Создайте пакет расширения (.vsix файл):

```bash
vsce package
```

Будет создан файл вида: `my-awesome-extension-0.0.1.vsix`

## 11. Установка локально созданного расширения

1. Откройте VS Code
2. Нажмите **Ctrl+Shift+X** для открытия Extensions
3. Нажмите на три точки **⋯** → **Install from VSIX...**
4. Выберите созданный файл `.vsix`

## 12. Публикация в VS Code Marketplace

### Предварительные условия

1. Создайте аккаунт на [Azure DevOps](https://dev.azure.com/)
2. Получите Personal Access Token (PAT):
   - Перейдите на свой профиль → **Security**
   - Создайте новый token с правом **Marketplace → Manage**

### Опубликуйте расширение

```bash
vsce publish -p YOUR_PERSONAL_ACCESS_TOKEN
```

Или создайте файл `.vscodeignore`:

```
.git
node_modules
.gitignore
CHANGELOG.md
README.md
```

Затем:

```bash
vsce publish
```

## 13. Полезные ресурсы

- **Official VS Code Extension API** - https://code.visualstudio.com/api
- **Extension Examples** - https://github.com/microsoft/vscode-extension-samples
- **VS Code API Documentation** - https://code.visualstudio.com/docs/extensionAPI/overview
- **Marketplace** - https://marketplace.visualstudio.com/

## 14. Типичные ошибки и решения

### Ошибка: "Cannot find module 'vscode'"

```bash
npm install
npm run compile
```

### Расширение не активируется

Проверьте `activationEvents` в `package.json`. Примеры:

- `"onCommand:mycommand"` - при вызове команды
- `"onLanguage:javascript"` - при открытии JS файла
- `"onWorkspaceContains:**/*.json"` - при наличии файла в проекте
- `"*"` - при запуске VS Code (не рекомендуется)

### Синтаксические ошибки

```bash
npm run lint
npm run compile
```

## 15. Примеры идей для расширений

- 🎨 Темы оформления
- 📝 Автодополнение кода
- 🔧 Инструменты форматирования
- 🧪 Интеграция с тестовыми фреймворками
- 🚀 Деплой и CI/CD интеграция
- 📊 Анализ кода и метрики
- 🌍 Интеграция с внешними API

---

## Быстрый старт (Summary)

```bash
# 1. Установка инструментов
npm install -g yo generator-code

# 2. Создание проекта
yo code

# 3. Переход в проект
cd my-awesome-extension

# 4. Установка зависимостей
npm install

# 5. Запуск в режиме отладки (F5 в VS Code)

# 6. Компиляция
npm run compile

# 7. Упаковка
npm install -g vsce
vsce package

# 8. Публикация
vsce publish -p YOUR_TOKEN
```

Готово! Теперь у вас есть полная инструкция по созданию VS Code расширения.
