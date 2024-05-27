package com.had.his.Security;

import com.had.his.UserDetailsService.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.SecurityMarker;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;



import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.security.web.session.SessionInformationExpiredEvent;
import org.springframework.security.web.session.SessionInformationExpiredStrategy;

import java.io.IOException;


@Configuration
@EnableWebSecurity
public class SecurityConfig {


    private NurseDetailsService nurseDetailsService;

    private NursejwtAuthenticationFilter nursejwtAuthenticationFilter;

    private DoctorjwtAuthenticationFilter doctorjwtAuthenticationFilter;
    private DoctorDetailsService doctorDetailsService;

    private PharmacyDetailsService pharmacyDetailsService;

    private PharmacyJwtAuthenticationFilter pharmacyJwtAuthenticationFilter;

    private AdminJwtAuthenticationFilter adminJwtAuthenticationFilter;

    private AdminDetailsService adminDetailsService;

    private ReceptionistJwtAuthenticationFilter receptionistJwtAuthenticationFilter;
    private ReceptionistDetailsService receptionistDetailsService;



    public SecurityConfig(NurseDetailsService nurseDetailsService, NursejwtAuthenticationFilter nursejwtAuthenticationFilter, DoctorjwtAuthenticationFilter doctorjwtAuthenticationFilter, DoctorDetailsService doctorDetailsService, PharmacyDetailsService pharmacyDetailsService, PharmacyJwtAuthenticationFilter pharmacyJwtAuthenticationFilter, AdminJwtAuthenticationFilter adminJwtAuthenticationFilter, AdminDetailsService adminDetailsService, ReceptionistJwtAuthenticationFilter receptionistJwtAuthenticationFilter, ReceptionistDetailsService receptionistDetailsService) {
        this.nurseDetailsService = nurseDetailsService;
        this.nursejwtAuthenticationFilter = nursejwtAuthenticationFilter;
        this.doctorjwtAuthenticationFilter = doctorjwtAuthenticationFilter;
        this.doctorDetailsService = doctorDetailsService;
        this.pharmacyDetailsService = pharmacyDetailsService;
        this.pharmacyJwtAuthenticationFilter = pharmacyJwtAuthenticationFilter;
        this.adminJwtAuthenticationFilter = adminJwtAuthenticationFilter;
        this.adminDetailsService = adminDetailsService;
        this.receptionistJwtAuthenticationFilter = receptionistJwtAuthenticationFilter;
        this.receptionistDetailsService = receptionistDetailsService;
    }



    @Bean
    @Order(1)
    public SecurityFilterChain nursesecurityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(AbstractHttpConfigurer::disable)
                .securityMatcher("/nurse/**")
                .authorizeHttpRequests(req -> req
                        .requestMatchers("/nurse/login").permitAll()
                        .requestMatchers("/nurse/save-token/**").permitAll()
                        .requestMatchers("/nurse/sendOtpforpassword/**").permitAll()
                        .requestMatchers("/nurse/verifyOtpforpassword/**").permitAll()
                        .requestMatchers("/nurse/getContactFromEmail/**").permitAll()
                        .requestMatchers("/nurse/passwordChange").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/nurse/**").hasAuthority("NURSE")
                        .anyRequest().authenticated()
                ).userDetailsService(nurseDetailsService)
                .sessionManagement(ses -> ses
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(nursejwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain doctorsecurityFilterChain(HttpSecurity http) throws Exception {


        http.csrf(AbstractHttpConfigurer::disable)
                .securityMatcher("/doctor/**")
                .authorizeHttpRequests(req -> req
                        .requestMatchers("/doctor/login").permitAll()
                        .requestMatchers("/doctor/passwordChange").permitAll()
                        .requestMatchers("/doctor/sendOtpforpassword/**").permitAll()
                        .requestMatchers("/doctor/verifyOtpforpassword/**").permitAll()
                        .requestMatchers("/doctor/getContactFromEmail/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/doctor/**").hasAuthority("DOCTOR")
                        .anyRequest().authenticated()
                ).userDetailsService(doctorDetailsService)
                .sessionManagement(ses->ses.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(doctorjwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);



        return http.build();
    }

    @Bean
    @Order(3)
    public SecurityFilterChain pharmacysecurityFilterChain(HttpSecurity http) throws Exception {


        http.csrf(AbstractHttpConfigurer::disable)
                .securityMatcher("/pharmacy/**")
                .authorizeHttpRequests(req -> req
                        .requestMatchers("/pharmacy/login").permitAll()
                        .requestMatchers("/pharmacy/passwordChange").permitAll()
                        .requestMatchers("/pharmacy/sendOtpforpassword/**").permitAll()
                        .requestMatchers("/pharmacy/verifyOtpforpassword/**").permitAll()
                        .requestMatchers("/pharmacy/getContactFromEmail/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/pharmacy/**").hasAuthority("PHARMACY")
                        .anyRequest().authenticated()
                ).userDetailsService(pharmacyDetailsService)
                .sessionManagement(ses->ses.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(pharmacyJwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);



        return http.build();
    }
    @Bean
    @Order(4)
    public SecurityFilterChain adminsecurityFilterChain(HttpSecurity http) throws Exception {


        http.csrf(AbstractHttpConfigurer::disable)
                .securityMatcher("/admin/**")
                .authorizeHttpRequests(req -> req
                        .requestMatchers("/admin/login").permitAll()
                        .requestMatchers("/admin/passwordChange").permitAll()
                        .requestMatchers("/admin/addAdmin").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/admin/**").hasAuthority("ADMIN")
                        .anyRequest().authenticated()
                ).userDetailsService(adminDetailsService)
                .sessionManagement(ses->ses.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(adminJwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);



        return http.build();
    }

    @Bean
    @Order(5)
    public SecurityFilterChain receptionistsecurityFilterChain(HttpSecurity http) throws Exception {


        http.csrf(AbstractHttpConfigurer::disable)
                .securityMatcher("/receptionist/**")
                .authorizeHttpRequests(req -> req
                        .requestMatchers("/receptionist/login").permitAll()
                        .requestMatchers("/receptionist/passwordChange").permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/receptionist/sendOtpforpassword/**").permitAll()
                        .requestMatchers("/receptionist/verifyOtpforpassword/**").permitAll()
                        .requestMatchers("/receptionist/getContactFromEmail/**").permitAll()
                        .requestMatchers("/receptionist/**").hasAuthority("RECEPTIONIST")
                        .anyRequest().authenticated()
                ).userDetailsService(receptionistDetailsService)
                .sessionManagement(ses->ses.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(receptionistJwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);



        return http.build();
    }






    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration )
    {
        try {
            return configuration.getAuthenticationManager();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    @Bean
    public ExpiringSessionStrategy expiredSessionStrategy() {
        return new ExpiringSessionStrategy(600); // 10 minutes in seconds
    }

    public class ExpiringSessionStrategy implements SessionInformationExpiredStrategy {
        private static final String EXPIRED_URL = "/nurse/login?expired";
        private int sessionTimeoutInSeconds;

        public ExpiringSessionStrategy(int sessionTimeoutInSeconds) {
            this.sessionTimeoutInSeconds = sessionTimeoutInSeconds;
        }

        @Override
        public void onExpiredSessionDetected(SessionInformationExpiredEvent event) throws IOException {
            event.getResponse().sendRedirect(EXPIRED_URL);
        }
    }
}





