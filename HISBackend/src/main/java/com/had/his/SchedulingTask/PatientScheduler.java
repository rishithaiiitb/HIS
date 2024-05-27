package com.had.his.SchedulingTask;

import com.had.his.DAO.ConsentDAO;
import com.had.his.DAO.PatientDAO;
import com.had.his.DAO.VisitDAO;
import com.had.his.Entity.Consent;
import com.had.his.Entity.Patient;
import com.had.his.Entity.Visit;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PatientScheduler {
@Autowired
PatientDAO patientDAO;

@Autowired
VisitDAO visitDAO;

@Autowired
ConsentDAO consentDAO;

    @Scheduled(cron = "0 */2 * * * ?")
    @Transactional
    public void deleteOldPatients() {
        System.out.println("Scheduler for patient details deletion run");
        LocalDate threeYearsAgo = LocalDate.now().minusYears(3);
        List<Visit> oldAdmissions = visitDAO.findByAdmittedDateBefore(threeYearsAgo);

        for (Visit admission : oldAdmissions) {
            Patient patient = admission.getPatient();
            patientDAO.delete(patient);
        }
    }

    @Scheduled(cron = "0 */2 * * * ?")
    @Transactional
    public void updateExpiry() {
        System.out.println("Scheduler for expiry true run");
        LocalDate oneWeekAgo = LocalDate.now().minusWeeks(1);
        List<Consent> consentsToExpire =consentDAO.findByConsentTakenOnBeforeAndIsExpiredIsFalse(oneWeekAgo);

        for (Consent consent : consentsToExpire) {
            consent.setExpired(true);
            consentDAO.save(consent);
        }
    }
}
