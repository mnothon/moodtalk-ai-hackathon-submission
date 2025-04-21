package ch.planner.plannersvc.model;

import ch.planner.plannersvc.model.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.Instant;


@Entity
@Table(name = "messages")
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
public class AssistantMessage extends BaseEntity {
    @Column(name = "sender", nullable = false)
    private String sender;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    @Column(name = "session_id", nullable = false, length = 36)
    private String sessionId;
}
