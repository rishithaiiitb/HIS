package com.had.his.UserDetailsService;

import com.had.his.DAO.NurseDAO;
import com.had.his.Entity.Nurse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class NurseDetailsService implements ServiceDetails {

    @Autowired
    private NurseDAO nurseDAO;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Nurse nurse =  nurseDAO.findByEmail(username);
        if (nurse == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return nurse;

    }
}

