import {dataHandler} from "../DataHandler/dataHandler.js";

export let fileController = {
    currentRoute: null,
    init: function () {
        fileController.currentRoute = "/";
    },
    getFolderContent: function (folderName) {
        dataHandler.getFolderContent(fileController.currentRoute + folderName + "/").then((response) => {
            fileController.currentRoute = fileController.currentRoute + folderName + "/";
            console.log(response);
        }).catch((error) => {
            alert(error);
        });
    },
    moveBack: function () {
        const routes = fileController.currentRoute.substring(1, fileController.currentRoute.length - 1).split("/");
        routes.pop();
        if (routes.length === 0) {
            fileController.currentRoute = "/";
        } else {
            fileController.currentRoute = "/" + routes.join("/") + "/";
        }
        dataHandler.getFolderContent(fileController.currentRoute).then((response) => {
            console.log(response);
        })
    },
    createFolder: function (folderName) {
        dataHandler.createFolder(folderName, fileController.currentRoute).then((response) => {
            console.log(response);
        }).catch((error) => {
            alert(error);
        });
    },
    renameFolder: function (newName, oldName) {
        dataHandler.renameFolder(newName, oldName, fileController.currentRoute).then((response) => {
            console.log(response);
        }).catch((error) => {
            alert(error);
        });
    },
    moveFile: function (fileName, originalPath, newPath) {
        dataHandler.moveFile(fileName, originalPath, newPath).then((response) => {
            console.log(response);
        }).catch((error) => {
            alert(error);
        });
    },
    deleteFile: function(fileName, path) {
        dataHandler.deleteFile(fileName, path).then((response) => {
            console.log(response);
        }).catch((error) => {
            alert(error);
        });
    },
    uploadFile: function (file) {
        dataHandler.uploadFile(file, fileController.currentRoute).then((response) => {
            console.log(response);
        }).catch((error) => {
            alert(error);
        });
    }
}