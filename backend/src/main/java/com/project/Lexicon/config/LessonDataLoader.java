package com.project.Lexicon.config;

import com.project.Lexicon.domain.Level;
import com.project.Lexicon.domain.Type;
import com.project.Lexicon.domain.entity.Lesson;
import com.project.Lexicon.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class LessonDataLoader implements CommandLineRunner {

    private final LessonRepository lessonRepository;

    @Override
    public void run(String... args) {
        // Only seed if database is empty
        if (lessonRepository.count() > 0) {
            log.info("Lessons already exist in database, skipping seed");
            return;
        }

        log.info("Seeding initial lessons into database...");

        List<Lesson> lessons = Arrays.asList(
            Lesson.builder()
                .title("Introduction to Machine Learning")
                .description("Learn the fundamentals of ML algorithms and their applications in real-world scenarios.")
                .type(Type.VIDEO)
                .level(Level.BEGINNER)
                .category("Data Science")
                .videoUrl("https://www.youtube.com/embed/ukzFI9rgwfU")
                .duration(15)
                .thumbnail("🤖")
                .tags(Arrays.asList("AI", "Algorithms", "Python"))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Lesson.builder()
                .title("Advanced React Patterns")
                .description("Master compound components, render props, and custom hooks for scalable applications.")
                .type(Type.Lab)
                .level(Level.ADVANCED)
                .category("Web Development")
                .duration(30)
                .thumbnail("⚛️")
                .tags(Arrays.asList("React", "JavaScript", "Frontend"))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Lesson.builder()
                .title("UX Design Principles")
                .description("Understanding user psychology and creating intuitive, accessible interfaces.")
                .type(Type.ARTICLE)
                .level(Level.INTERMEDIATE)
                .category("Design")
                .duration(20)
                .thumbnail("🎨")
                .tags(Arrays.asList("UX", "UI", "Design Thinking"))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Lesson.builder()
                .title("SQL Database Optimization")
                .description("Techniques for query optimization, indexing strategies, and performance tuning.")
                .type(Type.Lab)
                .level(Level.INTERMEDIATE)
                .category("Database")
                .duration(25)
                .thumbnail("💾")
                .tags(Arrays.asList("SQL", "Performance", "Database"))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Lesson.builder()
                .title("Python for Data Analysis")
                .description("Work with pandas, numpy, and matplotlib to analyze and visualize data.")
                .type(Type.VIDEO)
                .level(Level.BEGINNER)
                .category("Data Science")
                .videoUrl("https://www.youtube.com/embed/GPVsHOlRBBI")
                .duration(35)
                .thumbnail("🐍")
                .tags(Arrays.asList("Python", "Data", "Analytics"))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Lesson.builder()
                .title("Cloud Architecture Patterns")
                .description("Design scalable, resilient cloud infrastructure using AWS and microservices.")
                .type(Type.ARTICLE)
                .level(Level.ADVANCED)
                .category("Cloud Computing")
                .duration(45)
                .thumbnail("☁️")
                .tags(Arrays.asList("AWS", "Architecture", "DevOps"))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build()
        );

        lessonRepository.saveAll(lessons);
        log.info("✅ Successfully seeded {} lessons into database", lessons.size());
    }
}
