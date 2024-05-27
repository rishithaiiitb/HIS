package com.had.his.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;

@Entity
@Table(name="testimages")
public class TestImages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="testimageId")
    private Long testimageId;

    @NotEmpty(message = "Upload image")
    @Column(columnDefinition = "MEDIUMTEXT",nullable = false)
    private String image;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="tid" ,nullable = false)
    private Test test;

    public TestImages() {
    }

    public TestImages(Long testimageId, String image, Test tests) {
        this.testimageId = testimageId;
        this.image = image;
        this.test = tests;
    }

    public Long getTestimageId() {
        return testimageId;
    }

    public void setTestimageId(Long testimageId) {
        this.testimageId = testimageId;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Test getTest() {
        return test;
    }

    public void setTest(Test tests) {
        this.test = tests;
    }

    @Override
    public String toString() {
        return "TestImages{" +
                "testimageId=" + testimageId +
                ", image='" + image + '\'' +
                ", tests=" + test +
                '}';
    }
}