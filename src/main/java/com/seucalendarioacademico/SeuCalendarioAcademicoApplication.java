package com.seucalendarioacademico;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SeuCalendarioAcademicoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SeuCalendarioAcademicoApplication.class, args);
		System.out.println("===========================================");
		System.out.println("Swagger iniciado com sucesso!");
		System.out.println("Acesse: http://localhost:8080/swagger-ui.html");
		System.out.println("===========================================");
	}

}
