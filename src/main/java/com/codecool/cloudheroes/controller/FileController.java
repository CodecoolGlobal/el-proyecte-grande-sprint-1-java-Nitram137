package com.codecool.cloudheroes.controller;

import com.codecool.cloudheroes.model.FileModel;
import com.google.gson.Gson;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/file")
public class FileController {

    private static final Path USER_DIRECTORY = Path.of(System.getProperty("user.dir") + "/doc-uploads");

    @GetMapping
    public String getFolderContent(@RequestParam String path) {
        Map<String, String> response = new HashMap<>();
        File[] files = new File(USER_DIRECTORY + path).listFiles();
        List<FileModel> fileModels = createFileModels(files);
        Gson gson = new Gson();
        response.put("content", gson.toJson(fileModels));
        response.put("parentDirectory", path);
        return gson.toJson(response);
    }

    @PostMapping("/create")
    public String createNewFolder(@RequestParam String newFolderName, @RequestParam String path) {
        Map<String, String> response = new HashMap<>();
        boolean newDirectory = new File(USER_DIRECTORY + path + newFolderName).mkdir();
        File[] files = new File(USER_DIRECTORY + path).listFiles();
        List<FileModel> fileModels = createFileModels(files);
        Gson gson = new Gson();
        response.put("content", gson.toJson(fileModels));
        response.put("parentDirectory", path);
        response.put("isCreated", String.valueOf(newDirectory));
        return gson.toJson(response);
    }

    @PutMapping("/rename")
    public String renameFolder(@RequestParam String newName, @RequestParam String oldName, @RequestParam String path) {
        Map<String, String> response = new HashMap<>();
        boolean file = new File(USER_DIRECTORY + path + oldName)
                .renameTo(new File(USER_DIRECTORY + path + newName));
        File[] files = new File(USER_DIRECTORY + path).listFiles();
        List<FileModel> fileModels = createFileModels(files);
        Gson gson = new Gson();
        response.put("content", gson.toJson(fileModels));
        response.put("parentDirectory", path);
        response.put("isRenamed", String.valueOf(file));
        return gson.toJson(response);
    }

    @PutMapping("/move")
    public String moveFolder(@RequestParam String folderName, @RequestParam String originalPath, @RequestParam String newPath) {
        Map<String, String> response = new HashMap<>();
        File folder = new File(USER_DIRECTORY + originalPath + folderName);
        boolean moved = folder.renameTo(new File(USER_DIRECTORY + newPath + folderName));
        File[] files = new File(USER_DIRECTORY + newPath).listFiles();
        List<FileModel> fileModels = createFileModels(files);
        Gson gson = new Gson();
        response.put("content", gson.toJson(fileModels));
        response.put("parentDirectory", newPath);
        response.put("isMoved", String.valueOf((moved)));
        return gson.toJson(response);
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
