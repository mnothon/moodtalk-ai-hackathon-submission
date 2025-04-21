import {Component, OnDestroy} from '@angular/core';

import {Store} from '@ngrx/store';
import {AppState} from '../shared/state/app.state';
import {
  createAssignment,
  deleteAssignment,
  loadAssignments,
  loadEmployees,
  loadProjects
} from '../shared/state/data/data.actions';
import {AssignmentDto, AssignmentProperties, EmployeePagedResponse, ProjectDto} from '../../generated';
import {
  selectAssignments,
  selectPagedEmployees,
  selectProjects
} from '../shared/state/data/data.selectors';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PagedRequest} from "../settings/settings.component";
import {interval, Subscription} from "rxjs";

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnDestroy {
  pageSize = 10
  pollingInterval = 10000;
  pollingSubscription!: Subscription;


  pagedEmployees: EmployeePagedResponse = {
    results: [],
    totalItems: 0,
    totalPages: 0,
    pageSize: this.pageSize,
    currentPage: 1
  };

  projects: ProjectDto[] = [];
  assignments: AssignmentDto[] = [];
  employeesRequest: PagedRequest = {
    page: this.pagedEmployees.currentPage - 1,
    pageSize: this.pageSize
  };
  projectsRequest: PagedRequest = {
    page: 0,
    pageSize: 100
  };

  currentDate = new Date();

  constructor(
    private store: Store<AppState>,
    private modalService: NgbModal
  ) {
    this.store.dispatch(loadEmployees({
      request: this.employeesRequest
    }));
    this.store.dispatch(loadProjects({
      request: this.projectsRequest
    }));
    this.loadAssignmentsForWeek();

    this.store.select(selectPagedEmployees).subscribe((pagedEmployees) => {
      this.pagedEmployees = pagedEmployees;
    });
    this.store.select(selectProjects).subscribe((projects) => {
      this.projects = projects;
    });
    this.store.select(selectAssignments).subscribe((assignments) => {
      this.assignments = assignments;
    });

    this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  getProjectColor(projectId: string | null | undefined): string {
    const project = this.projects.find(p => p.id === projectId);
    return project?.color ? `${project.color}30` : '';
  }

  private startPolling(): void {
    this.stopPolling();
    this.pollingSubscription = interval(this.pollingInterval).subscribe(() => {
      this.loadAssignmentsForWeek();
    });
  }

  private stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  changePage(page: number) {
    this.store.dispatch(loadEmployees({
      request: {
        ...this.employeesRequest,
        page: page - 1,
      }
    }))
  }


  previousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.loadAssignmentsForWeek();
  }

  nextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.loadAssignmentsForWeek();
  }

  getAssignment(employeeId: string, date: Date): AssignmentDto | undefined {
    return this.assignments.find(a =>
        a.employeeId === employeeId &&
        a.date === date.toISOString().split('T')[0]
    );
  }

  isWeekend(dayIndex: number): boolean {
    return dayIndex === 5 || dayIndex === 6;
  }

  updateAssignment(employeeId: string, date: Date, projectId: string | null) {
    if (projectId) {
      const assignment = {
        employeeId: employeeId,
        date: date.toISOString().split('T')[0],
        projectId: projectId
      } as AssignmentProperties
      this.store.dispatch(createAssignment({assignment: assignment}))
    } else {
      const assignment = this.assignments.find(assignment => {
        return assignment.employeeId === employeeId && assignment.date === date.toISOString().split('T')[0];
      })
      if (assignment) {
        this.store.dispatch(deleteAssignment({id: assignment.id.toString()}))
      }
    }
  }

  nthDayOfWeek = (n: number) => {
    const cd = this.currentDate;
    const d = new Date(Date.UTC(cd.getFullYear(), cd.getMonth(), cd.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 1 - dayNum);
    d.setUTCDate(d.getUTCDate() + n);
    return d;
  };

  getWeekNumber(): number {
    const cd = this.currentDate;
    const d = new Date(Date.UTC(cd.getFullYear(), cd.getMonth(), cd.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }
  
  private loadAssignmentsForWeek() {
    const startDate = this.getMonday(this.currentDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    this.store.dispatch(loadAssignments({
        request: {
            startDate: startDate,
            endDate: endDate
        }
    }))
  }
  
  private getMonday(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }
}
