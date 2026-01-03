
import { Capacitor, CapacitorHttp } from '@capacitor/core';

export interface WebDAVConfig {
    url: string;
    username: string;
    password: string;
    useProxy?: boolean;
    proxyUrl?: string;
    maxBackups?: number;
}

const getAuthHeader = (config: WebDAVConfig) => {
    const credentials = btoa(`${config.username}:${config.password}`);
    return `Basic ${credentials}`;
};

const getFetchOptions = (config: WebDAVConfig, method: string, headers: Record<string, string> = {}, body?: any) => {
    const authHeaders: Record<string, string> = {
        Authorization: getAuthHeader(config),
        ...headers,
    };

    if (config.useProxy && config.proxyUrl) {
        // When using proxy, we might need to send the target origin if requested
        authHeaders['X-Requested-With'] = 'XMLHttpRequest';
    }

    return {
        method,
        headers: authHeaders,
        body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    };
};

const getWrappedUrl = (config: WebDAVConfig, targetUrl: string) => {
    if (Capacitor.isNativePlatform()) {
        return targetUrl;
    }
    if (config.useProxy && config.proxyUrl) {
        return `${config.proxyUrl}${encodeURIComponent(targetUrl)}`;
    }
    return targetUrl;
};

const customFetch = async (url: string, options: any) => {
    if (Capacitor.isNativePlatform()) {
        const response = await CapacitorHttp.request({
            url,
            method: options.method || 'GET',
            headers: options.headers,
            data: options.body,
        });

        return {
            ok: response.status >= 200 && response.status < 300,
            status: response.status,
            statusText: response.status.toString(),
            json: async () => response.data,
            text: async () => typeof response.data === 'string' ? response.data : JSON.stringify(response.data),
        };
    }
    return fetch(url, options);
};

const ensureDirectory = async (config: WebDAVConfig) => {
    const baseUrl = config.url.replace(/\/$/, '');
    const targetUrl = `${baseUrl}/afterglow/`;
    const url = getWrappedUrl(config, targetUrl);

    const response = await customFetch(url, {
        ...getFetchOptions(config, 'MKCOL'),
    });

    if (response.status === 405) return;
    if (!response.ok) throw new Error(`Failed to create directory: ${response.status}`);
};

export const backupToWebDAV = async (config: WebDAVConfig, data: any) => {
    await ensureDirectory(config);
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:T]/g, '').split('.')[0];
    const filename = `backup_${timestamp}.json`;

    const baseUrl = config.url.replace(/\/$/, '');
    const targetUrl = `${baseUrl}/afterglow/${filename}`;
    const url = getWrappedUrl(config, targetUrl);

    const response = await customFetch(url, {
        ...getFetchOptions(config, 'PUT', { 'Content-Type': 'application/json' }, data),
    });

    if (!response.ok) throw new Error(`Backup failed: ${response.status}`);
};

export const listBackups = async (config: WebDAVConfig): Promise<string[]> => {
    const baseUrl = config.url.replace(/\/$/, '');
    const targetUrl = `${baseUrl}/afterglow/`;
    const url = getWrappedUrl(config, targetUrl);

    const response = await customFetch(url, {
        ...getFetchOptions(config, 'PROPFIND', {
            'Depth': '1',
            'Content-Type': 'application/xml'
        }),
    });

    if (!response.ok) throw new Error(`Failed to list backups: ${response.status}`);

    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    const hrefs = Array.from(xmlDoc.querySelectorAll('href, D\\:href, d\\:href'));

    return hrefs
        .map(h => h.textContent || '')
        .filter(href => href.endsWith('.json'))
        .map(href => {
            const parts = href.split('/');
            return decodeURIComponent(parts[parts.length - 1]);
        })
        .sort((a, b) => b.localeCompare(a)); // Newest first
};

export const restoreFromWebDAV = async (config: WebDAVConfig, filename: string) => {
    const baseUrl = config.url.replace(/\/$/, '');
    const targetUrl = `${baseUrl}/afterglow/${filename}`;
    const url = getWrappedUrl(config, targetUrl);

    const response = await customFetch(url, {
        ...getFetchOptions(config, 'GET'),
    });

    if (!response.ok) {
        if (response.status === 404) throw new Error('Backup file not found on server.');
        throw new Error(`Restore failed: ${response.status}`);
    }

    return response.json();
};

export const deleteBackup = async (config: WebDAVConfig, filename: string) => {
    const baseUrl = config.url.replace(/\/$/, '');
    const targetUrl = `${baseUrl}/afterglow/${filename}`;
    const url = getWrappedUrl(config, targetUrl);

    const response = await customFetch(url, {
        ...getFetchOptions(config, 'DELETE'),
    });

    if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
    }
};
