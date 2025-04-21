package ch.planner.plannersvc.repository;


import ch.planner.plannersvc.model.Assignment;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AssignmentRepository extends CrudRepository<Assignment, String> {
     @Query("SELECT a FROM Assignment a WHERE " +
             "(:employeeId IS NULL OR a.employeeId= :employeeId) AND " +
             "(:projectId IS NULL OR a.projectId = :projectId) AND " +
             "a.date BETWEEN :startDate AND :endDate")
     List<Assignment> findByFilters(
             @Param("employeeId") String employeeId,
             @Param("projectId") String projectId,
             @Param("startDate") LocalDate startDate,
             @Param("endDate") LocalDate endDate
     );
}
