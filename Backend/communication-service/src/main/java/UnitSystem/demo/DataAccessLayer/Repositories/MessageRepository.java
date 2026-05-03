package UnitSystem.demo.DataAccessLayer.Repositories;

import UnitSystem.demo.DataAccessLayer.Entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByCourseIdOrderByCreatedAtAsc(Long courseId);

    List<Message> findBySenderIdOrderByCreatedAtDesc(Long senderId);

    long countByCourseId(Long courseId);
}
