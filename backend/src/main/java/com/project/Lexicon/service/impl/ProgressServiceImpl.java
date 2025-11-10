package com.project.Lexicon.service.impl;

import com.project.Lexicon.domain.ProgressStatus;
import com.project.Lexicon.domain.SessionStatus;
import com.project.Lexicon.domain.entity.ScheduleSession;
import com.project.Lexicon.domain.entity.User;
import com.project.Lexicon.domain.entity.UserBadge;
import com.project.Lexicon.repository.LessonRepository;
import com.project.Lexicon.repository.ProgressRepository;
import com.project.Lexicon.repository.ScheduleWeekRepository;
import com.project.Lexicon.repository.UserBadgeRepository;
import com.project.Lexicon.service.ProgressService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class ProgressServiceImpl implements ProgressService {

    private final ProgressRepository progressRepository;
    private final ScheduleWeekRepository scheduleWeekRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final LessonRepository lessonRepository;

    @Autowired
    public ProgressServiceImpl(
            ProgressRepository progressRepository,
            ScheduleWeekRepository scheduleWeekRepository,
            UserBadgeRepository userBadgeRepository,
            LessonRepository lessonRepository) {
        this.progressRepository = progressRepository;
        this.scheduleWeekRepository = scheduleWeekRepository;
        this.userBadgeRepository = userBadgeRepository;
        this.lessonRepository = lessonRepository;
    }

    @Override
    public Map<String, Object> getUserProgressSummary(User user) {
        log.debug("Getting progress summary for user: {}", user.getEmail());

        Map<String, Object> summary = new HashMap<>();

        // Get completed lessons count
        long completedCount = progressRepository.countByUserAndStatus(user, ProgressStatus.COMPLETED);
        
        // Get in-progress lessons count
        long inProgressCount = progressRepository.countByUserAndStatus(user, ProgressStatus.IN_PROGRESS);

        // Get total study time (sum of actualMinutes from DONE sessions)
        Integer totalMinutes = scheduleWeekRepository.sumActualMinutesByUserAndStatus(
                user, SessionStatus.DONE);
        int totalTime = (totalMinutes != null) ? totalMinutes : 0;

        // Calculate streak
        int streak = calculateStreak(user);

        // Calculate total points (10 points per completed lesson)
        int points = (int) (completedCount * 10);

        // Calculate level (level up every 100 points)
        int level = (points / 100) + 1;

        // Get badges
        List<UserBadge> userBadges = userBadgeRepository.findByUserWithBadges(user);
        List<Map<String, Object>> badges = userBadges.stream()
                .map(this::mapUserBadgeToDto)
                .collect(Collectors.toList());

        // Get total lessons available in the system
        long totalLessons = lessonRepository.count();

        // Match frontend expectations (UserProgressSummaryDTO)
        summary.put("lessonsCompleted", completedCount);
        summary.put("totalLessons", totalLessons);
        summary.put("streakDays", streak);
        summary.put("totalPoints", points);
        summary.put("level", level);
        summary.put("badges", badges);
        
        // Additional fields for compatibility
        summary.put("completedLessons", completedCount);  // Alternate field name
        summary.put("inProgressLessons", inProgressCount);
        summary.put("totalTime", totalTime); // in minutes
        summary.put("streak", streak);       // Alternate field name
        summary.put("points", points);       // Alternate field name

        log.debug("Progress summary: completed={}, inProgress={}, time={}, streak={}, points={}, level={}",
                completedCount, inProgressCount, totalTime, streak, points, level);

        return summary;
    }

    @Override
    public List<Map<String, Object>> getWeeklyActivity(User user) {
        log.debug("Getting weekly activity for user: {}", user.getEmail());

        // Get the last 7 days
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6); // 7 days total including today

        // Get all completed sessions in this period
        List<ScheduleSession> sessions = scheduleWeekRepository.findSessionsByUserAndStatusAndDateBetween(
                user, SessionStatus.DONE, startDate, endDate);

        // Group by date and calculate lessons and points per day
        Map<LocalDate, List<ScheduleSession>> sessionsByDate = sessions.stream()
                .collect(Collectors.groupingBy(ScheduleSession::getDate));

        // Build activity data for each day
        List<Map<String, Object>> activityData = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate date = startDate.plusDays(i);
            List<ScheduleSession> daySessions = sessionsByDate.getOrDefault(date, Collections.emptyList());

            Map<String, Object> dayActivity = new HashMap<>();
            dayActivity.put("day", date.getDayOfWeek().toString().substring(0, 3)); // Mon, Tue, etc.
            dayActivity.put("date", date.toString()); // yyyy-MM-dd
            dayActivity.put("lessons", daySessions.size());
            dayActivity.put("points", daySessions.size() * 10); // 10 points per lesson
            dayActivity.put("minutes", daySessions.stream()
                    .mapToInt(s -> s.getActualMinutes() != null ? s.getActualMinutes() : 0)
                    .sum());

            activityData.add(dayActivity);
        }

        return activityData;
    }

    @Override
    public Map<String, Object> getTimeStats(User user) {
        log.debug("Getting time stats for user: {}", user.getEmail());

        Map<String, Object> stats = new HashMap<>();

        // Total time (all time)
        Integer totalMinutes = scheduleWeekRepository.sumActualMinutesByUserAndStatus(
                user, SessionStatus.DONE);
        int totalTime = (totalMinutes != null) ? totalMinutes : 0;

        // This week's time
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        Integer weekMinutes = scheduleWeekRepository.sumActualMinutesByUserAndStatusAfterDate(
                user, SessionStatus.DONE, startOfWeek);
        int thisWeek = (weekMinutes != null) ? weekMinutes : 0;

        // This month's time
        LocalDate startOfMonth = today.withDayOfMonth(1);
        Integer monthMinutes = scheduleWeekRepository.sumActualMinutesByUserAndStatusAfterDate(
                user, SessionStatus.DONE, startOfMonth);
        int thisMonth = (monthMinutes != null) ? monthMinutes : 0;

        // Average daily time (last 30 days)
        LocalDate thirtyDaysAgo = today.minusDays(29); // 30 days including today
        Integer last30DaysMinutes = scheduleWeekRepository.sumActualMinutesByUserAndStatusAfterDate(
                user, SessionStatus.DONE, thirtyDaysAgo);
        int last30Days = (last30DaysMinutes != null) ? last30DaysMinutes : 0;
        int avgDaily = last30Days / 30;

        stats.put("totalTime", totalTime);
        stats.put("thisWeek", thisWeek);
        stats.put("thisMonth", thisMonth);
        stats.put("avgDaily", avgDaily);

        return stats;
    }

    /**
     * Calculate the current streak of consecutive days with completed sessions
     */
    private int calculateStreak(User user) {
        // Get all completed sessions ordered by date desc
        List<ScheduleSession> completedSessions = scheduleWeekRepository
                .findCompletedSessionsByUserOrderByDateDesc(user);

        if (completedSessions.isEmpty()) {
            return 0;
        }

        // Get unique dates (in case multiple sessions per day)
        Set<LocalDate> uniqueDates = completedSessions.stream()
                .map(ScheduleSession::getDate)
                .collect(Collectors.toCollection(TreeSet::new));

        List<LocalDate> sortedDates = new ArrayList<>(uniqueDates);
        sortedDates.sort(Collections.reverseOrder()); // Most recent first

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        // Check if streak is active (must have activity today or yesterday)
        LocalDate mostRecentDate = sortedDates.get(0);
        if (!mostRecentDate.equals(today) && !mostRecentDate.equals(yesterday)) {
            return 0; // Streak broken
        }

        // Count consecutive days
        int streak = 1;
        LocalDate expectedDate = sortedDates.get(0).minusDays(1);

        for (int i = 1; i < sortedDates.size(); i++) {
            LocalDate currentDate = sortedDates.get(i);
            
            if (currentDate.equals(expectedDate)) {
                streak++;
                expectedDate = currentDate.minusDays(1);
            } else {
                break; // Gap found, streak ends
            }
        }

        return streak;
    }

    private Map<String, Object> mapUserBadgeToDto(UserBadge userBadge) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", userBadge.getBadge().getId());
        dto.put("name", userBadge.getBadge().getName());
        dto.put("description", userBadge.getBadge().getDescription());
        dto.put("icon", userBadge.getBadge().getIcon());
        dto.put("earnedAt", userBadge.getAwardedAt()); // Map awardedAt to earnedAt for frontend
        return dto;
    }
}
