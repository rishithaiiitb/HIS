package com.had.his.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;

@Entity
@Table(name = "past_images")
public class PastImages {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "past_image_id")
        private Integer imgId;

        @NotEmpty(message = "Image url needed")
        @Column(name="image",columnDefinition = "MEDIUMTEXT",nullable = false)
        private String pastImg;

        @JsonIgnore
        @ManyToOne
        @JoinColumn(name = "past_history_id", nullable = false)
        private PastHistory pastHistory;

        public Integer getImgId() {
        return imgId;
    }

        public void setImgId(Integer imgId) {
        this.imgId = imgId;
    }

        public String getPastImg() {
        return pastImg;
    }

        public void setPastImg(String pastImg) {
        this.pastImg = pastImg;
    }

        public PastHistory getPastHistory() {
        return pastHistory;
    }

        public void setPastHistory(PastHistory pastHistory) {
        this.pastHistory = pastHistory;
    }

    public PastImages() {
    }

    public PastImages(Integer imgId, String pastImg, PastHistory pastHistory) {
        this.imgId = imgId;
        this.pastImg = pastImg;
        this.pastHistory = pastHistory;
    }


}
