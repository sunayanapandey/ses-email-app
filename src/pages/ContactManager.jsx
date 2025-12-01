import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload, Users, FileSpreadsheet, Trash2, CheckCircle } from 'lucide-react';

const ContactManager = () => {
    const [contacts, setContacts] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        setUploading(true);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                // Preview contacts locally
                setContacts((prev) => [...prev, ...results.data]);
                setUploading(false);
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                setUploading(false);
                alert('Error parsing CSV file');
            }
        });
    };

    const clearContacts = () => {
        if (confirm('Are you sure you want to clear all contacts?')) {
            setContacts([]);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>
                    <p className="text-gray-500 mt-2">Preview and validate your email lists.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2 shadow-sm">
                        <Users className="text-indigo-600" size={20} />
                        <span className="font-semibold text-gray-900">{contacts.length}</span>
                        <span className="text-gray-500">Total Contacts</span>
                    </div>
                    {contacts.length > 0 && (
                        <button
                            onClick={clearContacts}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors flex items-center gap-2"
                        >
                            <Trash2 size={18} />
                            Clear List
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
                {/* Upload Area */}
                <div className="lg:col-span-1">
                    <div
                        className={`h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-all ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="bg-indigo-100 p-4 rounded-full mb-4 text-indigo-600">
                            <Upload size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Upload CSV</h3>
                        <p className="text-sm text-gray-500 mb-4">Drag & drop or click to browse</p>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleChange}
                            className="hidden"
                            id="csv-upload"
                        />
                        <label
                            htmlFor="csv-upload"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors font-medium"
                        >
                            {uploading ? 'Processing...' : 'Select File'}
                        </label>
                        <p className="text-xs text-gray-400 mt-4">Supported format: .csv with header row</p>
                    </div>

                    <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                            <FileSpreadsheet size={18} />
                            CSV Format Guide
                        </h4>
                        <p className="text-sm text-blue-600 mb-2">Your CSV should have headers like:</p>
                        <code className="block bg-white p-2 rounded border border-blue-200 text-xs font-mono text-gray-600">
                            email,name
                        </code>
                        <p className="text-xs text-blue-600 mt-3">
                            💡 Note: Actual upload happens when you send a campaign in the Email Composer.
                        </p>
                    </div>
                </div>

                {/* Contact List */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-700">Preview Contacts</h2>
                    </div>

                    <div className="flex-1 overflow-auto">
                        {contacts.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        {Object.keys(contacts[0]).map((header) => (
                                            <th key={header} className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {contacts.map((contact, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            {Object.values(contact).map((value, i) => (
                                                <td key={i} className="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">
                                                    {value}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                                <Users size={48} className="mb-4 opacity-20" />
                                <p>No contacts uploaded yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactManager;
