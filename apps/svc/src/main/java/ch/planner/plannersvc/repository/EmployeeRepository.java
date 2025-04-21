package ch.planner.plannersvc.repository;

import ch.planner.plannersvc.model.Employee;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends CrudRepository<Employee, String> {
  Page<Employee> findAllByCompanyId(String companyId, Pageable pageable);

  List<Employee> findAllByCompanyId(String companyId);

  Optional<Employee> findByIdAndCompanyId(String id, String companyId);

  @Query("SELECT e " +
          "FROM Employee e " +
          "WHERE e.worksRemotely = :worksRemotely")
  List<Employee> findAllEmployeesByWorkLocation(@Param("worksRemotely") Boolean worksRemotely);


  @Query("SELECT e " +
          "FROM Employee e " +
          "WHERE e.name    = :name " +
          "AND e.surname = :surname")
  Optional<Employee> findByNameAndSurname(@Param("name") String name,
                                          @Param("surname") String surname);
}
