package com.had.his.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.aspectj.lang.annotation.Before;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Objects;

@Entity
@Table(name="nurse_schedule", uniqueConstraints = {@UniqueConstraint(columnNames = {"day", "start_time", "end_time", "nid"})})
public class NurseSchedule {

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
    private LocalTime start_time;


    @NotNull(message = "End time must be provided")
    @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
    @Column(name = "end_time",nullable = false)
    private LocalTime end_time;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nid",referencedColumnName = "nurse_id",nullable = false)
    private Nurse nurse;


    public NurseSchedule() {
    }

    public NurseSchedule(Integer scheduleId, DayOfWeek day, LocalTime start_time, LocalTime end_time, Nurse nurse) {
        this.scheduleId = scheduleId;
        this.day = day;
        this.start_time = start_time;
        this.end_time = end_time;
        this.nurse = nurse;
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

    public LocalTime getStart_time() {
        return start_time;
    }

    public void setStart_time(LocalTime start_time) {
        this.start_time = start_time;
    }

    public LocalTime getEnd_time() {
        return end_time;
    }



    public void setEnd_time(LocalTime end_time) {
        this.end_time = end_time;
    }

    public Nurse getNurse() {
        return nurse;
    }

    public void setNurse(Nurse nurse) {
        this.nurse = nurse;
    }

    @Override
    public String toString() {
        return "NurseSchedule{" +
                "scheduleId=" + scheduleId +
                ", day=" + day +
                ", start_time=" + start_time +
                ", end_time=" + end_time +
                ", nurse=" + nurse +
                '}';
    }
}