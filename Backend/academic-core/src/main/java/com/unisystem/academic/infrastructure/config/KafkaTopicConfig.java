package com.unisystem.academic.infrastructure.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic studentEnrolledTopic() {
        return TopicBuilder.name("student-enrolled")
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic announcementCreatedTopic() {
        return TopicBuilder.name("announcement-created")
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic courseCreatedTopic() {
        return TopicBuilder.name("course-created")
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic notificationPushTopic() {
        return TopicBuilder.name("notification-push")
                .partitions(1)
                .replicas(1)
                .build();
    }
}
