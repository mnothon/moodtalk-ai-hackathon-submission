package ch.planner.plannersvc.repository;

import ch.planner.plannersvc.model.AssistantMessage;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssistantMessageRepository extends CrudRepository<AssistantMessage, String> {
     List<AssistantMessage> findBySessionIdOrderByTimestampAsc(String sessionId);

     void deleteBySessionId(String sessionId);
}
