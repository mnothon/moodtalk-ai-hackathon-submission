package ch.planner.plannersvc.model;

import ch.planner.plannersvc.model.base.CompanyAwareBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "project")
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Getter
public class Project extends CompanyAwareBaseEntity {

  @Column(name = "name", nullable = false)
  @Setter
  private String name;

  @Column(name = "color", nullable = false)
  @Setter
  private String color;


  @Column(name = "must_be_on_premises", nullable = false)
  @Setter
  private Boolean mustBeOnPremises;
}
