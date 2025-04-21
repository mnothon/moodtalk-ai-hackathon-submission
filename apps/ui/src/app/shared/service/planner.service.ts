import {Inject, Injectable, LOCALE_ID} from '@angular/core';

import {Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {
  AssignmentDto, AssignmentProperties, AssistantMessageDto, AssistantMessageProperties,
  EmployeeDto, EmployeePagedResponse,
  EmployeeProperties,
  LanguageDto,
  PlannerStub,
  ProjectDto,
  ProjectProperties, ProjectsPagedResponse
} from '../../../generated';
import {JwtAuthService} from '../../auth/jwt-auth.service';
import {AssignmentRequest} from "../../planner/planner.models";
import {PagedRequest} from "../../settings/settings.component";

@Injectable({
  providedIn: 'root'
})
export class PlannerService {
  constructor(private plannerStub: PlannerStub,
    private authService: JwtAuthService,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  public removeEmployee(id: string): Observable<void> {
    return this.authService.assertLoggedIn().pipe(switchMap(() => this.plannerStub.removeEmployee(id)));
  }

  putLanguage(lang: LanguageDto): Observable<void> {
    return this.authService.assertLoggedIn().pipe(switchMap(() => this.plannerStub.putLanguage(lang)));
  }

  getEmployees(request: PagedRequest): Observable<EmployeePagedResponse> {
    return this.authService.assertLoggedIn().pipe(switchMap(() => this.plannerStub.getEmployees(request.page, request.pageSize)));
  }

  createEmployee(properties: EmployeeProperties): Observable<EmployeeDto> {
    return this.authService.assertLoggedIn().pipe(switchMap(() => this.plannerStub.createEmployee(properties)));
  }

  updateEmployee(id: string, properties: EmployeeProperties): Observable<EmployeeDto> {
    return this.authService.assertLoggedIn().pipe(switchMap(() => this.plannerStub.updateEmployee(id, properties)));
  }

  getProjects(request: PagedRequest): Observable<ProjectsPagedResponse> {
    return this.authService.assertLoggedIn().pipe(switchMap(() => this.plannerStub.getProjects(request.page, request.pageSize)));
  }

  createProject(properties: ProjectProperties): Observable<ProjectDto> {
    return this.authService.assertLoggedIn().pipe(switchMap(() => this.plannerStub.createProject(properties)));
  }

  updateProject(id: string, properties: ProjectProperties): Observable<ProjectDto> {
    return this.authService.assertLoggedIn().pipe(switchMap(() => this.plannerStub.updateProject(id, properties)));
  }
  
  removeProject(id: string): Observable<void> {
    return this.authService.assertLoggedIn().pipe(switchMap(() => this.plannerStub.removeProject(id)));
  }
  
  getAssignments(request: AssignmentRequest): Observable<AssignmentDto[]> {
    const startDate = request.startDate.toISOString().split('T')[0];
    const endDate = request.endDate.toISOString().split('T')[0];
      return this.authService.assertLoggedIn().pipe(switchMap(() => this.plannerStub.getAssignments(
          startDate,
          endDate,
          request.employeeId,
          request.projectId
      )));
  }
  
  createAssignment(properties: AssignmentProperties): Observable<AssignmentDto> {
    return this.authService.assertLoggedIn().pipe(switchMap(() => this.plannerStub.saveAssignment(properties)));
  }
  
  removeAssignment(id: string): Observable<void> {
    return this.authService.assertLoggedIn().pipe(switchMap(() => this.plannerStub.deleteAssignment(id)));
  }

  sendBotMessage(message: AssistantMessageProperties): Observable<AssistantMessageDto> {
    return this.authService.assertLoggedIn().pipe(switchMap(() => this.plannerStub.chat(message)));
  }
}
