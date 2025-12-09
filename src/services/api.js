// AWS SES API Service
const BASE_URL = "https://tpifntockj.execute-api.us-east-1.amazonaws.com/prod";
const AUTH_BASE_URL = "http://52.22.236.46/api";

// Session expiration callback (will be set by AuthContext)
let onSessionExpired = null;

export const setSessionExpiredCallback = (callback) => {
    onSessionExpired = callback;
};

// Helper to get auth token
const getAuthToken = () => {
    return localStorage.getItem('auth_token');
};

// Helper to add auth header  
const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// Helper to handle API response and detect 401 errors
const handleResponse = async (response) => {
    console.log('📡 API Response Status:', response.status);
    if (response.status === 401) {
        console.log('🔴 401 Unauthorized detected!');
        // Token expired or unauthorized
        if (onSessionExpired) {
            console.log('✅ Calling session expired callback');
            onSessionExpired();
        } else {
            console.log('⚠️ No session expired callback registered!');
        }
        throw new Error('Session expired. Please log in again.');
    }
    return response;
};

export const api = {
    // ========== Authentication ==========

    register: async (email, password) => {
        try {
            const response = await fetch(`${AUTH_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!response.ok) throw new Error('Registration failed');
            return await response.json();
        } catch (error) {
            console.error('Error registering:', error);
            throw error;
        }
    },

    login: async (email, password) => {
        try {
            // FastAPI OAuth2 expects form data, not JSON
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const response = await fetch(`${AUTH_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });
            if (!response.ok) throw new Error('Login failed');
            return await response.json();
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    },

    // ========== AWS API Endpoints ==========

    // Get user's email balance
    getBalance: async () => {
        try {
            const response = await fetch(`${BASE_URL}/balance`, {
                headers: getAuthHeaders()
            });
            await handleResponse(response);
            const data = await response.json();
            return data.balance || 0;
        } catch (error) {
            console.error('Error fetching balance:', error);
            return 100; // Fallback to default
        }
    },

    // Get presigned S3 upload URL and initialize campaign
    getUploadUrl: async (fileName, subject, body, senderEmail) => {
        try {
            const response = await fetch(`${BASE_URL}/upload`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    fileName,
                    subject,
                    body,
                    senderEmail,
                }),
            });
            const

                data = await response.json();
            return data.uploadURL;
        } catch (error) {
            console.error('Error getting upload URL:', error);
            throw error;
        }
    },

    // Upload CSV file to S3 using presigned URL
    uploadToS3: async (presignedUrl, file) => {
        try {
            const response = await fetch(presignedUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/csv',
                },
                body: file,
            });
            return response.ok;
        } catch (error) {
            console.error('Error uploading to S3:', error);
            throw error;
        }
    },

    // Get single campaign by ID
    getCampaign: async (campaignId) => {
        try {
            const url = `${BASE_URL}/campaigns?campaignId=${encodeURIComponent(campaignId)}`;
            const response = await fetch(url, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                campaignId: data.CampaignId,
                fileName: data.OriginalFileName || data.CampaignId,
                subject: data.Subject,
                body: data.Body,
                sent: data.SentCount || 0,
                opened: data.OpenCount || 0,
                clicked: data.ClickCount || 0,
                bounced: data.BounceCount || 0,
                status: data.Status,
                createdAt: data.CreatedAt,
                senderEmail: data.SenderEmail
            };
        } catch (error) {
            console.error('Error fetching campaign:', error);
            throw error;
        }
    },

    // Get all campaigns
    getCampaigns: async () => {
        try {
            const response = await fetch(`${BASE_URL}/campaigns`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            return data.map(campaign => ({
                campaignId: campaign.CampaignId,
                name: campaign.OriginalFileName || campaign.CampaignId,
                subject: campaign.Subject,
                body: campaign.Body,
                sent: campaign.SentCount || 0,
                opened: campaign.OpenCount || 0,
                clicked: campaign.ClickCount || 0,
                bounced: campaign.BounceCount || 0,
                status: campaign.Status,
                createdAt: campaign.CreatedAt || campaign.UpdatedAt || new Date().toISOString(),
                senderEmail: campaign.SenderEmail,
                listId: campaign.ListId
            }));
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            return [];
        }
    },

    // ========== Lists Management ==========

    // Get all lists
    getLists: async () => {
        try {
            const response = await fetch(`${BASE_URL}/lists`, {
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error('Failed to fetch lists');
            const data = await response.json();

            return data.map(list => ({
                id: list.ListId,
                name: list.Name,
                description: list.Description || '',
                createdAt: list.CreatedAt
            }));
        } catch (error) {
            console.error('Error fetching lists:', error);
            return [];
        }
    },

    // Create a new list
    createList: async (name, description = '') => {
        try {
            const response = await fetch(`${BASE_URL}/lists`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ name, description })
            });

            if (!response.ok) throw new Error('Failed to create list');
            const data = await response.json();

            return {
                id: data.ListId,
                name: data.Name,
                description: data.Description || '',
                createdAt: data.CreatedAt
            };
        } catch (error) {
            console.error('Error creating list:', error);
            throw error;
        }
    },

    // Delete a list
    deleteList: async (listId) => {
        try {
            const response = await fetch(`${BASE_URL}/lists?listId=${encodeURIComponent(listId)}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Failed to delete list');
            return await response.json();
        } catch (error) {
            console.error('Error deleting list:', error);
            throw error;
        }
    },

    // ========== Contacts Management ==========

    // Get contacts by list ID
    getContactsByList: async (listId) => {
        try {
            const response = await fetch(`${BASE_URL}/contacts?listId=${encodeURIComponent(listId)}`, {
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error('Failed to fetch contacts');
            const data = await response.json();

            return data.map(contact => ({
                id: contact.ContactId,
                email: contact.Email,
                name: contact.Name,
                listId: contact.ListId,
                createdAt: contact.CreatedAt
            }));
        } catch (error) {
            console.error('Error fetching contacts:', error);
            return [];
        }
    },

    // Add a single contact
    addContact: async (email, name, listId) => {
        try {
            const response = await fetch(`${BASE_URL}/contacts`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ Email: email, Name: name, ListId: listId })
            });

            if (!response.ok) throw new Error('Failed to add contact');
            return await response.json();
        } catch (error) {
            console.error('Error adding contact:', error);
            throw error;
        }
    },

    // Batch add contacts
    batchAddContacts: async (contacts, listId) => {
        try {
            const promises = contacts.map(contact =>
                api.addContact(contact.email, contact.name, listId)
            );
            return await Promise.all(promises);
        } catch (error) {
            console.error('Error batch adding contacts:', error);
            throw error;
        }
    },

    // ========== Templates Management ==========

    // Get all templates
    getTemplates: async () => {
        try {
            const response = await fetch(`${BASE_URL}/templates`, {
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error('Failed to fetch templates');
            const data = await response.json();

            return data.map(template => ({
                id: template.TemplateId,
                name: template.name,
                content: template.content,
                isSystem: template.isSystem || false
            }));
        } catch (error) {
            console.error('Error fetching templates:', error);
            return [];
        }
    },

    // Save template (create or update)
    saveTemplate: async (template) => {
        try {
            const response = await fetch(`${BASE_URL}/templates`, {
                method: template.id ? 'PUT' : 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(template)
            });

            if (!response.ok) throw new Error('Failed to save template');
            const data = await response.json();

            return {
                id: data.TemplateId,
                name: data.name,
                content: data.content,
                isSystem: data.isSystem || false
            };
        } catch (error) {
            console.error('Error saving template:', error);
            throw error;
        }
    },

    // Delete template
    deleteTemplate: async (templateId) => {
        try {
            const response = await fetch(`${BASE_URL}/templates?templateId=${encodeURIComponent(templateId)}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Failed to delete template');
            return await response.json();
        } catch (error) {
            console.error('Error deleting template:', error);
            throw error;
        }
    },

    // ========== Senders Management (Email Verification) ==========

    getSenders: async () => {
        try {
            const response = await fetch(`${BASE_URL}/senders`, {
                headers: getAuthHeaders()
            });
            if (!response.ok) throw new Error('Failed to fetch senders');
            const data = await response.json();

            return data.map(d => ({
                email: d.email,
                status: d.status || 'Pending'
            }));
        } catch (error) {
            console.error('Error fetching senders:', error);
            return [];
        }
    },

    addSender: async (email) => {
        try {
            const response = await fetch(`${BASE_URL}/senders`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ email })
            });

            if (!response.ok) throw new Error('Failed to add sender');
            return await response.json();
        } catch (error) {
            console.error('Error adding sender:', error);
            throw error;
        }
    },

    deleteSender: async (email) => {
        try {
            const response = await fetch(`${BASE_URL}/senders?email=${encodeURIComponent(email)}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Failed to delete sender');
            return await response.json();
        } catch (error) {
            console.error('Error deleting sender:', error);
            throw error;
        }
    },

    // ========== Campaign Actions ==========

    sendCampaign: async (campaignId) => {
        try {
            const response = await fetch(`${BASE_URL}/campaigns/send`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ campaignId })
            });

            if (!response.ok) throw new Error('Failed to send campaign');
            return await response.json();
        } catch (error) {
            console.error('Error sending campaign:', error);
            throw error;
        }
    }
};
