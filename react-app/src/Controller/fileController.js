import {dataHandler} from "../DataHandler/dataHandler.js";
import data from "bootstrap/js/src/dom/data";

export default class FileController {

    currentRoute;

    constructor() {
        this.currentRoute = "/";
    }

    async getFolderContent(folderName) {
        if (folderName !== "") {
            this.currentRoute = this.currentRoute + folderName + "/";
        }
        return await dataHandler.getFolderContent(this.currentRoute);
    }

    moveBack() {
        const routes = this.currentRoute.substring(1, this.currentRoute.length - 1).split("/");
        routes.pop();
        if (routes.length === 0) {
            this.currentRoute = "/";
        } else {
            this.currentRoute = "/" + routes.join("/") + "/";
        }

    }

    createFolder(folderName) {
        dataHandler.createFolder(folderName, this.currentRoute).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    }

    renameFolder(newName, oldName) {
        dataHandler.renameFolder(newName, oldName, this.currentRoute).then((response) => {
            console.log(response);
        }).catch((error) => {
            alert(error);
        });
    }

    moveFile(fileName, originalPath, newPath) {
        dataHandler.moveFile(fileName, originalPath, newPath).then((response) => {
            console.log(response);
        }).catch((error) => {
            alert(error);
        });
    }

    deleteFile(fileName, path) {
        dataHandler.deleteFile(fileName, path).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error.message);
        });
    }

    uploadFile(file) {
        dataHandler.uploadFile(file, this.currentRoute).then((response) => {
            console.log(response);
        }).catch((error) => {
            alert(error);
        });
    }

    async downloadFile(fileName) {
        return await fetch(`/api/file/download?path=${this.currentRoute}&fileName=${fileName}`)
    }
}