package UnitSystem.demo.DataAccessLayer.Entities;

import jakarta.persistence.*;
import lombok.*;

/**
 * Stub — the real User entity lives in the IAM service.
 * This class maps to the shared "users" table so JPA
 * can resolve the @ManyToOne relationships on Notification and Message.
 * We only read from this table — we never write to it.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false, length = 50, insertable = false, updatable = false)
    private String userName;

    @Column(nullable = false, length = 255, insertable = false, updatable = false)
    private String email;
}
