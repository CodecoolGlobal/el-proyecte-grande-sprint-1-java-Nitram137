import {dataHandler} from "../DataHandler/dataHandler.js";

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
        dataHandler.getFolderContent(this.currentRoute).then((response) => {
            console.log(response);
        })
    }

    createFolder(folderName) {
        dataHandler.createFolder(folderName, this.currentRoute).then((response) => {
            console.log(response);
        }).catch((error) => {
            alert(error);
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
            alert(error);
        });
    }

    uploadFile(file) {
        dataHandler.uploadFile(file, this.currentRoute).then((response) => {
            console.log(response);
        }).catch((error) => {
            alert(error);
        });
    }
}