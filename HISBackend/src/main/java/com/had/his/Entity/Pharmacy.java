package com.had.his.Entity;

import com.had.his.Encryption.StringCryptoConverter;
import com.had.his.Role.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import org.checkerframework.checker.units.qual.N;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Collection;
import java.util.Collections;

@Entity
@Component
@Table(name = "pharmacy")
public class Pharmacy implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pharmacy_seq")
    @SequenceGenerator(name = "pharmacy_seq", sequenceName = "pharmacy_sequence", allocationSize = 1)
    private Long Id;
    @Column(name="pharmacy_id",unique = true,nullable = false)
    private String pharmacyId;

    @NotEmpty(message = "Name cannot be blank")
    @Convert(converter = StringCryptoConverter.class)
    @Column(name="name",nullable = false)
    private String name;

    @NotEmpty(message = "Please mention the address")
    @Convert(converter = StringCryptoConverter.class)
    @Column(name="address",nullable = false)
    private String address;


    @Convert(converter = StringCryptoConverter.class)
    @Column(name="email",unique = true,nullable = false)
    private String email;

    @NotEmpty(message = "Please enter contact details")
    @Convert(converter = StringCryptoConverter.class)
    @Column(name="contact",nullable = false,unique = true)
    private String contact;

    @Column(name="active",nullable = false)
    private Boolean active;

    @NotEmpty(message = "Please enter license number")
    @Convert(converter = StringCryptoConverter.class)
    @Column(name = "license_number",unique = true,nullable = false)
    private String licenseNumber;


    @Column(name="password",nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    public Pharmacy() {

    }

    public Long getId() {
        return Id;
    }

    public void setId(Long Id) {
        this.Id = Id;
    }

    public String getPharmacyId() {
        return pharmacyId;
    }
    public void setPharmacyId(String pharmacyId) {
        this.pharmacyId = pharmacyId;
        generateEmail();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
        generateEmail();
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

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("PHARMACY"));
    }

    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

  /*  public void setPassword(String password) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        this.password = passwordEncoder.encode(password);
    }*/
  public void setPassword(String password) {
      // Generate a salt
      SecureRandom secureRandom = new SecureRandom();
      byte[] salt = new byte[16];
      secureRandom.nextBytes(salt);

      // Hash the password with bcrypt and salt
      BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
      String hashedPassword = passwordEncoder.encode(password);

      // Now, you can encrypt the hashed password with the salt (if needed)
      // For demonstration, let's just print it here
      System.out.println("Salt: " + new String(salt));
      System.out.println("Double-encrypted Password: " + encryptWithSalt(hashedPassword, salt));

      // Save the double-encrypted password to your database or wherever needed
      this.password = hashedPassword;
  }

    // Method to double-encrypt the password with the provided salt
    private String encryptWithSalt(String password, byte[] salt) {
        // Concatenate password and salt
        String passwordWithSalt = password + new String(salt);
        // You can use another encryption algorithm here if needed
        // For demonstration, let's just return the concatenated string
        return passwordWithSalt;
    }

    public boolean isPasswordMatch(String enteredPassword) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.matches(enteredPassword, this.password);
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    /*public boolean isPasswordMatch(String enteredPassword) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.matches(enteredPassword, this.password);
    }*/

    public void generateEmail() {
        if (this.name != null && !this.name.trim().isEmpty() && this.pharmacyId != null) {
            this.email = this.name.trim().toLowerCase().replaceAll("\\s+", "") +  this.pharmacyId.trim().toLowerCase().replaceAll("\\s+", "")  + "@his.com";
        }
    }

    @PrePersist
    public void generatePharmacyId() {
        if (Id != null) {
            pharmacyId = "PH" + String.format("%02d", Id);
            generateEmail();
        }
    }
    public Pharmacy(Long Id, String pharmacyId, String name, String address , String contact,Boolean active ,String password, String licenseNumber,UserRole role) {
        this.Id = Id;
        this.pharmacyId=pharmacyId;
        this.name = name;
        this.address = address;
        this.password = password;
        this.contact = contact;
        this.active = active;
        this.licenseNumber=licenseNumber;
        this.role=role;
        generateEmail();
    }

    @Override
    public String toString() {
        return "Pharmacy{" +
                "Id=" + Id +
                ", pharmacyId='" + pharmacyId + '\'' +
                ", name='" + name + '\'' +
                ", address='" + address + '\'' +
                ", email='" + email + '\'' +
                ", contact='" + contact + '\'' +
                ", active=" + active +
                ", licenseNumber='" + licenseNumber + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}

