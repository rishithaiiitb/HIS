package com.had.his.Entity;

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
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Entity
@Component
@Table(name = "receptionists")
public class Receptionist implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "receptionist_seq")
    @SequenceGenerator(name = "receptionist_seq", sequenceName = "receptionist_sequence", allocationSize = 1)
    private Long Id;


    @Column(name = "receptionist_id",unique = true,nullable = false)
    private String receptionistId;

    @NotEmpty(message = "Name cannot be blank")
    @Convert(converter = StringCryptoConverter.class)
    @Column(name = "name", nullable = false)
    private String name;

    @NotEmpty(message = "Please mention age")
    @Convert(converter = StringCryptoConverter.class)
    @Column(name = "age")
    private String age;

    @NotEmpty(message = "please mention sex")
    @Convert(converter = StringCryptoConverter.class)
    @Column(name = "sex")
    private String sex;


    @Convert(converter = StringCryptoConverter.class)
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @NotEmpty(message = "please mention contact details")
    @Convert(converter = StringCryptoConverter.class)
    @Column(name = "contact",nullable = false,unique = true)
    private String contact;

    @Column(name="active",nullable = false)
    private Boolean active;


    @Column(name = "password",nullable = false)
    private String password;

    @Column(name = "profile_photo", columnDefinition = "MEDIUMTEXT")
    private String photo;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @OneToMany(mappedBy = "receptionist",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler","receptionist"})
    private List<ReceptionistSchedule>  receptionistSchedules;


    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public String getReceptionistId() {
        return receptionistId;
    }

    public void setReceptionistId(String receptionistId) {
        this.receptionistId = receptionistId;
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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("RECEPTIONIST"));
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

   /* public void setPassword(String password) {
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

    /*public boolean isPasswordMatch(String enteredPassword) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.matches(enteredPassword, this.password);
    }*/


    public void generateEmail() {
        if (this.name != null && !this.name.trim().isEmpty() && this.receptionistId != null) {
            this.email = this.name.trim().toLowerCase().replaceAll("\\s+", "") +  this.receptionistId.trim().toLowerCase().replaceAll("\\s+", "")  + "@his.com";
        }
    }

    @PrePersist
    public void generateReceptionistId() {
        if (Id != null) {
            receptionistId = "R" + String.format("%02d", Id);
            generateEmail();
        }
    }

    public List<ReceptionistSchedule> getReceptionistSchedules() {
        return receptionistSchedules;
    }

    public void setReceptionistSchedules(List<ReceptionistSchedule> receptionistSchedules) {
        this.receptionistSchedules = receptionistSchedules;
    }

    public Receptionist() {

    }



    public Receptionist(Long id, String receptionistId, String name, String age, String sex, String email, String contact, Boolean active, String password, String photo, UserRole role, List<ReceptionistSchedule> receptionistSchedules) {
        Id = id;
        this.receptionistId = receptionistId;
        this.name = name;
        this.age = age;
        this.sex = sex;
        this.email = email;
        this.contact = contact;
        this.active = active;
        this.password = password;
        this.photo = photo;
        this.role = role;
        this.receptionistSchedules = receptionistSchedules;
    }

    @Override
    public String toString() {
        return "Receptionist{" +
                "Id=" + Id +
                ", receptionistId='" + receptionistId + '\'' +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", sex='" + sex + '\'' +
                ", email='" + email + '\'' +
                ", contact='" + contact + '\'' +
                ", active=" + active +
                ", password='" + password + '\'' +
                ", photo='" + photo + '\'' +
                ", role=" + role +
                ", receptionistSchedules=" + receptionistSchedules +
                '}';
    }
}

