import { useEffect, useRef, useState, type ClipboardEvent } from 'react';

type RichTextEditorProps = {
    value: string;
    onChange: (html: string) => void;
    ariaLabel: string;
    minHeight?: number;
};

const toggleTools = [
    { command: 'bold', label: 'Bold', icon: 'fas fa-bold' },
    { command: 'italic', label: 'Italic', icon: 'fas fa-italic' },
    { command: 'underline', label: 'Underline', icon: 'fas fa-underline' },
    { command: 'insertUnorderedList', label: 'Bulleted list', icon: 'fas fa-list-ul' },
    { command: 'insertOrderedList', label: 'Numbered list', icon: 'fas fa-list-ol' },
] as const;

export default function RichTextEditor({ value, onChange, ariaLabel, minHeight = 150 }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const selectionRef = useRef<Range | null>(null);
    const [activeCommands, setActiveCommands] = useState<Set<string>>(() => new Set());

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor || document.activeElement === editor || editor.innerHTML === value) return;
        editor.innerHTML = value;
    }, [value]);

    const rememberSelection = () => {
        const editor = editorRef.current;
        const selection = window.getSelection();

        if (!editor || !selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        if (editor.contains(range.commonAncestorContainer)) selectionRef.current = range.cloneRange();
    };

    const updateToolbar = () => {
        rememberSelection();
        const next = new Set<string>();
        for (const tool of toggleTools) {
            try {
                if (document.queryCommandState(tool.command)) next.add(tool.command);
            } catch {
                // A browser may not expose state for every legacy edit command.
            }
        }
        setActiveCommands(next);
    };

    const emit = () => {
        onChange(editorRef.current?.innerHTML ?? '');
        updateToolbar();
    };

    const run = (command: string, argument?: string) => {
        editorRef.current?.focus();
        if (selectionRef.current) {
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(selectionRef.current);
        }
        document.execCommand(command, false, argument);
        emit();
    };

    const addLink = () => {
        const url = window.prompt('Enter the link URL (https://, mailto:, tel:, /page or #section)');
        if (!url) return;

        const safe = /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url.trim());
        if (!safe) {
            window.alert('Use a full https:// URL, mailto:, tel:, a site path beginning with /, or an anchor beginning with #.');
            return;
        }

        run('createLink', url.trim());
    };

    const pastePlainText = (event: ClipboardEvent<HTMLDivElement>) => {
        event.preventDefault();
        document.execCommand('insertText', false, event.clipboardData.getData('text/plain'));
        emit();
    };

    return (
        <div className="admin-rich-editor">
            <div className="admin-rich-toolbar" role="toolbar" aria-label={`${ariaLabel} formatting`}>
                <select
                    aria-label="Text style"
                    defaultValue="p"
                    onMouseDown={rememberSelection}
                    onChange={(event) => {
                        run('formatBlock', event.target.value);
                        event.target.value = 'p';
                    }}
                >
                    <option value="p">Paragraph</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                    <option value="blockquote">Quote</option>
                </select>

                <span className="admin-rich-divider" aria-hidden="true" />

                {toggleTools.slice(0, 3).map((tool) => (
                    <button
                        key={tool.command}
                        type="button"
                        title={tool.label}
                        aria-label={tool.label}
                        aria-pressed={activeCommands.has(tool.command)}
                        className={activeCommands.has(tool.command) ? 'admin-rich-tool--active' : undefined}
                        onMouseDown={(event) => { rememberSelection(); event.preventDefault(); }}
                        onClick={() => run(tool.command)}
                    >
                        <i className={tool.icon} aria-hidden="true" />
                    </button>
                ))}

                <span className="admin-rich-divider" aria-hidden="true" />

                {toggleTools.slice(3).map((tool) => (
                    <button
                        key={tool.command}
                        type="button"
                        title={tool.label}
                        aria-label={tool.label}
                        aria-pressed={activeCommands.has(tool.command)}
                        className={activeCommands.has(tool.command) ? 'admin-rich-tool--active' : undefined}
                        onMouseDown={(event) => { rememberSelection(); event.preventDefault(); }}
                        onClick={() => run(tool.command)}
                    >
                        <i className={tool.icon} aria-hidden="true" />
                    </button>
                ))}

                <button type="button" title="Add link" aria-label="Add link" onMouseDown={(event) => { rememberSelection(); event.preventDefault(); }} onClick={addLink}>
                    <i className="fas fa-link" aria-hidden="true" />
                </button>
                <button type="button" title="Remove link" aria-label="Remove link" onMouseDown={(event) => { rememberSelection(); event.preventDefault(); }} onClick={() => run('unlink')}>
                    <i className="fas fa-link-slash" aria-hidden="true" />
                </button>

                <span className="admin-rich-divider" aria-hidden="true" />

                <button type="button" title="Clear formatting" aria-label="Clear formatting" onMouseDown={(event) => { rememberSelection(); event.preventDefault(); }} onClick={() => run('removeFormat')}>
                    <i className="fas fa-eraser" aria-hidden="true" />
                </button>
                <button type="button" title="Undo" aria-label="Undo" onMouseDown={(event) => { rememberSelection(); event.preventDefault(); }} onClick={() => run('undo')}>
                    <i className="fas fa-rotate-left" aria-hidden="true" />
                </button>
                <button type="button" title="Redo" aria-label="Redo" onMouseDown={(event) => { rememberSelection(); event.preventDefault(); }} onClick={() => run('redo')}>
                    <i className="fas fa-rotate-right" aria-hidden="true" />
                </button>
            </div>

            <div
                ref={editorRef}
                className="admin-rich-surface"
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-label={ariaLabel}
                aria-multiline="true"
                style={{ minHeight }}
                onInput={emit}
                onKeyUp={updateToolbar}
                onMouseUp={updateToolbar}
                onFocus={updateToolbar}
                onPaste={pastePlainText}
            />
        </div>
    );
}
