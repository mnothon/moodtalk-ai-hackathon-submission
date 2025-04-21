package ch.planner.plannersvc.controller.converter;

import ch.planner.plannersvc.dto.ProjectDto;
import ch.planner.plannersvc.dto.ProjectProperties;
import ch.planner.plannersvc.model.Project;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ProjectConverter {

  public static List<ProjectDto> toDtos(List<Project> projects) {
    if (projects == null) {
      return null;
    }

    return projects.stream().map(ProjectConverter::toDto).filter(Objects::nonNull).collect(Collectors.toList());
  }

  public static ProjectDto toDto(Project project) {
    if (project == null) {
      return null;
    }

    return new ProjectDto()
            .id(project.getId())
            .name(project.getName())
            .mustBeOnPremises(project.getMustBeOnPremises())
            .color(project.getColor());
  }

  public static Project fromProperties(ProjectProperties properties) {
    if (properties == null) {
      return null;
    }

    return Project.builder()
            .name(properties.getName())
            .color(properties.getColor())
            .mustBeOnPremises(properties.getMustBeOnPremises())
            .build();
  }
}
