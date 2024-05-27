package com.had.his.Service;


import com.had.his.Entity.Consent;

public interface ConsentService {

    Consent createConsent(String pid, String email);

    Consent consentforExisting(String pid, String email);

    boolean verifyConsent(String pid, String token);

}
