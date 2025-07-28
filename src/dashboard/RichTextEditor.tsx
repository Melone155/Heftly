import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import {
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Palette,
    Highlighter
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
                                                           value,
                                                           onChange,
                                                           className = ""
                                                       }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline hover:text-blue-800',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
            },
        },
    });

    const addImage = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    if (editor && reader.result) {
                        editor.chain().focus().setImage({ src: reader.result as string }).run();
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }, [editor]);

    const addLink = useCallback(() => {
        const previousUrl = editor?.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({
                               onClick,
                               isActive = false,
                               disabled = false,
                               children,
                               title
                           }: {
        onClick: () => void;
        isActive?: boolean;
        disabled?: boolean;
        children: React.ReactNode;
        title: string;
    }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-2 rounded-md transition-colors ${
                isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            {children}
        </button>
    );

    return (
        <div className={`rich-text-editor border border-gray-300 rounded-lg overflow-hidden ${className}`}>
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                {/* Text Formatting */}
                <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Fett"
                    >
                        <Bold className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Kursiv"
                    >
                        <Italic className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Durchgestrichen"
                    >
                        <Strikethrough className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                {/* Headings */}
                <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
                    <select
                        onChange={(e) => {
                            const level = parseInt(e.target.value);
                            if (level === 0) {
                                editor.chain().focus().setParagraph().run();
                            } else {
                                editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run();
                            }
                        }}
                        value={
                            editor.isActive('heading', { level: 1 }) ? 1 :
                                editor.isActive('heading', { level: 2 }) ? 2 :
                                    editor.isActive('heading', { level: 3 }) ? 3 : 0
                        }
                        className="px-2 py-1 text-sm border border-gray-300 rounded"
                    >
                        <option value={0}>Normal</option>
                        <option value={1}>Überschrift 1</option>
                        <option value={2}>Überschrift 2</option>
                        <option value={3}>Überschrift 3</option>
                    </select>
                </div>

                {/* Lists */}
                <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Aufzählung"
                    >
                        <List className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Nummerierte Liste"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Zitat"
                    >
                        <Quote className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                {/* Alignment */}
                <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        isActive={editor.isActive({ textAlign: 'left' })}
                        title="Links ausrichten"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        isActive={editor.isActive({ textAlign: 'center' })}
                        title="Zentriert ausrichten"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        isActive={editor.isActive({ textAlign: 'right' })}
                        title="Rechts ausrichten"
                    >
                        <AlignRight className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                {/* Colors */}
                <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
                    <div className="flex items-center gap-1">
                        <Palette className="w-4 h-4 text-gray-600" />
                        <input
                            type="color"
                            onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
                            value={editor.getAttributes('textStyle').color || '#000000'}
                            className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                            title="Textfarbe"
                        />
                    </div>
                    <div className="flex items-center gap-1">
                        <Highlighter className="w-4 h-4 text-gray-600" />
                        <input
                            type="color"
                            onInput={(e) => editor.chain().focus().setHighlight({ color: (e.target as HTMLInputElement).value }).run()}
                            className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                            title="Hintergrundfarbe"
                        />
                    </div>
                </div>

                {/* Media */}
                <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
                    <ToolbarButton
                        onClick={addLink}
                        isActive={editor.isActive('link')}
                        title="Link einfügen"
                    >
                        <LinkIcon className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={addImage}
                        title="Bild einfügen"
                    >
                        <ImageIcon className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                {/* Undo/Redo */}
                <div className="flex gap-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().chain().focus().undo().run()}
                        title="Rückgängig"
                    >
                        <Undo className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().chain().focus().redo().run()}
                        title="Wiederholen"
                    >
                        <Redo className="w-4 h-4" />
                    </ToolbarButton>
                </div>
            </div>

            {/* Editor Content */}
            <div className="bg-white min-h-[200px]">
                <EditorContent
                    editor={editor}
                    className="focus-within:outline-none"
                />
            </div>
        </div>
    );
};

export default RichTextEditor;