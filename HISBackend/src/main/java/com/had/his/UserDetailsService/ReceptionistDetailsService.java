package com.had.his.UserDetailsService;

import com.had.his.DAO.ReceptionistDAO;
import com.had.his.Entity.Receptionist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class ReceptionistDetailsService implements ServiceDetails {

    @Autowired
    private ReceptionistDAO receptionistDAO;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Receptionist receptionist = receptionistDAO.findByEmail(username);
        if (receptionist == null) {
            throw new UsernameNotFoundException("User not found");
        }

        return receptionist;
    }
}

