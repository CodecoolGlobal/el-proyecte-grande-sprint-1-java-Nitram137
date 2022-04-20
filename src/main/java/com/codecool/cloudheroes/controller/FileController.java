package com.codecool.cloudheroes.controller;

import com.codecool.cloudheroes.message.ResponseMessage;
import com.codecool.cloudheroes.model.FileModel;
import com.codecool.cloudheroes.service.FilesStorageService;
import com.google.gson.Gson;
import org.apache.tomcat.util.http.fileupload.InvalidFileNameException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.File;
import java.io.FileNotFoundException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/file")
public class FileController {

    private static final Path USER_DIRECTORY = Path.of(System.getProperty("user.dir") + "/doc-uploads");

    FilesStorageService storageService;

    @Autowired
    public FileController(FilesStorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping
    public ResponseEntity<ResponseMessage> getFolderContent(@RequestParam String path) {
        try {
            List<FileModel> fileModels = storageService.getFolderContent(path);
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("OK", fileModels));
        } catch(FileNotFoundException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseMessage(
                    e.getMessage(), null));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<ResponseMessage> createNewFolder(@RequestParam String folderName, @RequestParam String path) {
        try {
            storageService.createNewFolder(folderName, path);
            List<FileModel> fileModels = storageService.getFolderContent(path);
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("OK", fileModels));
        } catch (FileNotFoundException | FileAlreadyExistsException | InvalidFileNameException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseMessage(e.getMessage(), null));
        }
    }

    @PutMapping("/rename")
    public ResponseEntity<ResponseMessage> renameFolder(@RequestParam String newName,
                                                        @RequestParam String oldName, @RequestParam String path) {
        try {
            storageService.renameFolder(newName, oldName, path);
            List<FileModel> fileModels = storageService.getFolderContent(path);
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("OK", fileModels));
        } catch (FileNotFoundException | FileAlreadyExistsException | InvalidFileNameException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseMessage(e.getMessage(), null));
        }
    }

    @PutMapping("/move")
    public ResponseEntity<ResponseMessage> moveFile(@RequestParam String name,
                                                      @RequestParam String originalPath, @RequestParam String newPath) {
        try {
            storageService.moveFile(name, originalPath, newPath);
            List<FileModel> fileModels = storageService.getFolderContent(newPath);
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("OK", fileModels));
        } catch (FileNotFoundException | FileAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseMessage(e.getMessage(), null));
        }
    }

    @DeleteMapping()
    public String deleteFolder(@RequestParam String folderName, @RequestParam String path) {
        Map<String, String> response = new HashMap<>();
        boolean delete = new File(USER_DIRECTORY + path + folderName).delete();
        File[] files = new File(USER_DIRECTORY + path).listFiles();
        List<FileModel> fileModels = createFileModels(files);
        Gson gson = new Gson();
        response.put("content", gson.toJson(fileModels));
        response.put("parentDirectory", path);
        response.put("isDeleted", String.valueOf(delete));
        return gson.toJson(response);
    }

    private List<FileModel> createFileModels(File[] files) {
        if (files == null) {
            return new ArrayList<>();
        }
        return Arrays.stream(files).map(file ->  new FileModel(file.getName(), file.isDirectory())).
                collect(Collectors.toList());
    }
}
