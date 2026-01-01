
export interface WebDAVConfig {
    url: string;
    username: string;
    password: string;
}

const getAuthHeader = (config: WebDAVConfig) => {
    const credentials = btoa(`${config.username}:${config.password}`);
    return `Basic ${credentials}`;
};

const ensureDirectory = async (config: WebDAVConfig) => {
    const url = `${config.url.replace(/\/$/, '')}/tracker/`;
    const response = await fetch(url, {
        method: 'MKCOL',
        headers: {
            Authorization: getAuthHeader(config),
        },
    });

    if (response.status === 405) {
        // Directory probably already exists
        return;
    }

    if (!response.ok) {
        throw new Error(`Failed to create directory: ${response.statusText}`);
    }
};

export const backupToWebDAV = async (config: WebDAVConfig, data: any) => {
    await ensureDirectory(config);
    const url = `${config.url.replace(/\/$/, '')}/tracker/backup.json`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            Authorization: getAuthHeader(config),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Backup failed: ${response.statusText}`);
    }
};

export const restoreFromWebDAV = async (config: WebDAVConfig) => {
    const url = `${config.url.replace(/\/$/, '')}/tracker/backup.json`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: getAuthHeader(config),
        },
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Backup file not found on server.');
        }
        throw new Error(`Restore failed: ${response.statusText}`);
    }

    return response.json();
};
