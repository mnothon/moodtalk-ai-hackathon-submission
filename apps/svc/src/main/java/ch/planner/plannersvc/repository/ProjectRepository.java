package ch.planner.plannersvc.repository;

import ch.planner.plannersvc.model.Project;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends CrudRepository<Project, String> {
  Page<Project> findAllByCompanyId(String companyId, Pageable pageable);

  List<Project> findAllByCompanyId(String companyId);

  Optional<Project> findByIdAndCompanyId(String id, String companyId);

  @Query("SELECT p " +
          "FROM Project p " +
          "WHERE p.mustBeOnPremises = :mustBeOnPremises")
  List<Project> AllProjectsByWorkLocation(@Param("mustBeOnPremises")Boolean mustBeOnPremises);


  @Query("SELECT p " +
          "FROM Project p " +
          "WHERE p.name = :name")
  Optional<Project> findByName(
            @Param("name")String name);
}
