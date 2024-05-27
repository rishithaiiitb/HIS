package com.had.his.Entity;

import com.had.his.Encryption.StringCryptoConverter;
import jakarta.persistence.*;

@Entity
@Table(name="hospital")
public class Hospital {

    @Id
    @Column(name="hospital_id")
    private String hospitalId;

    @Column(name="name",nullable = false)
    private String name;

    @Column(name="license_number",nullable = false,unique = true)
    private String licenseNumber;

    @Column(name="address")
    private String address;

    @Column(name="email",unique = true,nullable = false)
    private String email;

    @Column(name="contact",nullable = false,unique = true)
    private String contact;

    public Hospital() {

    }

    public String getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(String hospitalId) {
        this.hospitalId = hospitalId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }


    public Hospital( String hospitalId ,String name, String licenseNumber, String address, String email, String contact) {
        this.hospitalId=hospitalId;
        this.name = name;
        this.licenseNumber = licenseNumber;
        this.address = address;
        this.email = email;
        this.contact = contact;
    }

    @Override
    public String toString() {
        return "Hospital{" +
                "hospitalId='" + hospitalId + '\'' +
                ", name='" + name + '\'' +
                ", licenseNumber='" + licenseNumber + '\'' +
                ", address='" + address + '\'' +
                ", email='" + email + '\'' +
                ", contact='" + contact + '\'' +
                '}';
    }
}