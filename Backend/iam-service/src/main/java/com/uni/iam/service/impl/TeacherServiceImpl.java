package com.uni.iam.service.impl;

import com.uni.iam.client.AcademicCoreClient;
import com.uni.iam.dto.response.AnnouncementSummaryResponse;
import com.uni.iam.dto.response.TeacherBasicResponse;
import com.uni.iam.dto.response.TeacherCourseResponse;
import com.uni.iam.dto.response.TeacherProfileResponse;
import com.uni.iam.dto.response.TeacherResponse;
import com.uni.iam.entity.Teacher;
import com.uni.iam.exception.UserNotFoundException;
import com.uni.iam.repository.TeacherRepository;
import com.uni.iam.service.Mappers.TeacherMapper;
import com.uni.iam.service.Mappers.AnnouncementMapper;
import com.uni.iam.service.interfaces.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

        private final TeacherRepository teacherRepository;
        private final AcademicCoreClient academicCoreClient;
        private final TeacherMapper teacherMapper;
        private final AnnouncementMapper announcementMapper;

        @Override
        @Transactional(readOnly = true)
        public List<TeacherResponse> getAllTeachers() {
                return teacherRepository.findAll().stream().map(teacherMapper::toTeacherResponse).toList();
        }

        @Override
        @Transactional(readOnly = true)
        public TeacherBasicResponse getTeacherBasic(Long id) {
                Teacher teacher = teacherRepository.findById(id)
                                .orElseThrow(() -> new UserNotFoundException(id));

                return teacherMapper.toTeacherBasicResponse(teacher);

        }

        @Override
        @Transactional(readOnly = true)
        public TeacherProfileResponse getTeacherDetails(Long id) {
                Teacher teacher = teacherRepository.findById(id)
                                .orElseThrow(() -> new UserNotFoundException(id));

                List<AcademicCoreClient.CourseRemoteResponse> courses = academicCoreClient.getCoursesByTeacherId(id);
                List<TeacherCourseResponse> courseResponses = teacherMapper.toTeacherCourseResponses(courses, teacher);

                List<AnnouncementSummaryResponse> announcements = announcementMapper.toAnnouncementSummaries(courses,
                                academicCoreClient);

                return teacherMapper.toTeacherProfileResponse(teacher, courses, courseResponses, announcements);
        }

}
