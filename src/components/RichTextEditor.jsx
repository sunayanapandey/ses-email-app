import React, { useRef, useEffect, useState } from 'react';
import {
    Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Link2, Image, Type, Palette
} from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder = 'Start typing your email content...' }) => {
    const editorRef = useRef(null);
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [showButtonDialog, setShowButtonDialog] = useState(false);

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const insertLink = () => {
        const url = prompt('Enter URL:');
        if (url) {
            execCommand('createLink', url);
        }
    };

    const insertImage = () => {
        const url = prompt('Enter image URL:');
        if (url) {
            execCommand('insertImage', url);
        }
    };

    const insertButton = () => {
        const text = prompt('Enter button text:', 'Click Here');
        if (text) {
            const href = prompt('Enter button URL:', '#');
            if (href) {
                const buttonHtml = `<a href="${href}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 8px 4px;">${text}</a>`;
                execCommand('insertHTML', buttonHtml);
            }
        }
    };

    const setFontSize = (size) => {
        execCommand('fontSize', size);
    };

    const setTextColor = () => {
        const color = prompt('Enter color (e.g., #FF0000 or red):');
        if (color) {
            execCommand('foreColor', color);
        }
    };

    const setBackgroundColor = () => {
        const color = prompt('Enter background color (e.g., #FFFF00 or yellow):');
        if (color) {
            execCommand('backColor', color);
        }
    };

    return (
        <div className="rich-text-editor-wrapper h-full flex flex-col">
            {/* Toolbar */}
            <div className="toolbar bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
                {/* Text Formatting */}
                <div className="flex gap-1 border-r border-gray-300 pr-2">
                    <button
                        onClick={() => execCommand('bold')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Bold"
                        type="button"
                    >
                        <Bold size={18} />
                    </button>
                    <button
                        onClick={() => execCommand('italic')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Italic"
                        type="button"
                    >
                        <Italic size={18} />
                    </button>
                    <button
                        onClick={() => execCommand('underline')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Underline"
                        type="button"
                    >
                        <Underline size={18} />
                    </button>
                </div>

                {/* Font Size */}
                <div className="flex gap-1 border-r border-gray-300 pr-2">
                    <select
                        onChange={(e) => setFontSize(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                        defaultValue=""
                    >
                        <option value="">Size</option>
                        <option value="1">Small</option>
                        <option value="3">Normal</option>
                        <option value="5">Large</option>
                        <option value="7">Huge</option>
                    </select>
                </div>

                {/* Colors */}
                <div className="flex gap-1 border-r border-gray-300 pr-2">
                    <button
                        onClick={setTextColor}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Text Color"
                        type="button"
                    >
                        <Palette size={18} />
                    </button>
                    <button
                        onClick={setBackgroundColor}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Background Color"
                        type="button"
                    >
                        <Type size={18} />
                    </button>
                </div>

                {/* Alignment */}
                <div className="flex gap-1 border-r border-gray-300 pr-2">
                    <button
                        onClick={() => execCommand('justifyLeft')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Align Left"
                        type="button"
                    >
                        <AlignLeft size={18} />
                    </button>
                    <button
                        onClick={() => execCommand('justifyCenter')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Align Center"
                        type="button"
                    >
                        <AlignCenter size={18} />
                    </button>
                    <button
                        onClick={() => execCommand('justifyRight')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Align Right"
                        type="button"
                    >
                        <AlignRight size={18} />
                    </button>
                    <button
                        onClick={() => execCommand('justifyFull')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Justify"
                        type="button"
                    >
                        <AlignJustify size={18} />
                    </button>
                </div>

                {/* Lists */}
                <div className="flex gap-1 border-r border-gray-300 pr-2">
                    <button
                        onClick={() => execCommand('insertUnorderedList')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Bullet List"
                        type="button"
                    >
                        <List size={18} />
                    </button>
                    <button
                        onClick={() => execCommand('insertOrderedList')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Numbered List"
                        type="button"
                    >
                        <ListOrdered size={18} />
                    </button>
                </div>

                {/* Insert */}
                <div className="flex gap-1 border-r border-gray-300 pr-2">
                    <button
                        onClick={insertLink}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Insert Link"
                        type="button"
                    >
                        <Link2 size={18} />
                    </button>
                    <button
                        onClick={insertImage}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Insert Image"
                        type="button"
                    >
                        <Image size={18} />
                    </button>
                </div>

                {/* CTA Button */}
                <div className="flex gap-1">
                    <button
                        onClick={insertButton}
                        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                        title="Insert CTA Button"
                        type="button"
                    >
                        🔘 Button
                    </button>
                </div>
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="flex-1 p-4 outline-none overflow-auto"
                style={{ minHeight: '400px' }}
                data-placeholder={placeholder}
            />

            <style>{`
                [contentEditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
