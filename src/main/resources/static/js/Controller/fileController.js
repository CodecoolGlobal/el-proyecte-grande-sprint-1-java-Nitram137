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
    }
}