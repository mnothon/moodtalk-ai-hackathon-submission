package ch.planner.plannersvc.controller;

import ch.planner.plannersvc.api.AssignmentsApi;
import ch.planner.plannersvc.auth.IsUser;
import ch.planner.plannersvc.auth.SessionState;
import ch.planner.plannersvc.auth.WithSessionState;
import ch.planner.plannersvc.controller.converter.AssignmentConverter;
import ch.planner.plannersvc.model.Assignment;
import ch.planner.plannersvc.dto.AssignmentDto;
import ch.planner.plannersvc.dto.AssignmentProperties;
import ch.planner.plannersvc.service.AssignmentService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@WithSessionState
@AllArgsConstructor
public class AssignmentController implements AssignmentsApi {

    private final SessionState sessionState;
    private final AssignmentService assignmentService;

    @Override
    @IsUser
    public ResponseEntity<Void> deleteAssignment(String assignmentId) {
        assignmentService.removeAssignment(assignmentId);
        return ResponseEntity.noContent().build();
    }

    @Override
    @IsUser
    public ResponseEntity<AssignmentDto> saveAssignment(AssignmentProperties assignmentProperties) {
        final Assignment assignment = AssignmentConverter.fromProperties(assignmentProperties);

        final Assignment saved = assignmentService.createSingleAssignment(assignment);

        return ResponseEntity.ok(AssignmentConverter.toDto(saved));
    }

    @Override
    @IsUser
    public ResponseEntity<List<AssignmentDto>> getAssignments(
            @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate endDate,
            @RequestParam Optional<String> employeeId,
            @RequestParam Optional<String> projectId
    ) {
        final List<Assignment> assignments = assignmentService.getAssignmentsByFilters(
                employeeId.orElse(null),
                projectId.orElse(null),
                startDate,
                endDate);

        final List<AssignmentDto> dtos = AssignmentConverter.toDtos(assignments);

        return ResponseEntity.ok(dtos);
    }
}
