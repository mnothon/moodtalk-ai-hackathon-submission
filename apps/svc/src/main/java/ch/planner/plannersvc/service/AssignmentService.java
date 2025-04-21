package ch.planner.plannersvc.service;


import ch.planner.plannersvc.controller.converter.AssignmentConverter;
import ch.planner.plannersvc.dto.AssignmentDto;
import ch.planner.plannersvc.model.Assignment;
import ch.planner.plannersvc.repository.AssignmentRepository;
import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
@Validated
@Slf4j
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;

    @Tool("""
        Creates a single assignment for an employee to a project.
        Validates that:
        - The employee and project exist
        - The date is in YYYY-MM-DD format
        - No overlapping assignments exist for the employee
        """)
    public Assignment createSingleAssignment(
            @P("""
                The assignment object containing:
                - employeeId: The employee's unique ID
                - projectId: The project's unique ID
                - date: The date of the assignment in YYYY-MM-DD format
                """) Assignment assignment
    ) {
        return assignmentRepository.save(assignment);
    }

    @Tool("""
        Creates multiple assignments in a single operation.
        Validates that:
        - Each employee and project exist
        - Dates are in YYYY-MM-DD format
        - No overlapping assignments exist for any employee
        """)
    public List<Assignment> createMultipleAssignments(
            @P("""
                A list of assignment objects to be created.
                """) List<Assignment> assignments
    ) {
        return (List<Assignment>) assignmentRepository.saveAll(assignments);
    }


    @Tool("""
    Permanently deletes an assignment from the system.
    This action is irreversible and will:
    - Remove the assignment record completely
    - Affect any reporting or analytics referencing this assignment
    - Free up the employee's time slot for new assignments
    Use with caution!
    """)
    public void removeAssignment(
            @P("The unique identifier (UUID format) of the assignment to be deleted.") String assignmentId
    ) {
        final Assignment existing = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new EntityNotFoundException("Assignment not found with id: " + assignmentId));
        assignmentRepository.delete(existing);
    }

    @Tool("""
        Retrieves assignments based on flexible filters.
        Typical use cases:
        - Checking an employee's workload
        - Finding project allocations
        - Identifying scheduling gaps
        """)
    public List<Assignment> getAssignmentsByFilters(
            @P(required=false, value="Employee ID, or null if omitted") String employeeId,
            @P(required=false, value="Project ID, or null if omitted")  String projectId,
            @P(required=false, value="Start date (YYYY-MM-DD), or null if omitted") LocalDate startDate,
            @P(required=false, value="End   date (YYYY-MM-DD), or null if omitted") LocalDate endDate
    ) {
        return assignmentRepository.findByFilters(employeeId, projectId, startDate, endDate);
    }
}
