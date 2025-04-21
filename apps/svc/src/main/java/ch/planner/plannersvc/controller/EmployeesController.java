package ch.planner.plannersvc.controller;

import ch.planner.plannersvc.api.EmployeesApi;
import ch.planner.plannersvc.auth.IsUser;
import ch.planner.plannersvc.auth.SessionState;
import ch.planner.plannersvc.auth.WithSessionState;
import ch.planner.plannersvc.controller.converter.EmployeeConverter;
import ch.planner.plannersvc.dto.*;
import ch.planner.plannersvc.dto.EmployeeDto;
import ch.planner.plannersvc.dto.EmployeeProperties;

import ch.planner.plannersvc.model.Employee;
import ch.planner.plannersvc.service.EmployeeService;
import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@WithSessionState
@AllArgsConstructor
public class EmployeesController implements EmployeesApi {

  private final SessionState sessionState;
  private final EmployeeService employeeService;

  @Override
  @IsUser
  public ResponseEntity<EmployeeDto> createEmployee(EmployeeProperties employeeProperties) {
    final Employee employee = EmployeeConverter.fromProperties(employeeProperties);

    final EmployeeDto saved = employeeService.createEmployee(sessionState.getUser(), employee);

    return ResponseEntity.ok(saved);
  }

  @Override
  @IsUser
  public ResponseEntity<EmployeePagedResponse> getEmployees(Optional<Integer> page, Optional<Integer>  pageSize) {
    final EmployeePagedResponse employees = employeeService.getEmployees(sessionState.getUser(), page, pageSize);

    return ResponseEntity.ok(employees);
  }

  @Override
  @IsUser
  public ResponseEntity<EmployeeDto> updateEmployee(String employeeId, EmployeeProperties employeeProperties) {
    final Employee employee = EmployeeConverter.fromProperties(employeeProperties);

    final EmployeeDto updated = employeeService.updateEmployee(sessionState.getUser(), employeeId, employee);
    return ResponseEntity.ok(updated);
  }

    @Override
    @IsUser
    public ResponseEntity<Void> removeEmployee(String employeeId) {
        employeeService.removeEmployee(sessionState.getUser(), employeeId);
        return ResponseEntity.noContent().build();
    }
}
