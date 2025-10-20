package com.project.Lexicon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
public class LexiconApplication {
	public static void main(String[] args) {
		SpringApplication.run(LexiconApplication.class, args);
	}
}
