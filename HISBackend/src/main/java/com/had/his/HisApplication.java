package com.had.his;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.IOException;
import java.io.InputStream;

@SpringBootApplication
@EnableScheduling
public class HisApplication {

	@Bean
	 FirebaseMessaging firebaseMessaging() throws IOException {
		try {
			GoogleCredentials googleCredentials = GoogleCredentials.fromStream(new ClassPathResource("/firebase/google-services.json").getInputStream());

			FirebaseOptions options = FirebaseOptions.builder()
					.setCredentials(googleCredentials)
					.build();
			FirebaseApp app = FirebaseApp.initializeApp(options, "my app");
			return FirebaseMessaging.getInstance(app);
		}catch (IOException e) {
			e.printStackTrace();
			throw new RuntimeException("Error reading Firebase credentials file.");
		}

	}

	public static void main(String[] args) {
		SpringApplication.run(HisApplication.class, args);
	}

}
