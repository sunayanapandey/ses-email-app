// AWS SES API Service
const BASE_URL = "https://knplqg2pue.execute-api.us-east-1.amazonaws.com/prod";

export const api = {
    // ========== AWS API Endpoints ==========

    // Get user's email balance
    getBalance: async () => {
        try {
            const response = await fetch(`${BASE_URL}/balance`);
            const data = await response.json();
            return data.balance || 0;
        } catch (error) {
            console.error('Error fetching balance:', error);
            return 100; // Fallback to default
        }
    },

    // Get presigned S3 upload URL and initialize campaign
    getUploadUrl: async (fileName, subject, body) => {
        try {
            const response = await fetch(`${BASE_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName,
                    subject,
                    body,
                }),
            });
            const data = await response.json();
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
            console.log('Fetching campaign:', campaignId);
            const url = `${BASE_URL}/campaigns?campaignId=${encodeURIComponent(campaignId)}`;
            console.log('Request URL:', url);

            const response = await fetch(url);
            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Raw API response:', data);

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

    // ========== Domain Management (Real API) ==========

    // Get all verified/pending SES domains and emails
    getDomains: async () => {
        try {
            const response = await fetch(`${BASE_URL}/domains`);
            if (!response.ok) throw new Error('Failed to fetch domains');
            const data = await response.json();

            // Transform to expected format
            return data.map(d => ({
                domain: d.identity,
                status: d.status === 'Success' ? 'success' : d.status.toLowerCase(),
                token: d.token
            }));
        } catch (error) {
            console.error('Error fetching domains:', error);
            return [];
        }
    },

    verifyDomain: async (identity, type = 'email') => {
        try {
            const response = await fetch(`${BASE_URL}/domains`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identity, type })
            });
            if (!response.ok) throw new Error('Failed to verify domain/email');
            return await response.json();
        } catch (error) {
            console.error('Error verifying domain:', error);
            throw error;
        }
    },

    deleteDomain: async (identity) => {
        try {
            const response = await fetch(`${BASE_URL}/domains?identity=${encodeURIComponent(identity)}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete domain');
            return await response.json();
        } catch (error) {
            console.error('Error deleting domain:', error);
            throw error;
        }
    },
};
