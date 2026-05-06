package com.unisystem.academic_core_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableCaching
@EnableFeignClients
public class AcademicCoreServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AcademicCoreServiceApplication.class, args);
	}

}
