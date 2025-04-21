package ch.planner.plannersvc.model;

import ch.planner.plannersvc.model.base.CompanyAwareBaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "employee")
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
public class Employee extends CompanyAwareBaseEntity {

  @Column(name = "name", nullable = false)
  @Setter
  private String name;

  @Column(name = "surname", nullable = false)
  @Setter
  private String surname;

  @Column(name = "email", nullable = false)
  @Setter
  private String email;

  @Column(name = "works_remotely", nullable = false)
  @Setter
  private Boolean worksRemotely;

  @Column(name = "lang", nullable = false)
  @Enumerated(EnumType.STRING)
  @Setter
  private Language lang;
}
