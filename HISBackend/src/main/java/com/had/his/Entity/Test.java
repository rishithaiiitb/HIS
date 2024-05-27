package com.had.his.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tests")
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "test_id")
    private Integer id;

    @NotEmpty(message = "Test Name cannot be blank")
    @Size(min = 2, message = "Name should contain at least 2 characters")
    @Column(name = "test_name", nullable = false)
    private String testName;


    @Column(name = "prescribed_on", nullable = false)
    private LocalDate prescribedOn;

    @Column(name = "test_result", columnDefinition = "MEDIUMTEXT")
    private String result;

    @Column(name = "past_test")
    private Boolean pastTest;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "test"})
    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL)
    private List<TestImages> testImages;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "tests"})
    @ManyToOne
    @JoinColumn(name = "vid", nullable = false)
    private Visit visit;


    public Test() {
    }

    public Test(Integer id, String testName, LocalDate prescribedOn, String result, Boolean pastTest, Visit visit, List<TestImages> testImages) {
        this.id = id;
        this.testName = testName;
        this.prescribedOn = prescribedOn;
        this.result = result;
        this.pastTest = pastTest;
        this.visit = visit;
        this.testImages = testImages;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public LocalDate getPrescribedOn() {
        return prescribedOn;
    }

    public void setPrescribedOn(LocalDate prescribedOn) {
        this.prescribedOn = prescribedOn;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }


    public Boolean getPastTest() {
        return pastTest;
    }

    public void setPastTest(Boolean pastTest) {
        this.pastTest = pastTest;
    }

    public Visit getVisit() {
        return visit;
    }

    public void setVisit(Visit visit) {
        this.visit = visit;
    }

    public List<TestImages> getTestImages() {
        return testImages;
    }

    public void setTestImages(List<TestImages> testImages) {
        this.testImages = testImages;
    }

    @Override
    public String toString() {
        return "Test{" +
                "id=" + id +
                ", testName='" + testName + '\'' +
                ", prescribedOn=" + prescribedOn +
                ", result='" + result + '\'' +
                ", pastTest=" + pastTest +
                ", testImages=" + testImages +
                ", visit=" + visit +
                '}';
    }
}

