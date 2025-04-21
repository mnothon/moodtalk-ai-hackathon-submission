import {Component} from '@angular/core';

import {Store} from '@ngrx/store';

import {ActivatedRoute} from '@angular/router';
import {AppState} from '../shared/state/app.state';
import {
  createEmployee,
  createProject,
  loadEmployees,
  loadProjects, removeEmployee, removeProject,
  updateEmployee, updateProject
} from '../shared/state/data/data.actions';
import {
  EmployeeDto,
  EmployeePagedResponse,
  EmployeeProperties,
  ProjectDto,
  ProjectProperties,
  ProjectsPagedResponse
} from '../../generated';
import {
  isLoadingEmployees,
  selectPagedEmployees,
  selectPagedProjects,
} from '../shared/state/data/data.selectors';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EmployeeComponent} from './employee/employee.component';
import {ProjectComponent} from './project/project.component';
import {pageSize} from "../shared/state/data/data.reducers";

export enum ModalState {
    CREATE = 'create',
    EDIT = 'edit'
}

export interface EmployeeModalData {
    mode: ModalState;
    employee?: EmployeeDto;
}

export interface ProjectModalData {
    mode: ModalState;
    project?: ProjectDto;
}

export interface PagedRequest {
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  showIntegrations = false;

  pagedEmployees: EmployeePagedResponse = {
    results: [],
    totalItems: 0,
    totalPages: 0,
    pageSize: pageSize,
    currentPage: 1
  };
  pagedProjects: ProjectsPagedResponse = {
    results: [],
    totalItems: 0,
    totalPages: 0,
    pageSize: pageSize,
    currentPage: 1
  };
  employeesRequest: PagedRequest = {
    page: this.pagedEmployees.currentPage - 1,
    pageSize: this.pagedEmployees.pageSize
  };
  projectsRequest: PagedRequest = {
    page: this.pagedProjects.currentPage - 1,
    pageSize: this.pagedProjects.pageSize
  };

  isLoadingProjects$ = this.store.selectSignal(isLoadingEmployees)
  isLoadingEmployees$ = this.store.selectSignal(isLoadingEmployees)

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.store.dispatch(loadEmployees({
      request: this.employeesRequest
    }));
    this.store.dispatch(loadProjects({
      request: this.projectsRequest
    }));

    this.store.select(selectPagedEmployees).subscribe((employees) => {
      this.pagedEmployees = employees;
    });
    this.store.select(selectPagedProjects).subscribe((projects) => {
      this.pagedProjects = projects;
    });
  }

  createEmployee() {
    const modalRef = this.modalService.open(EmployeeComponent);
    modalRef.componentInstance.employeeData = { mode: ModalState.CREATE };

    modalRef.result.then((employee) => {
      this.store.dispatch(createEmployee({employee}));
    });
  }
  
  editEmployee(employee: EmployeeDto) {
    const modalRef = this.modalService.open(EmployeeComponent);
    modalRef.componentInstance.employeeData = { mode: ModalState.EDIT, employee };


    modalRef.result.then((result: EmployeeProperties) => {
        this.store.dispatch(updateEmployee({ id: employee.id.toString(), employee: result }));
    });
    
  }

  changeProjectsPage(page: number) {
      this.store.dispatch(loadProjects({
        request: {
          ...this.projectsRequest,
          page: page - 1,
        }
      }))
  }

  changeEmployeesPage(page: number) {
      this.store.dispatch(loadEmployees({
        request: {
          ...this.employeesRequest,
          page: page - 1,
        }
      }))
  }
  
  deleteEmployee(employee: EmployeeDto) {
    this.store.dispatch(removeEmployee({ id: employee.id.toString() }));
  }
  

  createProject() {
    const modalRef = this.modalService.open(ProjectComponent);
    modalRef.componentInstance.projectData = { mode: ModalState.CREATE };

    modalRef.result.then((project) => {
      this.store.dispatch(createProject({project}));
    });
  }
  
  editProject(project: ProjectDto) {
    const modalRef = this.modalService.open(ProjectComponent);
    modalRef.componentInstance.projectData = { mode: ModalState.EDIT, project };

    modalRef.result.then((result) => {
      const updatedProject: ProjectProperties = {
        name: result.name,
        color: result.color,
        mustBeOnPremises: result.mustBeOnPremises
      }
      this.store.dispatch(updateProject({id: project.id.toString(), project: updatedProject}));
    });
  }

  deleteProject(project: ProjectDto) {
    this.store.dispatch(removeProject({ id: project.id.toString() }));
  }

  protected readonly pageSize = pageSize;
}
