package com.codecool.cloudheroes.controller;

import com.codecool.cloudheroes.message.ResponseMessage;
import com.codecool.cloudheroes.model.FileModel;
import com.codecool.cloudheroes.service.FilesStorageService;
import org.apache.tomcat.util.http.fileupload.InvalidFileNameException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping("/upload")
    public ResponseEntity<ResponseMessage> uploadFile(@RequestParam("file") MultipartFile file,
                                                      @RequestParam String path) {
        try {
            storageService.save(file, path);
            List<FileModel> fileModels = storageService.getFolderContent(path);
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("OK", fileModels));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(
                    new ResponseMessage(e.getMessage(), null));
        }
    }

    @GetMapping("/download")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@RequestParam String fileName, @RequestParam String path) {
        Resource file = storageService.load(fileName, path);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }
}
