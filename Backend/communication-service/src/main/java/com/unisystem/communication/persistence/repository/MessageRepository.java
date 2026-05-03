package com.unisystem.communication.persistence.repository;

import com.unisystem.communication.persistence.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByCourseIdOrderByCreatedAtAsc(Long courseId);

    List<Message> findBySenderIdOrderByCreatedAtDesc(Long senderId);

    long countByCourseId(Long courseId);
}
