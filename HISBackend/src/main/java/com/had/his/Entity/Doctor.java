package com.had.his.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.had.his.Encryption.StringCryptoConverter;
import com.had.his.Role.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Entity
@Component
@Table(name = "doctors")
public class Doctor implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "doctor_seq")
    @SequenceGenerator(name = "doctor_seq", sequenceName = "doctor_sequence", allocationSize = 1)
    private Long Id;

    @Column(name="doctor_id",unique = true,nullable = false)
    private String doctorId;
    @NotEmpty(message = "Name cannot be blank")
    @Convert(converter = StringCryptoConverter.class)
    @Column(nullable = false)
    private String name;
    @NotEmpty(message = "Please mention age")
    @Convert(converter = StringCryptoConverter.class)
    private String age;
    @NotEmpty(message = "Please mention sex")
    @Convert(converter = StringCryptoConverter.class)
    private String sex;
    @NotEmpty(message = "Please mention qualification")
    @Convert(converter = StringCryptoConverter.class)
    @Column(nullable = false)
    private String qualification;
    @NotEmpty(message = "Please enter the department")
    @Column(nullable = false)
    private String department;

    @Convert(converter = StringCryptoConverter.class)
    @Column(unique = true, nullable = false)
    private String email;

    @NotEmpty(message = "Please enter contact details")
    @Convert(converter = StringCryptoConverter.class)
    @Column(unique = true, nullable = false)
    private String contact;
    @NotEmpty(message = "Please mention license number")
    @Convert(converter = StringCryptoConverter.class)
    @Column(name = "license_number", unique = true, nullable = false)
    private String licenseNumber;

    @Column(name="availability",nullable = false)
    private Boolean availability;

    @Column(name="active",nullable = false)
    private Boolean active;


    @Column(name="password",nullable = false)
    private String password;

    @Column(name="profile_photo", columnDefinition = "MEDIUMTEXT")
    private String photo;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @OneToMany(mappedBy = "doctor", cascade= CascadeType.ALL)
    @JsonIgnore
    private List<Visit> visits;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "specialization",nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "doctors"})
    private Specialization specialization;

    public Long getId() {
        return Id;
    }

    public void setId(Long Id) {
        this.Id = Id;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
        generateEmail();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
        generateEmail();
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
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

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public Specialization getSpecialization() {
        return specialization;
    }

    public void setSpecialization(Specialization specialization) {
        this.specialization = specialization;
    }

    public Boolean getAvailability() {
        return availability;
    }

    public void setAvailability(Boolean availability) {
        this.availability = availability;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("DOCTOR"));
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

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public List<Visit> getVisits() {
        return visits;
    }

    public void setVisits(List<Visit> visits) {
        this.visits = visits;
    }

   /* public boolean isPasswordMatch(String enteredPassword) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.matches(enteredPassword, this.password);
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



    public void generateEmail() {
        if (this.name != null && !this.name.trim().isEmpty() && this.doctorId != null) {
            this.email = this.name.trim().toLowerCase().replaceAll("\\s+", "") +  this.doctorId.trim().toLowerCase().replaceAll("\\s+", "")  + "@his.com";
        }
    }

    @PrePersist
    public void generateDoctorId() {
        if (Id != null) {
            doctorId = "D" + String.format("%02d", Id);
            generateEmail();
        }
    }

    public void addVisit(Visit newVisit) {
        if (visits == null) {
            visits = new ArrayList<>();
        }
        visits.add(newVisit);
        newVisit.setDoctor(this);
    }

    public Doctor(Long Id, String doctorId,String name, String age, String sex, String qualification,
                  Specialization specialization, String department, String contact, String licenseNumber ,Boolean availability ,Boolean active ,UserRole role,List<Visit> visits ,String photo, String password) {
        this.Id = Id;
        this.doctorId=doctorId;
        this.name = name;
        this.age = age;
        this.sex = sex;
        this.qualification = qualification;
        this.specialization = specialization;
        this.department = department;
        this.contact = contact;
        this.licenseNumber = licenseNumber;
        this.availability = availability;
        this.active = active;
        this.role=role;
        this.visits = visits;
        this.password = password;
        this.photo = photo;

        generateEmail();
    }


    public Doctor() {
    }

    @Override
    public String toString() {
        return "Doctor{" +
                "Id=" + Id +
                ", doctorId='" + doctorId + '\'' +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", sex='" + sex + '\'' +
                ", qualification='" + qualification + '\'' +
                ", department='" + department + '\'' +
                ", email='" + email + '\'' +
                ", contact='" + contact + '\'' +
                ", licenseNumber='" + licenseNumber + '\'' +
                ", availability=" + availability +
                ", active=" + active +
                ", password='" + password + '\'' +
                ", photo='" + photo + '\'' +
                ", role=" + role +
                ", visits=" + visits +
                ", specialization=" + specialization +
                '}';
    }
}

