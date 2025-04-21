package ch.planner.plannersvc.controller.converter;

import ch.planner.plannersvc.dto.EmployeeDto;
import ch.planner.plannersvc.dto.EmployeeProperties;
import ch.planner.plannersvc.model.Employee;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class EmployeeConverter {

  public static List<EmployeeDto> toDtos(List<Employee> employees) {
    if (employees == null) {
      return null;
    }

    return employees.stream().map(EmployeeConverter::toDto).filter(Objects::nonNull).collect(Collectors.toList());
  }

  public static EmployeeDto toDto(Employee employee) {
    if (employee == null) {
      return null;
    }

    return new EmployeeDto()
            .id(employee.getId())
            .name(employee.getName())
            .surname(employee.getSurname())
            .worksRemotely(employee.getWorksRemotely())
            .email(employee.getEmail());
  }

  public static Employee fromProperties(EmployeeProperties properties) {
    if (properties == null) {
      return null;
    }

    return Employee.builder()
            .name(properties.getName())
            .surname(properties.getSurname())
            .email(properties.getEmail())
            .worksRemotely(properties.getWorksRemotely())
            .build();
  }
}
