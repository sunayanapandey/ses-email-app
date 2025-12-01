import React, { useState } from 'react';
import { Save, Send, Layout, FileText, Eye, X, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import RichTextEditor from '../components/RichTextEditor';

const EmailComposer = () => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [viewMode, setViewMode] = useState('edit'); // 'edit' or 'preview'
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [templates, setTemplates] = useState([
        { id: 1, name: 'Welcome Email', content: '<h1>Welcome {{name}}!</h1><p>Thanks for joining us.</p>' },
        { id: 2, name: 'Newsletter', content: '<h1>Weekly Update</h1><p>Here is the latest news.</p>' },
    ]);

    // Campaign state
    const [csvFile, setCsvFile] = useState(null);
    const [campaignName, setCampaignName] = useState('');
    const [sending, setSending] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null

    const handleSaveTemplate = () => {
        if (newTemplateName.trim()) {
            setTemplates([...templates, { id: Date.now(), name: newTemplateName, content }]);
            setNewTemplateName('');
            setShowSaveModal(false);
        }
    };

    const loadTemplate = (template) => {
        setContent(template.content);
        setSubject(`[Template] ${template.name}`);
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
                        onClick={() => setShowSaveModal(true)}
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
                    <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Save as Template</h3>
                            <button onClick={() => setShowSaveModal(false)} className="text-gray-500 hover:text-gray-700">
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
                                onClick={() => setShowSaveModal(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveTemplate}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Save
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
                            <button
                                onClick={() => setViewMode('edit')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'edit' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <FileText size={16} />
                                Rich Editor
                            </button>
                            <button
                                onClick={() => setViewMode('preview')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'preview' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <Eye size={16} />
                                Preview
                            </button>
                        </div>

                        <div className="flex-1 relative overflow-hidden">
                            {viewMode === 'edit' ? (
                                <RichTextEditor
                                    value={content}
                                    onChange={setContent}
                                    placeholder="Start typing your email content... Use {{name}} for personalization."
                                />
                            ) : (
                                <div
                                    className="w-full h-full p-8 prose max-w-none overflow-auto"
                                    dangerouslySetInnerHTML={{ __html: content }}
                                />
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
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Templates */}
                <div className="col-span-4 flex flex-col gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                                <Layout size={18} />
                                Templates
                            </h2>
                        </div>
                        <div className="p-4 overflow-auto flex-1 space-y-3">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    onClick={() => loadTemplate(template)}
                                    className="p-3 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer transition-all group"
                                >
                                    <h3 className="font-medium text-gray-900 group-hover:text-indigo-700">{template.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1 truncate">
                                        {template.content.replace(/<[^>]*>/g, '').substring(0, 50)}...
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Helper Info */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-2">💡 Tips</h4>
                        <p className="text-xs text-blue-600 mb-2">
                            Use <code className="bg-blue-100 px-1 rounded">{'{{name}}'}</code> anywhere in your subject or content to personalize emails.
                        </p>
                        <p className="text-xs text-blue-600">
                            Use the rich text editor toolbar to format your emails with fonts, colors, images, links, and CTA buttons.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailComposer;
