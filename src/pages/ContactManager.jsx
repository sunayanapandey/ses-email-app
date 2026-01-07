import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Upload, Users, FileSpreadsheet, Trash2, CheckCircle, X } from 'lucide-react';
import { api } from '../services/api';
import Button from '../components/Button';

const ContactManager = () => {
    const [contacts, setContacts] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [savedLists, setSavedLists] = useState([]);
    const [selectedListId, setSelectedListId] = useState(null);
    const [showSaveListModal, setShowSaveListModal] = useState(false);
    const [newListName, setNewListName] = useState('');

    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        variant: 'destructive', // 'destructive' or 'default'
        confirmText: 'Confirm'
    });

    useEffect(() => {
        loadLists();
    }, []);

    const loadLists = async () => {
        try {
            const listsData = await api.getLists();
            setSavedLists(listsData);
        } catch (error) {
            console.error('Error loading lists:', error);
            setSavedLists([]);
        }
    };

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
                setContacts(results.data);
                setUploading(false);
                setSelectedListId(null); // Clear selected list when uploading new file
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                setUploading(false);
                alert('Error parsing CSV file');
            }
        });
    };

    const saveCurrentList = () => {
        if (contacts.length === 0) return;
        setNewListName('');
        setShowSaveListModal(true);
    };

    const handleSaveList = async () => {
        if (!newListName.trim()) {
            alert('Please enter a list name');
            return;
        }

        try {
            // Step 1: Create list in DynamoDB
            const newList = await api.createList(newListName, `Saved from Contact Manager`);

            // Step 2: Parse contacts and add to DynamoDB
            const contactsToSave = contacts.map(c => ({
                email: c.email || c.Email,
                name: c.name || c.Name || 'Contact'
            }));

            await api.batchAddContacts(contactsToSave, newList.id);

            // Step 3: Reload lists
            const updatedLists = await api.getLists();
            setSavedLists(updatedLists);
            setSelectedListId(newList.id);

            alert(`List "${newListName}" saved successfully with ${contactsToSave.length} contacts!`);
            setShowSaveListModal(false);
            setNewListName('');
        } catch (error) {
            console.error('Error saving list:', error);
            alert('Failed to save list. Please try again.');
        }
    };

    const loadList = async (list) => {
        setSelectedListId(list.id);
        try {
            // Fetch contacts for this list from DynamoDB
            const contactsData = await api.getContactsByList(list.id);

            // Transform to match expected format
            const transformedContacts = contactsData.map(c => ({
                email: c.email,
                name: c.name,
                Email: c.email,
                Name: c.name
            }));

            setContacts(transformedContacts);
        } catch (error) {
            console.error('Error loading contacts:', error);
            alert('Failed to load contacts. Please try again.');
        }
    };

    const showConfirmation = (title, message, onConfirm, variant = 'destructive', confirmText = 'Confirm') => {
        setConfirmationModal({
            isOpen: true,
            title,
            message,
            onConfirm,
            variant,
            confirmText
        });
    };

    const closeConfirmation = () => {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
    };

    const handleConfirmAction = () => {
        if (confirmationModal.onConfirm) {
            confirmationModal.onConfirm();
        }
        closeConfirmation();
    };

    const deleteList = async (e, id) => {
        e.stopPropagation();

        showConfirmation(
            'Delete Saved List',
            'Are you sure you want to delete this saved list? This action cannot be undone.',
            async () => {
                try {
                    await api.deleteList(id);
                    const updatedLists = await api.getLists();
                    setSavedLists(updatedLists);

                    if (selectedListId === id) {
                        setSelectedListId(null);
                        setContacts([]);
                    }

                    // Optional: Show success toast instead of alert if Toast system is fully integrated
                    // For now, removing alert or replacing with simple clear
                } catch (error) {
                    console.error('Error deleting list:', error);
                    alert('Failed to delete list. Please try again.');
                }
            },
            'destructive',
            'Delete List'
        );
    };

    const clearContacts = () => {
        showConfirmation(
            'Clear Current View',
            'Are you sure you want to clear the current view? This will remove all contacts from the table but will not delete them from your saved lists.',
            () => {
                setContacts([]);
                setSelectedListId(null);
            },
            'destructive',
            'Clear View'
        );
    };

    const deleteContact = (index) => {
        setContacts(contacts.filter((_, i) => i !== index));
    };

    const exportCSV = () => {
        if (contacts.length === 0) return;

        const csv = Papa.unparse(contacts);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'contacts_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredContacts = contacts.filter(contact => {
        if (!searchTerm) return true;
        return Object.values(contact).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-h1 text-surface-900">Contact Management</h1>
                    <p className="text-surface-500 mt-2">Manage your saved contact lists and preview CSVs.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2 shadow-sm">
                        <Users className="text-primary-600" size={20} />
                        <span className="font-semibold text-surface-900">{contacts.length}</span>
                        <span className="text-surface-500">Total Contacts</span>
                    </div>
                    {contacts.length > 0 && (
                        <>
                            <Button
                                variant="secondary"
                                onClick={saveCurrentList}
                                icon={Upload}
                            >
                                Save as List
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={exportCSV}
                                icon={Upload}
                            >
                                Export CSV
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={clearContacts}
                                icon={Trash2}
                            >
                                Clear View
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">
                {/* Saved Lists Sidebar */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-surface-100 flex-1 overflow-hidden flex flex-col">
                        <h3 className="font-bold text-surface-900 mb-4 flex items-center gap-2">
                            <FileSpreadsheet size={20} className="text-primary-600" />
                            Saved Lists
                        </h3>
                        <div className="overflow-y-auto flex-1 space-y-2">
                            {savedLists.length === 0 ? (
                                <p className="text-body text-surface-500 italic">No saved lists yet.</p>
                            ) : (
                                savedLists.map(list => (
                                    <div
                                        key={list.id}
                                        onClick={() => loadList(list)}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all group flex justify-between items-center ${selectedListId === list.id
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-gray-200 hover:border-primary-300 hover:bg-surface-10'
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="font-medium text-surface-900 truncate">{list.name}</p>
                                            <p className="text-caption text-surface-500 truncate">{list.description || 'No description'}</p>
                                        </div>
                                        <button
                                            onClick={(e) => deleteList(e, list.id)}
                                            className="text-surface-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Delete List"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Upload Area (Small) */}
                    <div
                        className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 text-center transition-all ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-surface-10'
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <Upload size={24} className="text-primary-400 mb-2" />
                        <p className="text-h6 text-surface-900">Upload New CSV</p>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleChange}
                            className="hidden"
                            id="csv-upload"
                        />
                        <label
                            htmlFor="csv-upload"
                            className="mt-2 text-xs text-primary-600 hover:text-primary-700 cursor-pointer font-medium"
                        >
                            Browse Files
                        </label>
                    </div>
                </div>

                {/* Contact List */}
                <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-surface-100 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-surface-100 bg-surface-10 flex justify-between items-center gap-4">
                        <h2 className="font-semibold text-surface-700 whitespace-nowrap">
                            {selectedListId ? savedLists.find(l => l.id === selectedListId)?.name : 'Preview Contacts'}
                        </h2>
                        {contacts.length > 0 && (
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full max-w-xs px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                            />
                        )}
                    </div>

                    <div className="flex-1 overflow-auto">
                        {filteredContacts.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="bg-surface-10 sticky top-0">
                                    <tr>
                                        {Object.keys(contacts[0]).map((header) => (
                                            <th key={header} className="px-6 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                        <th className="px-6 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider w-10">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredContacts.map((contact, idx) => (
                                        <tr key={idx} className="hover:bg-surface-10 group">
                                            {Object.values(contact).map((value, i) => (
                                                <td key={i} className="px-6 py-3 text-body text-surface-700 whitespace-nowrap">
                                                    {value}
                                                </td>
                                            ))}
                                            <td className="px-6 py-3 text-body text-surface-700 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => deleteContact(idx)}
                                                    className="text-surface-400 hover:text-error-600 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Delete Contact"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-surface-400 p-8">
                                <Users size={48} className="mb-4 opacity-20" />
                                <p>{contacts.length > 0 ? 'No contacts match your search.' : 'Select a list or upload a CSV to view contacts.'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Save List Modal */}
            {showSaveListModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowSaveListModal(false)}>
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-h3 text-surface-900">
                                Save Contact List
                            </h3>
                            <button
                                onClick={() => setShowSaveListModal(false)}
                                className="text-surface-500 hover:text-surface-700"
                                type="button"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            placeholder="List name..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none mb-4"
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveList()}
                            autoFocus
                        />
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="ghost"
                                onClick={() => setShowSaveListModal(false)}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveList}
                                type="button"
                            >
                                Save List
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmationModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeConfirmation}>
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start gap-4 mb-4">
                            <div className={`p-3 rounded-full flex-shrink-0 ${confirmationModal.variant === 'destructive' ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-600'}`}>
                                {confirmationModal.variant === 'destructive' ? <Trash2 size={24} /> : <AlertCircle size={24} />}
                            </div>
                            <div>
                                <h3 className="text-h3 text-surface-900 font-semibold mb-2">
                                    {confirmationModal.title}
                                </h3>
                                <p className="text-body text-surface-600">
                                    {confirmationModal.message}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end mt-6">
                            <Button
                                variant="ghost"
                                onClick={closeConfirmation}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant={confirmationModal.variant === 'destructive' ? 'destructive' : 'primary'}
                                onClick={handleConfirmAction}
                                type="button"
                            >
                                {confirmationModal.confirmText}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactManager;
