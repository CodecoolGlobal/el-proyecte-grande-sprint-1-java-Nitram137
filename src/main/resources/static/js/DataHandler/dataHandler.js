
export let dataHandler = {
    getFolderContent: async function(path) {
        return await apiGet(`/api/file?path=${path}`);
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
        headers: {"content-type":"application/json"},
        body:JSON.stringify(payload)

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