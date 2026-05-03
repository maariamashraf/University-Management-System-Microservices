package com.unisystem.academic_core_service.infrastructure.adapters.out.persistence;

import com.unisystem.academic_core_service.domain.application.port.out.AnnouncementRepositoryPort;
import com.unisystem.academic_core_service.domain.model.Announcement;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.entity.AnnouncementEntity;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.mapper.AnnouncementPersistenceMapper;
import com.unisystem.academic_core_service.infrastructure.adapters.out.persistence.repository.AnnouncementJpaRepository;
import com.unisystem.academic_core_service.infrastructure.config.CacheConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AnnouncementPersistenceAdapter implements AnnouncementRepositoryPort {

    private final AnnouncementJpaRepository announcementJpaRepository;
    private final AnnouncementPersistenceMapper announcementPersistenceMapper;

    @Override
    @CacheEvict(cacheNames = CacheConfig.ANNOUNCEMENTS_BY_COURSE_CACHE, key = "#announcement.courseId")
    public Announcement save(Announcement announcement) {
        AnnouncementEntity saved = announcementJpaRepository.save(announcementPersistenceMapper.toEntity(announcement));
        return announcementPersistenceMapper.toDomain(saved);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.ANNOUNCEMENTS_BY_COURSE_CACHE, key = "#courseId")
    public List<Announcement> findByCourseId(Long courseId) {
        return announcementJpaRepository.findByCourseIdOrderByCreatedAtDesc(courseId)
                .stream()
                .map(announcementPersistenceMapper::toDomain)
                .toList();
    }
}
