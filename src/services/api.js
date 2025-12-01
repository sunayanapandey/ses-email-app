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

    // Get campaign statistics
    getStats: async (fileName) => {
        try {
            console.log('Fetching stats for:', fileName);
            const url = `${BASE_URL}/stats?fileName=${encodeURIComponent(fileName)}`;
            console.log('Request URL:', url);

            const response = await fetch(url);
            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Raw API response:', data);

            return {
                sent: data.SentCount || 0,
                opened: data.OpenCount || 0,
                clicked: data.ClickCount || 0,
                bounced: data.BounceCount || 0,
                fileName: data.FileName,
                subject: data.Subject,
                body: data.Body,
            };
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    },

    // ========== Mock/Local Features (Domain Management) ==========

    // Domain Management (keeping as mock since not in AWS template)
    getDomains: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 1, domain: 'example.com', status: 'verified' },
                    { id: 2, domain: 'test.org', status: 'pending' },
                ]);
            }, 500);
        });
    },

    verifyDomain: async (domain) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ id: Date.now(), domain, status: 'pending' });
            }, 800);
        });
    },
};
