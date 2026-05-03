package com.unisystem.academic_core_service.infrastructure.adapters.out.kafka.kafkaConifg;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {


   @Bean
  public NewTopic studentEnrolledTopic() {
      return TopicBuilder.name(KafkaTopics.STUDENT_ENROLLED)
              .build();
  }


    @Bean
    public NewTopic courseCreatedTopic() {
        return TopicBuilder.name(KafkaTopics.COURSE_CREATED)
                .build();
    }

    @Bean
    public NewTopic announcementCreatedTopic() {
        return TopicBuilder.name(KafkaTopics.ANNOUNCEMENT_CREATED)
                .build();
    }

}
