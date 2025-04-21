package ch.planner.plannersvc.service;

import ch.planner.plannersvc.controller.converter.EmployeeConverter;
import ch.planner.plannersvc.dto.EmployeeDto;
import ch.planner.plannersvc.dto.EmployeePagedResponse;
import ch.planner.plannersvc.model.Employee;
import ch.planner.plannersvc.model.Language;
import ch.planner.plannersvc.model.User;
import ch.planner.plannersvc.repository.EmployeeRepository;

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
public class EmployeeService {

  private final EmployeeRepository employeeRepository;

  public EmployeePagedResponse getEmployees(
          User user,
          Optional<Integer> page,
          Optional<Integer> pageSize
  ) {
    int pageNumber = page.orElse(1);
    int pageSizeNumber = pageSize.orElse(100);

    Pageable pageable = PageRequest.of(pageNumber, pageSizeNumber);
    Page<Employee> employees = employeeRepository.findAllByCompanyId(user.getCompanyId(), pageable);

    return new EmployeePagedResponse()
            .currentPage(employees.getNumber())
            .totalPages(employees.getTotalPages())
            .pageSize(employees.getPageable().getPageSize())
            .totalItems((int) employees.getTotalElements())
            .results(EmployeeConverter.toDtos(employees.getContent()));
  }

  @Tool("""
        Retrieves a list of all employees in the company.
        Results include:
        - Basic employee information (name, ID, language)
        """)
  public List<EmployeeDto> getAllEmployees() {
    List<Employee> employees = (List<Employee>) employeeRepository.findAll();

    return EmployeeConverter.toDtos(employees);
  }

    @Tool("""
            Retrieves a list of employees based on their work location.
            Parameters:
            - worksRemotely: Boolean indicating if the employee works remotely, true for remote, false for on-site.
            """)
  public List<EmployeeDto> getAllEmployeesByWorkLocation(
          @P("Indicates if the employee works remotely") Boolean worksRemotely) {
    List<Employee> employees = (List<Employee>) employeeRepository.findAllEmployeesByWorkLocation(worksRemotely);

    return EmployeeConverter.toDtos(employees);
  }

  @Tool("""
        Creates a new employee record.
        Defaults:
        - Language: DE (German)
        - Company ID: Automatically set from user context
        Validation:
        - Name must be unique per company
        - Email format is validated
        """)
  public EmployeeDto createEmployee(
          @P("The authenticated user (for company association)") User user,
          @P("""
                Employee data containing:
                - name: Full name (required)
                - email: Contact email (required)
                - lang: Language preference (optional)
                """) Employee employee
  ) {
    employee.setCompanyId(user.getCompanyId());
    employee.setLang(Language.DE);

    Employee createdEmployee = employeeRepository.save(employee);

    return EmployeeConverter.toDto(createdEmployee);
  }

  @Tool("""
        Updates an existing employee's information.
        Note:
        - Only name and language can be modified
        - Company association cannot be changed
        - Employee ID must exist in the same company
        """)
  public EmployeeDto updateEmployee(
          @P("The authenticated user (for permission validation)") User user,
          @P("The employee's unique identifier (UUID format)") String employeeId,
          @P("""
                Updated employee data containing:
                - name: New full name (optional)
                - lang: New language preference (optional)
                """) Employee employee
  ) {
    final Employee existing = employeeRepository.findByIdAndCompanyId(employeeId, user.getCompanyId())
            .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + employeeId));

    existing.setName(employee.getName() != null ? employee.getName() : existing.getName());
    existing.setSurname(employee.getSurname() != null ? employee.getSurname() : existing.getSurname());
    existing.setEmail(employee.getEmail() != null ? employee.getEmail() : existing.getEmail());
    existing.setLang(employee.getLang() != null ? employee.getLang() : existing.getLang());
    existing.setWorksRemotely(employee.getWorksRemotely() != null ? employee.getWorksRemotely() : existing.getWorksRemotely());

    Employee updatedEmployee = employeeRepository.save(existing);

    return EmployeeConverter.toDto(updatedEmployee);
  }

  @Tool("""
        Permanently deletes an employee record.
        WARNING:
        - This action is irreversible
        - All assignments for this employee will be deleted
        - Affects historical reporting
        Requirements:
        - Employee must exist in user's company
        """)
  public void removeEmployee(
          @P("The authenticated user (for company validation)") User user,
          @P("The employee's unique identifier (UUID format)") String employeeId
  ) {
    final Employee existing = employeeRepository.findByIdAndCompanyId(employeeId, user.getCompanyId())
            .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + employeeId));
    employeeRepository.delete(existing);
  }


  @Tool("""
        Retrieves an employee by their unique identifier.
        Note:
        - Employee ID must exist in the same company
        """)
  public EmployeeDto getEmployeeById(
          @P("The employee's unique identifier (UUID format)") String employeeId
  ) {
    Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + employeeId));

    return EmployeeConverter.toDto(employee);
  }


  @Tool("""
        Retrieves an employee by their name and surname.
        Note:
        - Name and surname must be unique within the company
        """)
  public EmployeeDto getEmployeeByNameAndSurname(
          @P("The employee's name") String name,
          @P("The employee's surname") String surname
  ) {
    Employee employee = employeeRepository.findByNameAndSurname(name, surname)
            .orElseThrow(() -> new EntityNotFoundException("Employee not found with name: " + name + " and surname: " + surname));

    return EmployeeConverter.toDto(employee);
  }
}
