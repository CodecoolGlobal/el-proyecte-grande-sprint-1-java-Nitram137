package com.codecool.cloudheroes.controller;

import com.codecool.cloudheroes.message.ResponseMessage;
import com.codecool.cloudheroes.model.FileModel;
import com.codecool.cloudheroes.service.FilesStorageService;
import org.apache.tomcat.util.http.fileupload.InvalidFileNameException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.FileNotFoundException;
import java.nio.file.FileAlreadyExistsException;
import java.util.*;


@RestController
@RequestMapping("/api/file")
public class FileController {

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
    public ResponseEntity<ResponseMessage> deleteFile(@RequestParam String name, @RequestParam String path) {
        try {
            storageService.deleteFile(name, path);
            List<FileModel> fileModels = storageService.getFolderContent(path);
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("OK", fileModels));
        } catch (FileNotFoundException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseMessage(e.getMessage(), null));
        }
    }
}
