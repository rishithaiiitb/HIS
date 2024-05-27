package com.had.his.Entity;


import com.had.his.Encryption.StringCryptoConverter;
import com.had.his.Role.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.Length;
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
@Table(name = "admin")
public class  Admin implements UserDetails {

    @Id
    @Column(name="admin_id")
    private String adminId;


    @NotEmpty(message = "PLease enter Email")
    @Convert(converter = StringCryptoConverter.class)
    @Column(name="email",unique = true, nullable = false)
    private String email;


    @NotEmpty(message = "Please enter password")
    @Column(name="password",nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    public Admin() {

    }

    public String getAdminId() {
        return adminId;
    }

    public void setAdminId(String adminId) {
        this.adminId = adminId;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ADMIN"));

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

    /*public void setPassword(String password) {
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

   /* public boolean isPasswordMatch(String enteredPassword) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.matches(enteredPassword, this.password);
    }*/

    public Admin( String adminId, String email, String password,UserRole role) {
        this.adminId=adminId;
        this.email = email;
        this.password = password;
        this.role=role;
    }

    @Override
    public String toString() {
        return "Admin{" +
                "adminId='" + adminId + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
