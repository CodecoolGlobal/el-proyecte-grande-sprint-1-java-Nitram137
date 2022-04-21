
export let dataHandler = {
    getFolderContent: async function(path) {
        return await apiGet(`/api/file?path=${path}`);
    },
    createFolder: async function(folderName, path) {
        const payload = new FormData();
        payload.append('folderName', folderName);
        payload.append('path', path);
        return await apiPost('/api/file/create', payload);
    },
    renameFolder: async function (newName,oldName, path) {
        const payload = new FormData();
        payload.append('newName', newName);
        payload.append('oldName', oldName);
        payload.append('path', path);
        return await apiPut('/api/file/rename', payload);
    },
    moveFile: async function(fileName, originalPath, newPath) {
        const payload = new FormData();
        payload.append('name', fileName);
        payload.append('originalPath', originalPath);
        payload.append('path', newPath);
        return await apiPut('/api/file/move', payload);
    },
    deleteFile: async function(fileName, path) {
        return await apiDelete(`/api/file?name=${fileName}&path=${path}`)
    },
    uploadFile: async function(file, path) {
        const payload = new FormData();
        payload.append('file', file);
        payload.append('path', path);
        return await apiPost("/api/file/upload", payload);
    }
}

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (!response.ok) {
        throw Error(`${response.status} ${response.statusText}`);
    }
    return response.json();
}

async function apiPost(url, payload) {
    let response = await fetch(url, {
        method: "POST",
        body:payload
    });
    if(!response.ok) {
        throw Error(`${response.status} ${response.statusText}`);
    }
    return response.json();
}

async function apiPut(url, payload) {
    let response = await fetch(url, {
        method: "PUT",
        body: payload

    });
    if (!response.ok) {
        throw Error(`${response.status} ${response.statusText}`);
    }
    return response.json();
    }

async function apiDelete(url) {
    let response = await fetch(url, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw Error(`${response.status} ${response.statusText}`);
    }
    return response.json();
}