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
import com.example.toeic.model.User;
import com.example.toeic.model.Word;

public interface WordRepository extends JpaRepository<Word, Long> {
    List<Word> findByTopic(Topic topic);

    List<Word> findByLevel(String level);

    Optional<Word> findByVocabularyIgnoreCase(String vocabulary);

    List<Word> findByTopicIdAndLearnedTrue(Long topicId);

    long countByUserAndLearnedTrue(User user);

    long countByUserAndLearnedFalse(User user);

    List<Word> findByLearnedFalse();

    @Query("SELECT w.level AS level, COUNT(w) AS count FROM Word w WHERE w.user = :user GROUP BY w.level")
    List<Object[]> countGroupByLevel(User user);

    @Query("SELECT w.topic.name AS topic, COUNT(w) AS count FROM Word w WHERE w.user = :user GROUP BY w.topic.name")
    List<Object[]> countGroupByTopic(User user);

    @Query(value = """
                SELECT DATE(learned_at) AS learnedDate, COUNT(*)
                FROM word
                WHERE user_id = :userId AND learned = true AND learned_at IS NOT NULL
                    AND learned_at >= CURDATE() - INTERVAL 6 DAY
                GROUP BY DATE(learned_at)
                ORDER BY learnedDate
            """, nativeQuery = true)
    List<Object[]> getWeeklyStats(Long userId);

    @Query(value = """
                SELECT DATE_FORMAT(learned_at, '%Y-%m') AS month, COUNT(*)
                FROM word
                WHERE user_id = :userId AND learned = true AND learned_at IS NOT NULL
                GROUP BY month
                ORDER BY month
            """, nativeQuery = true)
    List<Object[]> getMonthlyStats(Long userId);

    @Query(value = """
                SELECT YEAR(learned_at) AS year, COUNT(*)
                FROM word
                WHERE user_id = :userId AND learned = true AND learned_at IS NOT NULL
                GROUP BY year
                ORDER BY year
            """, nativeQuery = true)
    List<Object[]> getYearlyStats(Long userId);

    List<Word> findByUser(User user);

    Optional<Word> findByVocabularyIgnoreCaseAndUser(String vocabulary, User user);

    List<Word> findByLearnedFalseAndUser(User user);

    List<Word> findByLearnedTrueAndUser(User user);

    List<Word> findByLearnedTrueAndUserAndTopic_NameIgnoreCase(User user, String topicName);
}
