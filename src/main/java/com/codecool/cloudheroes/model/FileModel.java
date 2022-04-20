package com.codecool.cloudheroes.model;

public class FileModel {

    private final String name;
    private final boolean isDirectory;

    public FileModel(String name, boolean isDirectory) {
        this.name = name;
        this.isDirectory = isDirectory;
    }
}
