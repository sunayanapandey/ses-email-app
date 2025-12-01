import React, { useState, useEffect } from 'react';
import { Save, Send, Layout, FileText, Eye, X, Upload, CheckCircle, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import RichTextEditor from '../components/RichTextEditor';

const EmailComposer = () => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [editorMode, setEditorMode] = useState('rich'); // 'rich' or 'html'
    const [viewMode, setViewMode] = useState('edit'); // 'edit' or 'preview' (only for HTML mode)
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [editingTemplateId, setEditingTemplateId] = useState(null);
    const [templates, setTemplates] = useState([
        { id: 1, name: 'Welcome Email', content: '<h1>Welcome {{name}}!</h1><p>Thanks for joining us.</p>', isSystem: true },
        { id: 2, name: 'Newsletter', content: '<h1>Weekly Update</h1><p>Here is the latest news.</p>', isSystem: true },
    ]);

    // Campaign state
    const [csvFile, setCsvFile] = useState(null);
    const [campaignName, setCampaignName] = useState('');
    const [sending, setSending] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null

    // Saved Lists State
    const [savedLists, setSavedLists] = useState([]);

    useEffect(() => {
        const lists = JSON.parse(localStorage.getItem('savedContactLists') || '[]');
        setSavedLists(lists);
    }, []);

    const handleSaveTemplate = () => {
        if (newTemplateName.trim()) {
            if (editingTemplateId) {
                // Find the template being edited
                const templateToEdit = templates.find(t => t.id === editingTemplateId);

                // If it's a system template, force create new (Save As)
                if (templateToEdit && templateToEdit.isSystem) {
                    setTemplates([...templates, {
                        id: Date.now(),
                        name: newTemplateName,
                        content,
                        isSystem: false
                    }]);
                } else {
                    // Update existing user template
                    setTemplates(templates.map(t =>
                        t.id === editingTemplateId ? { ...t, name: newTemplateName, content } : t
                    ));
                }
                setEditingTemplateId(null);
            } else {
                // Create new template
                setTemplates([...templates, {
                    id: Date.now(),
                    name: newTemplateName,
                    content,
                    isSystem: false
                }]);
            }
            setNewTemplateName('');
            setShowSaveModal(false);
        }
    };

    const loadTemplate = (template) => {
        setContent(template.content);
        setSubject(`[Template] ${template.name}`);
    };

    const editTemplate = (template, e) => {
        e.stopPropagation();
        setEditingTemplateId(template.id);
        setContent(template.content);
        setSubject(`[Template] ${template.name}`);
        setNewTemplateName(template.name);
        setShowSaveModal(true);
    };

    const deleteTemplate = (templateId, e) => {
        e.stopPropagation();
        const template = templates.find(t => t.id === templateId);
        if (template && template.isSystem) {
            alert("System templates cannot be deleted.");
            return;
        }
        if (confirm('Are you sure you want to delete this template?')) {
            setTemplates(templates.filter(t => t.id !== templateId));
        }
    };

    const handleCsvChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'text/csv') {
            setCsvFile(file);
            setUploadStatus(null);
        } else if (file) {
            alert('Please upload a valid CSV file');
        }
    };

    const handleSendCampaign = async () => {
        // Validation
        if (!subject.trim()) {
            alert('Please enter an email subject');
            return;
        }
        if (!content.trim()) {
            alert('Please enter email content');
            return;
        }
        if (!csvFile) {
            alert('Please upload a CSV file with recipients');
            return;
        }
        if (!campaignName.trim()) {
            alert('Please enter a campaign name');
            return;
        }

        setSending(true);
        setUploadStatus(null);

        try {
            // Generate unique fileName for campaign
            const fileName = `${campaignName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.csv`;

            // Step 1: Get presigned upload URL and initialize campaign
            const uploadUrl = await api.getUploadUrl(fileName, subject, content);

            // Step 2: Upload CSV to S3
            const uploadSuccess = await api.uploadToS3(uploadUrl, csvFile);

            if (uploadSuccess) {
                // Save campaign to localStorage for easy access in stats
                const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
                campaigns.unshift({
                    fileName,
                    name: campaignName,
                    subject,
                    createdAt: new Date().toISOString(),
                });
                // Keep only last 20 campaigns
                localStorage.setItem('campaigns', JSON.stringify(campaigns.slice(0, 20)));

                setUploadStatus('success');
                // Reset form
                setTimeout(() => {
                    setCsvFile(null);
                    setCampaignName('');
                    setUploadStatus(null);
                }, 3000);
            } else {
                setUploadStatus('error');
            }
        } catch (error) {
            console.error('Campaign submission error:', error);
            setUploadStatus('error');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Email Composer</h1>
                    <p className="text-gray-500 mt-1">Design your email campaigns.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            setEditingTemplateId(null);
                            setNewTemplateName('');
                            setShowSaveModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Save size={18} />
                        Save Template
                    </button>
                    <button
                        onClick={handleSendCampaign}
                        disabled={sending}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                        {sending ? 'Sending...' : 'Send Campaign'}
                    </button>
                </div>
            </div>

            {/* Success/Error Messages */}
            {uploadStatus === 'success' && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="text-green-800 font-medium">Campaign submitted successfully! Emails are being processed.</span>
                </div>
            )}
            {uploadStatus === 'error' && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <AlertCircle className="text-red-600" size={20} />
                    <span className="text-red-800 font-medium">Error submitting campaign. Please try again.</span>
                </div>
            )}

            {/* Save Template Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingTemplateId ? 'Edit Template' : 'Save as Template'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowSaveModal(false);
                                    setEditingTemplateId(null);
                                    setNewTemplateName('');
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={newTemplateName}
                            onChange={(e) => setNewTemplateName(e.target.value)}
                            placeholder="Template name..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none mb-4"
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveTemplate()}
                            autoFocus
                        />
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowSaveModal(false);
                                    setEditingTemplateId(null);
                                    setNewTemplateName('');
                                }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveTemplate}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                {editingTemplateId ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
                {/* Main Editor Area */}
                <div className="col-span-8 flex flex-col gap-4">
                    {/* Campaign Name */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <input
                            type="text"
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            placeholder="Campaign Name (e.g., 'Newsletter_Jan_2024')"
                            className="w-full text-lg font-medium placeholder-gray-400 outline-none"
                        />
                    </div>

                    {/* Subject Line */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Email Subject Line (use {{name}} for personalization)"
                            className="w-full text-lg font-medium placeholder-gray-400 outline-none"
                        />
                    </div>

                    {/* Email Content Editor */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
                        <div className="border-b border-gray-100 p-2 flex gap-2 bg-gray-50">
                            {/* Editor Mode Toggle */}
                            <button
                                onClick={() => {
                                    setEditorMode('rich');
                                    setViewMode('edit');
                                }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${editorMode === 'rich' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <FileText size={16} />
                                Rich Text
                            </button>
                            <button
                                onClick={() => setEditorMode('html')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${editorMode === 'html' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <FileText size={16} />
                                HTML
                            </button>

                            {/* Preview Toggle (only for HTML mode) */}
                            {editorMode === 'html' && (
                                <>
                                    <div className="border-l border-gray-300 mx-2"></div>
                                    <button
                                        onClick={() => setViewMode('edit')}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'edit' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <FileText size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setViewMode('preview')}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'preview' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <Eye size={16} />
                                        Preview
                                    </button>

                                    {/* Personalization for HTML Mode */}
                                    {viewMode === 'edit' && (
                                        <>
                                            <div className="border-l border-gray-300 mx-2"></div>
                                            <select
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        const token = e.target.value;
                                                        const textarea = document.querySelector('textarea');
                                                        if (textarea) {
                                                            const start = textarea.selectionStart;
                                                            const end = textarea.selectionEnd;
                                                            const text = textarea.value;
                                                            const newText = text.substring(0, start) + token + text.substring(end);
                                                            setContent(newText);
                                                            setTimeout(() => {
                                                                textarea.focus();
                                                                textarea.setSelectionRange(start + token.length, start + token.length);
                                                            }, 0);
                                                        }
                                                        e.target.value = '';
                                                    }
                                                }}
                                                className="px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:border-indigo-500 focus:outline-none focus:border-indigo-500"
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Personalize</option>
                                                <option value="{{name}}">Name</option>
                                                <option value="{{email}}">Email</option>
                                                <option value="{{company}}">Company</option>
                                            </select>
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="flex-1 relative overflow-hidden">
                            {editorMode === 'rich' ? (
                                <RichTextEditor
                                    value={content}
                                    onChange={setContent}
                                    placeholder="Start typing your email content... Use {{name}} for personalization."
                                />
                            ) : (
                                viewMode === 'edit' ? (
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Enter HTML code... Use {{name}} for personalization."
                                        className="w-full h-full p-4 resize-none outline-none border-0 focus:ring-0 font-mono text-sm"
                                        style={{ minHeight: '400px' }}
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full p-8 prose max-w-none overflow-auto"
                                        dangerouslySetInnerHTML={{ __html: content }}
                                    />
                                )
                            )}
                        </div>
                    </div>

                    {/* CSV Upload Section */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Upload size={20} className="text-indigo-600" />
                                <div>
                                    <p className="font-medium text-gray-900">Recipient List (CSV)</p>
                                    <p className="text-xs text-gray-500">Format: email,name</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {csvFile && (
                                    <span className="text-sm text-green-600 flex items-center gap-2">
                                        <CheckCircle size={16} />
                                        {csvFile.name}
                                    </span>
                                )}
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleCsvChange}
                                    className="hidden"
                                    id="csv-file-upload"
                                />
                                <label
                                    htmlFor="csv-file-upload"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors text-sm font-medium"
                                >
                                    {csvFile ? 'Change File' : 'Upload CSV'}
                                </label>
                                {csvFile && (
                                    <button
                                        onClick={() => {
                                            const name = prompt('Enter a name for this contact list:');
                                            if (name) {
                                                const savedLists = JSON.parse(localStorage.getItem('savedContactLists') || '[]');
                                                const reader = new FileReader();
                                                reader.onload = (e) => {
                                                    const content = e.target.result;
                                                    const listToSave = {
                                                        id: Date.now(),
                                                        name,
                                                        content,
                                                        fileName: csvFile.name
                                                    };
                                                    const updatedLists = [...savedLists, listToSave];
                                                    localStorage.setItem('savedContactLists', JSON.stringify(updatedLists));
                                                    setSavedLists(updatedLists);
                                                    alert('List saved successfully!');
                                                };
                                                reader.readAsText(csvFile);
                                            }
                                        }}
                                        className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-200 transition-colors text-sm font-medium flex items-center gap-2"
                                        title="Save as List"
                                    >
                                        <Save size={16} />
                                        Save List
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Saved Lists Dropdown */}
                        {savedLists.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Load Saved List</label>
                                <select
                                    onChange={(e) => {
                                        const listId = e.target.value;
                                        if (listId) {
                                            const selectedList = savedLists.find(l => l.id === parseInt(listId));
                                            if (selectedList) {
                                                const file = new File([selectedList.content], selectedList.fileName, { type: 'text/csv' });
                                                setCsvFile(file);
                                            }
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select a saved list...</option>
                                    {savedLists.map(list => (
                                        <option key={list.id} value={list.id}>{list.name} ({list.fileName})</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar / Templates */}
                <div className="col-span-4 flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-full">
                        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Layout size={20} className="text-indigo-600" />
                            Templates
                        </h2>
                        <div className="space-y-3">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    className="p-3 border border-gray-200 rounded-lg hover:border-indigo-500 transition-all group relative"
                                >
                                    <div onClick={() => loadTemplate(template)} className="cursor-pointer">
                                        <h3 className="font-medium text-gray-900 group-hover:text-indigo-700 pr-16">{template.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1 truncate">
                                            {template.content.replace(/<[^>]*>/g, '')}
                                        </p>
                                    </div>
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => editTemplate(template, e)}
                                            className="p-1.5 hover:bg-indigo-100 rounded transition-colors"
                                            title={template.isSystem ? "Edit (Save as new)" : "Edit template"}
                                        >
                                            <Edit2 size={14} className="text-indigo-600" />
                                        </button>
                                        {!template.isSystem && (
                                            <button
                                                onClick={(e) => deleteTemplate(template.id, e)}
                                                className="p-1.5 hover:bg-red-100 rounded transition-colors"
                                                title="Delete template"
                                            >
                                                <Trash2 size={14} className="text-red-600" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailComposer;
