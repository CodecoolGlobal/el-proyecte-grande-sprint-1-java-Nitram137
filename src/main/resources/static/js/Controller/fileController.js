import {dataHandler} from "../DataHandler/dataHandler.js";

export let fileController = {
    currentRoute: null,
    init: function () {
        fileController.currentRoute = "/";
    },
    getFolderContent: function (folderName) {
        dataHandler.getFolderContent(fileController.currentRoute + folderName).then((response) => {
            console.log(response);
        }).catch((error) => {
            alert(error);
        });
    },
    createFolder: function (folderName, path) {
        dataHandler.createFolder(folderName, fileController.currentRoute + path).then((response) => {
            console.log(response);
        }).catch((error) => {
            alert(error);
        });
    },
    renameFolder: function (newName, oldName, path) {
        dataHandler.renameFolder(newName, oldName, fileController.currentRoute + path).then((response) => {
            console.log(response);
        }).catch((error) => {
            alert(error);
        });
    },
    uploadFile: function (file, path) {
        dataHandler.uploadFile(file, fileController.currentRoute + path).then((response) => {
            console.log(response);
        }).catch((error) => {
            alert(error);
        });
    }
}