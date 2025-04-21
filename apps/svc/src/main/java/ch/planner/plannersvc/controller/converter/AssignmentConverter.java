package ch.planner.plannersvc.controller.converter;


import ch.planner.plannersvc.model.Assignment;
import ch.planner.plannersvc.dto.AssignmentDto;
import ch.planner.plannersvc.dto.AssignmentProperties;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@NoArgsConstructor(access = AccessLevel.PRIVATE)

public class AssignmentConverter {

    public static List<AssignmentDto> toDtos(List<Assignment> assignments) {
        if (assignments == null) {
            return null;
        }

        return assignments.stream().map(AssignmentConverter::toDto).filter(Objects::nonNull).collect(Collectors.toList());
    }

    public static AssignmentDto toDto(Assignment assignment) {
        if (assignment == null) {
            return null;
        }

        return new AssignmentDto()
                .id(assignment.getId())
                .employeeId(assignment.getEmployeeId())
                .projectId(assignment.getProjectId())
                .date(assignment.getDate());
    }

    public static Assignment fromProperties(AssignmentProperties properties) {
        if (properties == null) {
            return null;
        }

        return Assignment.builder()
                .date(properties.getDate())
                .employeeId(properties.getEmployeeId())
                .projectId(properties.getProjectId())
                .build();
    }
}
