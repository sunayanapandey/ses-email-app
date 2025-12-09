import React, { useRef, useEffect, useState } from 'react';
import {
    Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Link2, Image, Type, Highlighter
} from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder = 'Start typing your email content...' }) => {
    const editorRef = useRef(null);
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [showButtonDialog, setShowButtonDialog] = useState(false);
    const [textColor, setTextColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffff00');
    const textColorInputRef = useRef(null);
    const bgColorInputRef = useRef(null);

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
        const selection = window.getSelection();
        const selectedText = selection.toString();

        if (!selectedText) {
            alert('Please select some text first to create a link');
            return;
        }

        const url = prompt('Enter URL:', 'https://');
        if (url) {
            execCommand('createLink', url);
            // Trigger onChange to update the content
            handleInput();
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

    const handleTextColorChange = (color) => {
        setTextColor(color);
        execCommand('foreColor', color);
    };

    const handleBgColorChange = (color) => {
        setBgColor(color);
        execCommand('backColor', color);
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
                    <div className="relative">
                        <button
                            onClick={() => textColorInputRef.current?.click()}
                            className="p-2 hover:bg-gray-200 rounded flex items-center gap-1"
                            title="Text Color"
                            type="button"
                        >
                            <Type size={18} />
                            <div
                                className="w-4 h-4 rounded border border-gray-300"
                                style={{ backgroundColor: textColor }}
                            ></div>
                        </button>
                        <input
                            ref={textColorInputRef}
                            type="color"
                            value={textColor}
                            onChange={(e) => handleTextColorChange(e.target.value)}
                            className="absolute opacity-0 pointer-events-none"
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => bgColorInputRef.current?.click()}
                            className="p-2 hover:bg-gray-200 rounded flex items-center gap-1"
                            title="Highlight Color"
                            type="button"
                        >
                            <Highlighter size={18} />
                            <div
                                className="w-4 h-4 rounded border border-gray-300"
                                style={{ backgroundColor: bgColor }}
                            ></div>
                        </button>
                        <input
                            ref={bgColorInputRef}
                            type="color"
                            value={bgColor}
                            onChange={(e) => handleBgColorChange(e.target.value)}
                            className="absolute opacity-0 pointer-events-none"
                        />
                    </div>
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
                <div className="flex gap-1 border-r border-gray-300 pr-2">
                    <button
                        onClick={insertButton}
                        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                        title="Insert CTA Button"
                        type="button"
                    >
                        🔘 Button
                    </button>
                </div>

                {/* Personalization */}
                <div className="flex gap-1">
                    <select
                        onChange={(e) => {
                            if (e.target.value) {
                                execCommand('insertText', e.target.value);
                                e.target.value = ''; // Reset selection
                            }
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-sm bg-white text-gray-700 hover:border-indigo-500 focus:outline-none focus:border-indigo-500"
                        defaultValue=""
                    >
                        <option value="" disabled>Personalize</option>
                        <option value="{{name}}">Name</option>
                        <option value="{{email}}">Email</option>
                        <option value="{{company}}">Company</option>
                    </select>
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
                
                /* List styling */
                [contentEditable] ul {
                    list-style-type: disc;
                    padding-left: 40px;
                    margin: 8px 0;
                }
                
                [contentEditable] ol {
                    list-style-type: decimal;
                    padding-left: 40px;
                    margin: 8px 0;
                }
                
                [contentEditable] li {
                    margin: 4px 0;
                }
                
                /* Link styling in editor */
                [contentEditable] a {
                    color: #4f46e5;
                    text-decoration: underline;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
