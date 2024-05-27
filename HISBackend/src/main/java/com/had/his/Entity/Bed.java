package com.had.his.Entity;



import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;


@Table(name = "beds")
@Entity
public class Bed {

    @Id
    @Column(name="bed_id")
    private String bId;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "bed"})
    @OneToOne
    @JoinColumn(name="pid", referencedColumnName = "patient_id",unique = true)
    private Patient patient;

    public Bed() {
    }

    public Bed(String bId, Patient patient) {
        this.bId = bId;
        this.patient = patient;
    }

    public String getbId() {
        return bId;
    }

    public void setbId(String bId) {
        this.bId = bId;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }


    @Override
    public String toString() {
        return "Bed{" +
                "bId='" + bId + '\'' +
                ", patient=" + patient +
                '}';
    }
}