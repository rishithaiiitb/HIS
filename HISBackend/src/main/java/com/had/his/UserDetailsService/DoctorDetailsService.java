package com.had.his.UserDetailsService;



import com.had.his.DAO.DoctorDAO;
import com.had.his.Entity.Doctor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DoctorDetailsService implements ServiceDetails{

    @Autowired
    private DoctorDAO doctorDAO;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Doctor doctor = doctorDAO.findByEmail(username);
        if (doctor == null) {
            throw new UsernameNotFoundException("User not found");
        }

       return doctor;
    }
}

