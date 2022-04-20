package com.codecool.cloudheroes.service;

import com.codecool.cloudheroes.model.FileModel;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.nio.file.FileAlreadyExistsException;
import java.util.List;

public interface FilesStorageService {

    public List<FileModel> getFolderContent(String path) throws FileNotFoundException;
    public void createNewFolder(String folderName, String path) throws FileNotFoundException, FileAlreadyExistsException;
    void renameFolder(String newName, String oldName, String path) throws FileNotFoundException, FileAlreadyExistsException;
    void moveFile(String name, String originalPath, String newPath) throws FileNotFoundException, FileAlreadyExistsException;
    void deleteFile(String name, String path) throws FileNotFoundException;
    public void save(MultipartFile file, String path);
    public Resource load(String filename, String path);
}
