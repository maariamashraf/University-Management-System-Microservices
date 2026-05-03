package UnitSystem.demo.DataAccessLayer.Entities;

import jakarta.persistence.*;
import lombok.*;

/**
 * Stub — maps to the shared "enrollments" table.
 * Used to fan-out notifications to all students enrolled in a course.
 * Read-only from this service's perspective.
 */
@Entity
@Table(name = "enrollments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrolledCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
}
