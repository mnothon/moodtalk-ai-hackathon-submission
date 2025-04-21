package ch.planner.plannersvc.service;

import ch.planner.plannersvc.controller.converter.ProjectConverter;
import ch.planner.plannersvc.dto.ProjectDto;
import ch.planner.plannersvc.dto.ProjectsPagedResponse;
import ch.planner.plannersvc.model.Project;
import ch.planner.plannersvc.model.User;
import ch.planner.plannersvc.repository.ProjectRepository;
import java.util.List;
import java.util.Optional;

import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

@Service
@AllArgsConstructor
@Validated
@Slf4j
public class ProjectService {

  private final ProjectRepository projectRepository;

  public ProjectsPagedResponse getProjects(
          User user,
          Optional<Integer> page,
          Optional<Integer> pageSize
  ) {
    int pageNumber = page.orElse(1);
    int pageSizeNumber = pageSize.orElse(100);

    Pageable pageable = PageRequest.of(pageNumber, pageSizeNumber);
    Page<Project> pageableProjects = projectRepository.findAllByCompanyId(user.getCompanyId(), pageable);

    return new ProjectsPagedResponse()
          .currentPage(pageableProjects.getNumber())
          .totalPages(pageableProjects.getTotalPages())
          .pageSize(pageableProjects.getPageable().getPageSize())
          .totalItems((int) pageableProjects.getTotalElements())
          .results(ProjectConverter.toDtos(pageableProjects.getContent()));
  }

  @Tool("""
        Retrieves a list of all projects in the company.
        Includes:
        - Project details (name, ID, color)
        Sorting:
        - Results are ordered by project name alphabetically
        """)
  public List<ProjectDto> getAllProjects() {
    List<Project> projects = (List<Project>) projectRepository.findAll();
    return ProjectConverter.toDtos(projects);
  }

  @Tool("""
        Retrieves a list of all projects in the company based on work location.
        Parameters:
        - mustBeOnsite: Indicates if the employees need to be on-site
        """)
  public List<ProjectDto> getAllProjectsByWorkLocation(
          @P("Indicates if the employee works remotely"
          ) Boolean mustBeOnsite) {
    List<Project> projects = projectRepository.AllProjectsByWorkLocation(mustBeOnsite);
    return ProjectConverter.toDtos(projects);
  }

    @Tool("""
            Retrieves a specific project by its name.
          """)
  public ProjectDto getProjectByName(
          @P("The project's name") String projectName
  ) {
    final Project existing = projectRepository.findByName(projectName)
            .orElseThrow(() -> new EntityNotFoundException("Project not found with name: " + projectName));
    return ProjectConverter.toDto(existing);
  }

    @Tool("""
          Retrieves a specific project by its unique identifier.
          Validates:
          - Project must exist in user's company
          """)
  public ProjectDto getProjectById(
          @P("The project's unique identifier (UUID format)") String projectId
  ) {
    final Project existing = projectRepository.findById(projectId)
            .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));
    return ProjectConverter.toDto(existing);
  }

  @Tool("""
        Creates a new project in the system.
        Requirements:
        - Project name must be unique within company
        - Color must be in HEX format (e.g., #FF5733)
        Auto-set:
        - Company ID from user context
        """)
  public ProjectDto createProject(
          @P("The authenticated user (for company association)") User user,
          @P("""
              Project details containing:
              - name: Project name (required, unique)
              - color: Visual color tag (required, HEX format)
              """) Project project
  ) {
    project.setCompanyId(user.getCompanyId());

    Project createdProject = projectRepository.save(project);

    return ProjectConverter.toDto(createdProject);
  }

  @Tool("""
        Updates an existing project's information.
        Editable fields:
        - Name (must remain unique)
        - Color code
        Restrictions:
        - Cannot change company association
        - Project must exist in user's company
        """)
  public ProjectDto updateProject(
          @P("The authenticated user (for permission validation)") User user,
          @P("The project's unique identifier (UUID format)") String projectId,
          @P("""
                Updated project data containing:
                - name: New project name (optional)
                - color: New color code (optional)
                """) Project project
  ) {
    final Project existing = projectRepository.findByIdAndCompanyId(projectId, user.getCompanyId())
            .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));

    existing.setName(project.getName() != null ? project.getName() : existing.getName());
    existing.setColor(project.getColor() != null ? project.getColor() : existing.getColor());
    existing.setMustBeOnPremises(project.getMustBeOnPremises() != null ? project.getMustBeOnPremises() : existing.getMustBeOnPremises());

    Project updatedProject = projectRepository.save(existing);
    return ProjectConverter.toDto(updatedProject);
  }

  @Tool("""
        Permanently deletes a project and all associated assignments.
        Critical impacts:
        - All employee assignments to this project will be removed
        - Historical data referencing this project will be affected
        - Operation cannot be undone
        Requirements:
        - Project must exist in user's company
        """)
  public void removeProject(
        @P("The authenticated user (for company validation)") User user,
        @P("The project's unique identifier (UUID format)") String projectId
  ) {
    final Project existing = projectRepository.findByIdAndCompanyId(projectId, user.getCompanyId())
            .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));
    projectRepository.delete(existing);
  }
}
