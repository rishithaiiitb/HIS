package com.had.his.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(name="receptionist_schedule",uniqueConstraints = {@UniqueConstraint(columnNames = {"day", "start_time", "end_time", "receptionist_id"})})
public class ReceptionistSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Integer scheduleId;

    @NotNull(message = "Please mention the day")
    @Enumerated(EnumType.STRING)
    @Column(name = "day",nullable = false)
    private DayOfWeek day;

    @NotNull(message = "Start time must be provided")
    @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
    @Column(name = "start_time",nullable = false)
    private LocalTime startTime;

    @NotNull(message = "End time must be provided")
    @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
    @Column(name = "end_time",nullable = false)
    private LocalTime endTime;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receptionist_id",referencedColumnName = "receptionist_id",nullable = false)
    private Receptionist receptionist;

    public ReceptionistSchedule() {
    }

    public ReceptionistSchedule(Integer scheduleId, DayOfWeek day, LocalTime startTime, LocalTime endTime, Receptionist receptionist) { // Updated constructor parameter names
        this.scheduleId = scheduleId;
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
        this.receptionist = receptionist;
    }

    public Integer getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Integer scheduleId) {
        this.scheduleId = scheduleId;
    }

    public DayOfWeek getDay() {
        return day;
    }

    public void setDay(DayOfWeek day) {
        this.day = day;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Receptionist getReceptionist() {
        return receptionist;
    }

    public void setReceptionist(Receptionist receptionist) {
        this.receptionist = receptionist;
    }

    @Override
    public String toString() {
        return "ReceptionistSchedule{" +
                "scheduleId=" + scheduleId +
                ", day=" + day +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", receptionist=" + receptionist +
                '}';
    }
}

