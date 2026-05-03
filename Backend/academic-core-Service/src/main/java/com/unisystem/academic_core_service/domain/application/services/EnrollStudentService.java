package com.unisystem.academic_core_service.domain.application.services;
import com.unisystem.academic_core_service.domain.application.port.in.EnrollStudentUseCase;
import com.unisystem.academic_core_service.domain.application.port.out.CourseRepositoryPort;
import com.unisystem.academic_core_service.domain.application.port.out.EnrollmentRepositoryPort;
import com.unisystem.academic_core_service.domain.application.port.out.EventPublisherPort;
import com.unisystem.academic_core_service.domain.events.StudentEnrollend;
import com.unisystem.academic_core_service.domain.exceptions.AlreadyEnrolledException;
import com.unisystem.academic_core_service.domain.exceptions.CourseNotFoundException;
import com.unisystem.academic_core_service.domain.exceptions.InvalidEnrollmentException;
import com.unisystem.academic_core_service.domain.model.Course;
import com.unisystem.academic_core_service.domain.model.Enrollment;


public class EnrollStudentService  implements EnrollStudentUseCase {

     private final CourseRepositoryPort  courseRepositoryPort;
     private final EnrollmentRepositoryPort enrollmentRepositoryPort;
     private final EventPublisherPort eventPublisherPort;

     public EnrollStudentService(CourseRepositoryPort courseRepositoryPort, EnrollmentRepositoryPort enrollmentRepositoryPort, EventPublisherPort eventPublisherPort) {
        this.courseRepositoryPort = courseRepositoryPort;
        this.enrollmentRepositoryPort = enrollmentRepositoryPort;
        this.eventPublisherPort = eventPublisherPort;
     }



    @Override

    public Enrollment enroll(EnrollCommand cmd) {
        Course course=courseRepositoryPort.findById(cmd.courseId())
                .orElseThrow(()->new CourseNotFoundException(cmd.courseId()));

        enrollmentRepositoryPort.findByStudentIdAndCourseId(cmd.studentId(), cmd.courseId())
                .ifPresent(e -> { throw new AlreadyEnrolledException(cmd.studentId(), cmd.courseId()); });

        course.enrollStudent();
        courseRepositoryPort.save(course);

        Enrollment enrollment = Enrollment.create(cmd.studentId(), cmd.courseId());
        enrollmentRepositoryPort.save(enrollment);

        StudentEnrollend event = new StudentEnrollend(cmd.studentId().toString(), cmd.courseId().toString());
        eventPublisherPort.publishStudentEnrolled(event);
        return enrollment;
    }

    @Override

    public void drop(Long studentId, Long courseId) {
        Course course=courseRepositoryPort.findById(courseId)
                .orElseThrow(()->new CourseNotFoundException(courseId));

      Enrollment enrollment=  enrollmentRepositoryPort.findByStudentIdAndCourseId(studentId, courseId)
              .orElseThrow(()-> new InvalidEnrollmentException("Enrollment not found"));

      enrollmentRepositoryPort.deleteById(enrollment.getId());
      course.unenrollStudent();

    }
}
