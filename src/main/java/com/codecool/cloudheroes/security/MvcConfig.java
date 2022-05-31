package com.codecool.cloudheroes.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@EnableWebMvc
@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/static/**")
                .addResourceLocations("/");
        registry.addResourceHandler("/*.js")
                .addResourceLocations("/src/");
        registry.addResourceHandler("/*.json")
                .addResourceLocations("/");
        registry.addResourceHandler("/*.ico")
                .addResourceLocations("/public/");
        registry.addResourceHandler("/login.html")
                .addResourceLocations("/public/login.html");
    }
}
