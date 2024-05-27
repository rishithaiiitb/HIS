package com.had.his.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;

@Entity
@Table(name = "symptom_images")
public class SymptomImages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="symptom_image_id")
    private Integer id;

    @NotEmpty(message = "Enter description")
    @Column(nullable = false)
    private String description;

    @NotEmpty(message = "Upload image")
    @Column(columnDefinition = "MEDIUMTEXT",nullable = false)
    private String image;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "pid",referencedColumnName = "patient_id" ,nullable = false)
    private Patient patient;


    public SymptomImages() {

    }

    public SymptomImages(String description, String image, Patient patient) {
        this.description = description;
        this.image = image;
        this.patient = patient;
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }


    @Override
    public String toString() {
        return "SymptomImages{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", image='" + image + '\'' +
                ", patient=" + patient +
                '}';
    }
}

