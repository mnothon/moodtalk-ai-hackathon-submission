package ch.planner.plannersvc.tools;

import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Component
public class CalculatorTool {
    @Tool("Get the start and end date of the current week (Monday to Sunday)")
    public List<LocalDate> getStartAndEndDateOfCurrentWeek(
            @P("Current date (format YYYY-MM-DD)") LocalDate currentDate
    ){
        if (currentDate == null) {
            throw new IllegalArgumentException("Current date must not be null");
        }

        LocalDate startOfWeek = currentDate.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = currentDate.with(DayOfWeek.SUNDAY);

        return List.of(startOfWeek, endOfWeek);
    }

    @Tool("Check whether a given date falls in the weekend (Saturday or Sunday)")
    public Boolean isDayAWeekend(
            @P("Date to check (format YYYY-MM-DD)") LocalDate date
    ) {
        if (date == null) {
            throw new IllegalArgumentException("Date must not be null");
        }
        DayOfWeek dow = date.getDayOfWeek();
        return dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY;
    }

    @Tool("Calculate working days between two dates (Mon–Fri)")
    public int calculateWorkingDaysBetweenDates(
            @P("Start date (inclusive, format YYYY-MM-DD)") LocalDate startDate,
            @P("End date (inclusive, format YYYY-MM-DD)")   LocalDate endDate
    ) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date must not be null");
        }
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date must be on or after start date");
        }

        int businessDays = 0;
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            DayOfWeek dow = date.getDayOfWeek();
            if (dow != DayOfWeek.SATURDAY && dow != DayOfWeek.SUNDAY) {
                businessDays++;
            }
        }
        return businessDays;
    }

    @Tool("Calculate working hours between two dates (Monday–Friday at 8h/day)")
    public int calculateWorkingHoursBetweenDates(
            @P("Start date (inclusive, format YYYY-MM-DD)") LocalDate startDate,
            @P("End date (inclusive, format YYYY-MM-DD)")   LocalDate endDate
    ) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date must not be null");
        }
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date must be on or after start date");
        }

        int businessDays = 0;
        for (LocalDate d = startDate; !d.isAfter(endDate); d = d.plusDays(1)) {
            DayOfWeek dow = d.getDayOfWeek();
            if (dow != DayOfWeek.SATURDAY && dow != DayOfWeek.SUNDAY) {
                businessDays++;
            }
        }
        return businessDays * 8;
    }

    @Tool("Calculate working hours based on the number of working days (8h/day)")
    public int calculateWorkingHoursByNumberOfDays(
            @P("Number of working days") int numberOfDays
    ) {
        if (numberOfDays < 0) {
            throw new IllegalArgumentException("Number of days must be non-negative");
        }
        return numberOfDays * 8;
    }
}
