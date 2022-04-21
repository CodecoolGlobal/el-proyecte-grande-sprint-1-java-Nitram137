
export let dataHandler = {
    getFolderContent: async function(path) {
        return await apiGet(`/api/file?path=${path}`);
    },
    createFolder: async function(folderName, path) {
        const payload = new FormData();
        payload.append('folderName', folderName);
        payload.append('path', path);
        return await apiPost('/api/file/create', payload);
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
        headers: {"content-type": "application/json"},
        body: JSON.stringify(payload)

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