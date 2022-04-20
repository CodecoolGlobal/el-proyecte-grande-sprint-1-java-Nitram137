package com.codecool.cloudheroes.message;

import com.codecool.cloudheroes.model.FileModel;

import java.util.List;

public class ResponseMessage {

    private String message;
    private List<FileModel> fileModels;

    public ResponseMessage(String message, List<FileModel> fileModels) {
        this.message = message;
        this.fileModels = fileModels;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<FileModel> getFileModels() {
        return fileModels;
    }

    public void setFileModels(List<FileModel> fileModels) {
        this.fileModels = fileModels;
    }
}
