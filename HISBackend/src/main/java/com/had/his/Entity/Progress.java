package com.had.his.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.sql.Time;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name="progress")
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="progress_id")
    private int Id;

    @Column(nullable = false)
    private LocalDate date;


    @Column(nullable = false)
    private Time time;

    @NotNull(message = "Progress Status must be provided")
    @Column(nullable = false)
    private String status;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "pid",referencedColumnName = "patient_id" ,nullable = false)
    private Patient patient;

    public Progress() {

    }

    public Progress(int id, LocalDate date, Time time, String status, Patient patient) {
        Id = id;
        this.date = date;
        this.time = time;
        this.status = status;
        this.patient = patient;
    }

    public int getId() {
        return Id;
    }

    public void setId(int id) {
        Id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Time getTime() {
        return time;
    }

    public void setTime(Time time) {
        this.time = time;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    @Override
    public String toString() {
        return "Progress{" +
                "Id=" + Id +
                ", date=" + date +
                ", time=" + time +
                ", status='" + status + '\'' +
                ", patient=" + patient +
                '}';
    }

}

