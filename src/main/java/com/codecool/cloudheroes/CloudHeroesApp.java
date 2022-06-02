package com.codecool.cloudheroes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.util.unit.DataSize;

import javax.servlet.MultipartConfigElement;

@SpringBootApplication
public class CloudHeroesApp {

    public static void main(String[] args) {
        SpringApplication.run(CloudHeroesApp.class, args);
    }

    @Bean
    MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setMaxFileSize(DataSize.ofBytes(10485760L));
        factory.setMaxRequestSize(DataSize.ofBytes(10485760L));
        return factory.createMultipartConfig();
    }
}
