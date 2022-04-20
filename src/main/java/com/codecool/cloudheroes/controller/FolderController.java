package com.codecool.cloudheroes.controller;

import com.codecool.cloudheroes.model.FileModel;
import com.google.gson.Gson;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/folder")
public class FolderController {

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
    public String createNewFolder(@RequestParam String newFolderName, @RequestParam String route) {
        return "";
    }

    @PutMapping()
    public String renameFolder() {
        return "";
    }

    @DeleteMapping()
    public String deleteFolder() {
        return "";
    }

    private List<FileModel> createFileModels(File[] files) {
        if (files == null) {
            return new ArrayList<>();
        }
        return Arrays.stream(files).map(file ->  new FileModel(file.getName(), file.isDirectory())).
                collect(Collectors.toList());
    }
}
