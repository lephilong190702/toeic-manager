package com.example.toeic.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.toeic.dto.DailyLearningStats;
import com.example.toeic.model.Topic;
import com.example.toeic.model.Word;

public interface WordRepository extends JpaRepository<Word, Long> {
    List<Word> findByTopic(Topic topic);

    List<Word> findByLevel(String level);

    Optional<Word> findByVocabularyIgnoreCase(String vocabulary);

    List<Word> findByTopicIdAndLearnedTrue(Long topicId);

    long countByLearnedTrue();

    long countByLearnedFalse();
    
    List<Word> findByLearnedFalse();

    @Query("SELECT w.level AS level, COUNT(w) AS count FROM Word w GROUP BY w.level")
    List<Map<String, Object>> countGroupByLevel();

    @Query("SELECT w.topic.name AS topic, COUNT(w) AS count FROM Word w GROUP BY w.topic.name")
    List<Map<String, Object>> countGroupByTopic();

    @Query(value = """
                SELECT DATE(w.learned_at) AS date, COUNT(*) FROM word w
                WHERE w.learned = true AND w.learned_at >= CURDATE() - INTERVAL 6 DAY
                GROUP BY DATE(w.learned_at)
                ORDER BY DATE(w.learned_at)
            """, nativeQuery = true)
    List<Object[]> getWeeklyStats();

    @Query(value = """
                SELECT DATE_FORMAT(w.learned_at, '%Y-%m') AS month, COUNT(*) FROM word w
                WHERE w.learned = true AND w.learned_at IS NOT NULL
                GROUP BY month
                ORDER BY month
            """, nativeQuery = true)
    List<Object[]> getMonthlyStats();

    @Query(value = """
                SELECT YEAR(w.learned_at) AS year, COUNT(*) FROM word w
                WHERE w.learned = true AND w.learned_at IS NOT NULL
                GROUP BY year
                ORDER BY year
            """, nativeQuery = true)
    List<Object[]> getYearlyStats();
}
