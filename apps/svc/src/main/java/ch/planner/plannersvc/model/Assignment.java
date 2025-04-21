package ch.planner.plannersvc.model;


import ch.planner.plannersvc.model.base.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "assignments")
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
@Setter
public class Assignment extends BaseEntity {
    @Column(name = "employee_id", nullable = false)
    private String employeeId;

    @Column(name = "project_id", nullable = false)
    private String projectId;

    @Column(name = "date", nullable = false)
    private LocalDate date;
}
