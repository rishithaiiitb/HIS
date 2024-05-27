package com.had.his.UserDetailsService;

import com.had.his.DAO.PharmacyDAO;
import com.had.his.Entity.Pharmacy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class PharmacyDetailsService implements ServiceDetails{

    @Autowired
    private PharmacyDAO pharmacyDAO;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Pharmacy pharmacy = pharmacyDAO.findByEmail(username);
        if (pharmacy == null) {
            throw new UsernameNotFoundException("User not found");
        }

        return pharmacy;
    }
}

