(function() {
    const SUPABASE_URL = 'https://zwmpipsoeshhgusvgemh.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_CYKA0VrB_n8J5fbBAUwFRQ_OaUe3uPo';

    async function request(method, url, data = null, headers = {}) {
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'apikey': SUPABASE_KEY
        };

        const response = await fetch(`${SUPABASE_URL}/rest/v1${url}`, {
            method: method,
            headers: { ...defaultHeaders, ...headers },
            body: data ? JSON.stringify(data) : null
        });

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            try {
                const error = JSON.parse(text);
                throw new Error(error.message || 'Request failed');
            } catch {
                throw new Error(text || `Request failed with status ${response.status}`);
            }
        }

        const text = await response.text();
        if (!text) {
            return { success: true, message: '数据已插入' };
        }

        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }

    async function fetchProjects() {
        try {
            const data = await request('GET', '/projects?order=created_at.desc');
            return data;
        } catch (error) {
            console.error('Error fetching projects:', error);
            return null;
        }
    }

    async function insertProject(projectData) {
        try {
            const data = await request('POST', '/projects?select=*', projectData);
            return { success: true, data };
        } catch (error) {
            console.error('Error inserting project:', error);
            return { success: false, error: error.message };
        }
    }

    async function insertContact(data) {
        try {
            const result = await request('POST', '/contacts?select=*', data);
            return { success: true, data: result };
        } catch (error) {
            console.error('Error inserting contact:', error);
            return { success: false, error: error.message };
        }
    }

    async function fetchContacts() {
        try {
            const data = await request('GET', '/contacts?order=created_at.desc');
            return data;
        } catch (error) {
            console.error('Error fetching contacts:', error);
            return null;
        }
    }

    window.fetchProjects = fetchProjects;
    window.insertProject = insertProject;
    window.insertContact = insertContact;
    window.fetchContacts = fetchContacts;
    console.log('Supabase client initialized');
})();
