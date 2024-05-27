package com.had.his.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name="vitals")
public class Vitals {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="vital_id")
    private Long vitalid;

    @NotNull(message = "Enter temperature")
    @DecimalMin(value = "90", message = "Temperature must be at least 90")
    @DecimalMax(value = "105", message = "Temperature must not exceed 105")
    @Column(name="temperature",nullable = false)
    private Float temperature;

    @NotNull(message = "Enter weight")
    @Positive(message = "Weight must be a positive value")
    @DecimalMax(value = "400", message = "Weight must not exceed 400")
    @Column(name="weight",nullable = false)
    private Float weight;

    @Column(name="height")
    private Float height;

    @NotEmpty(message = "Enter bp")
    @Column(name="bp",nullable = false)
    private String bp;

    @NotNull(message = "Enter Spo2")
    @Positive(message = "SP02 must be a positive value")
    @DecimalMax(value = "101", message = "SPo2 must not exceed 100")
    @Column(name="spo2",nullable = false)
    private Float spo2;

    @NotNull(message = "Enter Pulse")
    @Positive(message = "Pulse must be a positive value")
    @DecimalMax(value = "200", message = "Pulse must not exceed 200")
    @Column(name="pulse",nullable = false)
    private Integer pulse;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "pid" ,referencedColumnName = "patient_id",nullable = false)
    private Patient patient;

    public Vitals(Long vitalid, Float temperature, Float weight, Float height, String bp, Float spo2, Integer pulse, Patient patient) {
        this.vitalid = vitalid;
        this.temperature = temperature;
        this.weight = weight;
        this.height = height;
        this.bp = bp;
        this.spo2 = spo2;
        this.pulse = pulse;
        this.patient = patient;
    }

    public Long getVitalid() {
        return vitalid;
    }

    public void setVitalid(Long vitalid) {
        this.vitalid = vitalid;
    }

    public Float getTemperature() {
        return temperature;
    }

    public void setTemperature(Float temperature) {
        this.temperature = temperature;
    }

    public Float getWeight() {
        return weight;
    }

    public void setWeight(Float weight) {
        this.weight = weight;
    }

    public Float getHeight() {
        return height;
    }

    public void setHeight(Float height) {
        this.height = height;
    }

    public String getBp() {
        return bp;
    }

    public void setBp(String bp) {
        this.bp = bp;
    }

    public Float getSpo2() {
        return spo2;
    }

    public void setSpo2(Float spo2) {
        this.spo2 = spo2;
    }

    public Integer getPulse() {
        return pulse;
    }

    public void setPulse(Integer pulse) {
        this.pulse = pulse;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Vitals() {
    }

    @Override
    public String toString() {
        return "Vitals{" +
                "vitalid='" + vitalid + '\'' +
                ", temperature=" + temperature +
                ", weight=" + weight +
                ", height=" + height +
                ", bp='" + bp + '\'' +
                ", spo2=" + spo2 +
                ", pulse=" + pulse +
                ", patient=" + patient +
                '}';
    }
}


