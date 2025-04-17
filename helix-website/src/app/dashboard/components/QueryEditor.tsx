import React, { useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

export const QueryEditor = ({
    content,
    onContentChange,
    onSave,
    isSaving,
    isDeleting
}: {
    content: string;
    onContentChange: (content: string) => void;
    onSave: () => void;
    isSaving: boolean;
    isDeleting: boolean;
}) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    // Handle editor mount
    const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
        editorRef.current = editor;

        // Disable validation for JavaScript/TypeScript
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: true,
        });
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: true,
        });

        // Add keyboard shortcut for saving (Ctrl+S)
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            if (!isSaving && !isDeleting) {
                onSave();
            }
        });

        // Setup auto-wrapping for highlighted text
        editor.onKeyDown((e) => {
            if (isSaving || isDeleting) {
                e.preventDefault();
                return;
            }

            const selection = editor.getSelection();
            if (selection && !selection.isEmpty()) {
                const openingChars = ['"', "'", '(', '[', '{', '<'];
                const closingChars = ['"', "'", ')', ']', '}', '>'];
                const charIndex = openingChars.indexOf(e.browserEvent.key);

                if (charIndex !== -1) {
                    e.preventDefault();
                    const selectedText = editor.getModel()?.getValueInRange(selection) || '';
                    const openChar = openingChars[charIndex];
                    const closeChar = closingChars[charIndex];

                    editor.executeEdits('auto-surround', [
                        {
                            range: selection,
                            text: openChar + selectedText + closeChar,
                            forceMoveMarkers: true
                        }
                    ]);
                }
            }
        });
    };

    return (
        <div className="flex flex-col w-full h-[400px] border border-neutral-600 rounded-xl overflow-hidden">
            <Editor
                height="100%"
                defaultLanguage="javascript"
                defaultValue={content}
                value={content}
                theme="vs-dark"
                onChange={(value) => !isSaving && !isDeleting && onContentChange(value || '')}
                onMount={handleEditorDidMount}
                options={{
                    fontSize: 14,
                    lineHeight: 22,
                    minimap: { enabled: true },
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    folding: true,
                    formatOnType: true,
                    formatOnPaste: true,
                    autoIndent: 'full',
                    tabSize: 2,
                    scrollBeyondLastLine: false,
                    fixedOverflowWidgets: true,
                    cursorBlinking: 'smooth',
                    bracketPairColorization: { enabled: true },
                    autoClosingBrackets: 'always',
                    autoClosingQuotes: 'always',
                    autoSurround: 'languageDefined',
                    rulers: [],
                    renderLineHighlight: 'none',
                    padding: { top: 10, bottom: 10 },
                    quickSuggestions: false,
                    parameterHints: { enabled: false },
                    suggestOnTriggerCharacters: false,
                    acceptSuggestionOnEnter: 'off',
                    tabCompletion: 'off',
                    wordBasedSuggestions: 'off',
                    renderValidationDecorations: 'off',
                    readOnly: isSaving || isDeleting,
                    scrollbar: {
                        vertical: 'auto',
                        horizontal: 'auto',
                        verticalScrollbarSize: 10,
                        horizontalScrollbarSize: 10,
                        alwaysConsumeMouseWheel: false
                    },
                    overviewRulerBorder: false
                }}
            />
        </div>
    );
}; 