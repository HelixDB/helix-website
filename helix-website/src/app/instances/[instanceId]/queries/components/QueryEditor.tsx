import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash } from "lucide-react";
import { Query } from "@/app/api";
import { KeyboardEvent, ChangeEvent, useState, useEffect } from "react";

interface QueryEditorProps {
    selectedQuery: Query | null;
    editingName: string | null;
    editingContent: string;
    hasUnsavedChanges: boolean;
    onNameChange: (name: string) => void;
    onContentChange: (content: string) => void;
    onSave: () => Promise<{ query: Query; wasAutoRenamed: boolean } | null>;
    onDelete: (id: string) => void;
    onStartEditingName: (name: string) => void;
}

const TAB_SIZE = 4; // Number of spaces for a tab
const OPENING_BRACKETS = ["{", "[", "("];
const CLOSING_BRACKETS = ["}", "]", ")"];
const BRACKET_PAIRS: { [key: string]: string } = {
    "{": "}",
    "[": "]",
    "(": ")",
};
const REVERSE_BRACKET_PAIRS: { [key: string]: string } = {
    "}": "{",
    "]": "[",
    ")": "(",
};

export const QueryEditor = ({
    selectedQuery,
    editingName,
    editingContent,
    hasUnsavedChanges,
    onNameChange,
    onContentChange,
    onSave,
    onDelete,
    onStartEditingName
}: QueryEditorProps) => {
    const [nameWarning, setNameWarning] = useState<string | null>(null);

    useEffect(() => {
        // Clear warning when query changes
        setNameWarning(null);
    }, [selectedQuery?.id]);

    const handleSave = async () => {
        const originalName = editingName;
        const result = await onSave();
        if (result?.wasAutoRenamed) {
            setNameWarning(`Query name was changed to "${result.query.name}" to avoid duplicates`);
        } else {
            setNameWarning(null);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget;
        const { selectionStart, selectionEnd, value } = textarea;
        const currentLine = value.substring(0, selectionStart).split('\n').pop() || '';
        const indentLevel = currentLine.search(/\S|$/);

        // Handle closing brackets
        if (CLOSING_BRACKETS.includes(e.key)) {
            const nextChar = value.charAt(selectionStart);
            // If the next character is the same closing bracket we're trying to type
            if (nextChar === e.key) {
                e.preventDefault();
                // Move cursor one position to the right
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
                }, 0);
                return;
            }
        }

        // Prevent tab from moving focus
        if (e.key === 'Tab') {
            e.preventDefault();
            const spaces = ' '.repeat(TAB_SIZE);

            if (!e.shiftKey) {
                // Insert tab at cursor or for selected text
                const before = value.substring(0, selectionStart);
                const after = value.substring(selectionEnd);

                if (selectionStart === selectionEnd) {
                    // No selection, just insert tab
                    const newValue = before + spaces + after;
                    onContentChange(newValue);
                    // Set cursor position after the inserted tab
                    setTimeout(() => {
                        textarea.selectionStart = textarea.selectionEnd = selectionStart + TAB_SIZE;
                    }, 0);
                } else {
                    // Indent selected lines
                    const selectedText = value.substring(selectionStart, selectionEnd);
                    const indentedText = selectedText.replace(/^/gm, spaces);
                    const newValue = before + indentedText + after;
                    onContentChange(newValue);
                    // Maintain selection
                    setTimeout(() => {
                        textarea.selectionStart = selectionStart;
                        textarea.selectionEnd = selectionEnd + (indentedText.length - selectedText.length);
                    }, 0);
                }
            } else {
                // Unindent on Shift+Tab
                const before = value.substring(0, selectionStart);
                const after = value.substring(selectionEnd);

                if (selectionStart === selectionEnd) {
                    // No selection, remove tab from current line
                    const currentLine = value.substring(0, selectionStart).split('\n').pop() || '';
                    const spacesToRemove = Math.min(
                        TAB_SIZE,
                        currentLine.length - currentLine.trimLeft().length
                    );
                    if (spacesToRemove > 0) {
                        const newBefore = before.slice(0, -spacesToRemove);
                        const newValue = newBefore + after;
                        onContentChange(newValue);
                        setTimeout(() => {
                            textarea.selectionStart = textarea.selectionEnd = newBefore.length;
                        }, 0);
                    }
                } else {
                    // Unindent selected lines
                    const selectedText = value.substring(selectionStart, selectionEnd);
                    const unindentedText = selectedText.replace(new RegExp(`^${spaces}`, 'gm'), '');
                    const newValue = before + unindentedText + after;
                    onContentChange(newValue);
                    setTimeout(() => {
                        textarea.selectionStart = selectionStart;
                        textarea.selectionEnd = selectionEnd - (selectedText.length - unindentedText.length);
                    }, 0);
                }
            }
            return;
        }

        // Handle Enter key
        if (e.key === 'Enter') {
            e.preventDefault();

            const before = value.substring(0, selectionStart);
            const after = value.substring(selectionEnd);
            const lastChar = before.trim().slice(-1);
            const nextChar = after.trim()[0];

            let insertion = '\n' + ' '.repeat(indentLevel);

            // Auto-indent after opening bracket
            if (OPENING_BRACKETS.includes(lastChar) && CLOSING_BRACKETS.includes(nextChar)) {
                const extraIndent = ' '.repeat(TAB_SIZE);
                insertion = '\n' + ' '.repeat(indentLevel) + extraIndent + '\n' + ' '.repeat(indentLevel);
                const newValue = before + insertion + after;
                onContentChange(newValue);
                // Place cursor after the indented line
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd =
                        before.length + insertion.length - (indentLevel + 1);
                }, 0);
            } else {
                const newValue = before + insertion + after;
                onContentChange(newValue);
                // Place cursor at the start of the new line
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd =
                        before.length + insertion.length;
                }, 0);
            }
            return;
        }

        // Handle Backspace
        if (e.key === 'Backspace' && !e.altKey && !e.ctrlKey && !e.metaKey) {
            const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
            const lineUpToSelection = value.substring(lineStart, selectionStart);

            // If the line only contains spaces and cursor is after them
            if (/^\s+$/.test(lineUpToSelection)) {
                e.preventDefault();
                const spacesToRemove = Math.min(TAB_SIZE, lineUpToSelection.length);
                const newValue = value.substring(0, selectionStart - spacesToRemove) +
                    value.substring(selectionEnd);
                onContentChange(newValue);
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = selectionStart - spacesToRemove;
                }, 0);
                return;
            }
        }

        // Auto-close brackets
        if (OPENING_BRACKETS.includes(e.key)) {
            e.preventDefault();
            const closingBracket = BRACKET_PAIRS[e.key];
            // Check if we already have a closing bracket after the cursor
            const nextChar = value.charAt(selectionStart);
            if (CLOSING_BRACKETS.includes(nextChar) && value.charAt(selectionStart - 1) === REVERSE_BRACKET_PAIRS[nextChar]) {
                // If we're typing an opening bracket and already have a matching pair,
                // just move the cursor between them
                const newValue = value.substring(0, selectionStart) + e.key + value.substring(selectionStart);
                onContentChange(newValue);
            } else {
                // Otherwise, add both opening and closing brackets
                const newValue = value.substring(0, selectionStart) +
                    e.key + closingBracket +
                    value.substring(selectionEnd);
                onContentChange(newValue);
            }
            // Place cursor between the brackets
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
            }, 0);
            return;
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                {selectedQuery && (
                    <>
                        {editingName !== null ? (
                            <div>
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={e => onNameChange(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') handleSave();
                                        if (e.key === 'Escape') onNameChange(selectedQuery.name);
                                    }}
                                    onBlur={() => {
                                        if (editingName.trim() === '') {
                                            onNameChange(selectedQuery.name);
                                        }
                                    }}
                                    autoFocus
                                    className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
                                />
                                {nameWarning && (
                                    <div className="text-sm text-yellow-500 mt-1">
                                        {nameWarning}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <div
                                    className="text-lg font-medium cursor-pointer hover:text-primary"
                                    onClick={() => onStartEditingName(selectedQuery.name)}
                                >
                                    {selectedQuery.name}
                                </div>
                                {nameWarning && (
                                    <div className="text-sm text-yellow-500 mt-1">
                                        {nameWarning}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onDelete(selectedQuery.id)}
                            >
                                <Trash className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={!hasUnsavedChanges}
                            >
                                Save
                            </Button>
                        </div>
                    </>
                )}
            </div>

            {selectedQuery ? (
                <Textarea
                    value={editingContent}
                    onChange={e => onContentChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your query here..."
                    className="flex-1 font-mono resize-none bg-muted/50 tab-size-4"
                    spellCheck={false}
                />
            ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    Select a query from the sidebar or click "New Query" to get started
                </div>
            )}
        </div>
    );
};

export default QueryEditor; 