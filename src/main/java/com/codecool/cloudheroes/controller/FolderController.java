package com.codecool.cloudheroes.controller;

import com.codecool.cloudheroes.model.FileModel;

import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.*;


@RestController
@RequestMapping("/api/folder")
public class FolderController {

    private static final Path USER_DIRECTORY = Path.of(System.getProperty("user.dir") + "/doc-uploads");

    @GetMapping
    public String getFolderContent(@RequestParam String path) throws IOException {
        return "";
    }

    @PostMapping("/create")
    public String createNewFolder(@RequestParam String newFolderName, @RequestParam String route) throws IOException {
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
        return new ArrayList<>();
    }
}
