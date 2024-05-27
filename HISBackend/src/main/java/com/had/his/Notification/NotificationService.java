package com.had.his.Notification;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Notification;
import com.had.his.DAO.NurseScheduleDAO;
import com.had.his.DAO.ReceptionistScheduleDAO;
import com.had.his.Entity.NurseSchedule;
import com.had.his.Entity.ReceptionistSchedule;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class NotificationService {

    public static final String ACCOUNT_SID = "AC029cddf34a58b8b13dfb781ea5117fd4";
    public static final String AUTH_TOKEN = "21e881f0482488a6385833c13399b96e";
    public static final String TWILIO_PHONE_NUMBER = "+14583121058";

    @Autowired
    private NurseScheduleDAO nurseScheduleDAO;
    @Autowired
    private ReceptionistScheduleDAO receptionistScheduleDAO;


    private Set<Integer> sentNurseNotifications = new HashSet<>();

    private Set<Integer> sentRepNotifications = new HashSet<>();



    @Scheduled(fixedRate = 15000)
    public void sendNurseScheduledNotifications() {
        DayOfWeek currentDay = LocalDateTime.now().getDayOfWeek();
        LocalTime currentTime = LocalTime.now();
        List<NurseSchedule> schedules = nurseScheduleDAO.findActiveSchedules(currentDay,currentTime);
        for (NurseSchedule schedule : schedules) {
            Integer scheduleId=schedule.getScheduleId();
            if (!sentNurseNotifications.contains(scheduleId)){
            LocalTime scheduleStartTime = schedule.getStart_time();
            LocalTime scheduleEndTime=schedule.getEnd_time();
            if (currentTime.isAfter(scheduleStartTime)&& currentTime.isBefore(scheduleEndTime)) {
                System.out.println("Hi");
                Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
                sentNurseNotifications.add(scheduleId);
                sendNurseNotificationIfScheduled(schedule);
            }
        }
    }}


    @Scheduled(fixedRate = 15000)
    public void sendRecepScheduledNotifications() {
        DayOfWeek currentDay = LocalDateTime.now().getDayOfWeek();
        LocalTime currentTime = LocalTime.now();
        List<ReceptionistSchedule> schedules = receptionistScheduleDAO.findActiveSchedules(currentDay,currentTime);
        for (ReceptionistSchedule schedule : schedules) {
            Integer scheduleId=schedule.getScheduleId();
            if (!sentRepNotifications.contains(scheduleId)){
                LocalTime scheduleStartTime = schedule.getStartTime();
                LocalTime scheduleEndTime=schedule.getEndTime();
                if (currentTime.isAfter(scheduleStartTime)&& currentTime.isBefore(scheduleEndTime)) {
                    Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
                    sentRepNotifications.add(scheduleId);
                    sendRecepNotificationIfScheduled(schedule);
                }
            }
        }}

    private void sendNurseNotificationIfScheduled(NurseSchedule nurseSchedule) {
        String mobile = nurseSchedule.getNurse().getContact();
        Message message = Message.creator(
                new PhoneNumber("+91"+mobile),
                new PhoneNumber(TWILIO_PHONE_NUMBER),
                "Its your duty time ,Please login")

                        .create();
            System.out.println(message.getSid());

            try {

                System.out.println("Notification sent to nurse with contact: " + mobile);

            } catch (Exception e) {
                System.err.println("Error sending notification to nurse: " + e.getMessage());
                e.printStackTrace();
            }
    }

    private void sendRecepNotificationIfScheduled(ReceptionistSchedule receptionistSchedule) {
        String mobile = receptionistSchedule.getReceptionist().getContact();
        Message message = Message.creator(
                        new PhoneNumber("+91"+mobile),
                        new PhoneNumber(TWILIO_PHONE_NUMBER),
                        "Its your duty time ,Please login")

                .create();
        System.out.println(message.getSid());

        try {

            System.out.println("Notification sent to receptionist with contact: " + mobile);

        } catch (Exception e) {
            System.err.println("Error sending notification to receptionist: " + e.getMessage());
            e.printStackTrace();
        }
    }
}


