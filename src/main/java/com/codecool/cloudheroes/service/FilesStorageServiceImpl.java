package com.codecool.cloudheroes.service;

import com.codecool.cloudheroes.model.FileModel;
import org.apache.tomcat.util.http.fileupload.InvalidFileNameException;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class FilesStorageServiceImpl implements FilesStorageService{

    private static final Path USER_DIRECTORY = Path.of(System.getProperty("user.dir") + "/doc-uploads");

    @Override
    public List<FileModel> getFolderContent(String path) throws FileNotFoundException {
        File folder = new File(USER_DIRECTORY + path);
        if (!folder.exists()) {
            throw new FileNotFoundException("Path doesn't exists");
        }
        File[] files = folder.listFiles();
        if (files == null) {
            return new ArrayList<>();
        }
        return Arrays.stream(files).map(file ->  new FileModel(file.getName(), file.isDirectory())).
                collect(Collectors.toList());
    }

    @Override
    public void createNewFolder(String folderName, String path) throws FileNotFoundException, FileAlreadyExistsException {
        File folder = new File(USER_DIRECTORY + path);
        if (!folder.exists()) {
            throw new FileNotFoundException("Path doesn't exists");
        }
        if (folderName.contains(".")) {
            throw new InvalidFileNameException(folderName, "FolderName is invalid!");
        }
        boolean createFolder = new File(folder + folderName).mkdir();
        if (!createFolder) {
            throw new FileAlreadyExistsException("Folder is already exists!");
        }
    }


    @Override
    public void save(MultipartFile file) {

    }

    @Override
    public Resource load(String filename) {
        return null;
    }

}
