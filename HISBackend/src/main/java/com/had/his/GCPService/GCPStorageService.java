package com.had.his.GCPService;


import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;
import java.util.concurrent.TimeUnit;

@Service
public class GCPStorageService {

    private final Storage storage;
    private final String bucketName;

    public GCPStorageService(
            @Value("${gcp.storage.credentials}") Resource credentialsResource,
            @Value("${gcp.storage.bucket-name}") String bucketName) throws IOException {
        // Initialize GCS client
        GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsResource.getInputStream());
        storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
        this.bucketName = bucketName;
    }

    public String generateSignedUrl(String filename) throws IOException {
        try {
            // Generate signed URL
            BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, filename).build();
            URL url = storage.signUrl(blobInfo, 5, TimeUnit.MINUTES, Storage.SignUrlOption.withV4Signature());
            return url.toString();
        } catch (Exception e) {
            throw new IOException("Failed to generate signed URL", e);
        }
    }
}

