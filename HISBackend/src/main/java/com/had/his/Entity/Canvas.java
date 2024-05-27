package com.had.his.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDate;

@Entity
public class Canvas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "canvas_id")
    private Long canvasId;

    @Column(name = "past_canvas",nullable = false)
    private Boolean pastCanvas;

    @Column(name = "served",nullable = false)
    private Boolean served;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "canvas"})
    @OneToOne
    @JoinColumn(name = "vid", nullable = false)
    private Visit visit;

    @NotEmpty(message = "Upload image")
    @Column(columnDefinition = "MEDIUMTEXT",nullable = false)
    private String image;

    @Column(name = "prescribed_on", nullable = false)
    private LocalDate prescribedOn;

    public Canvas() {
    }

    public Canvas(Long canvasId, Boolean pastCanvas, Boolean served, Visit visit, String image, LocalDate prescribedOn) {
        this.canvasId = canvasId;
        this.pastCanvas = pastCanvas;
        this.served = served;
        this.visit = visit;
        this.image = image;
        this.prescribedOn = prescribedOn;
    }

    public Long getCanvasId() {
        return canvasId;
    }

    public void setCanvasId(Long canvasId) {
        this.canvasId = canvasId;
    }

    public Boolean getPastCanvas() {
        return pastCanvas;
    }

    public void setPastCanvas(Boolean pastCanvas) {
        this.pastCanvas = pastCanvas;
    }

    public Boolean getServed() {
        return served;
    }

    public void setServed(Boolean served) {
        this.served = served;
    }

    public Visit getVisit() {
        return visit;
    }

    public void setVisit(Visit visit) {
        this.visit = visit;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public LocalDate getPrescribedOn() {
        return prescribedOn;
    }

    public void setPrescribedOn(LocalDate prescribedOn) {
        this.prescribedOn = prescribedOn;
    }

    @Override
    public String toString() {
        return "Canvas{" +
                "canvasId=" + canvasId +
                ", pastCanvas=" + pastCanvas +
                ", served=" + served +
                ", visit=" + visit +
                ", image='" + image + '\'' +
                ", prescribedOn=" + prescribedOn +
                '}';
    }
}
