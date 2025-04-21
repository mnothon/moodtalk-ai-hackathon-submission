import {createReducer, on} from '@ngrx/store';

import {
  AssignmentDto, AssistantMessageProperties, EmployeeDto,
  EmployeePagedResponse,
  ProjectDto,
  ProjectsPagedResponse,
  UserDto
} from '../../../../generated';
import {
  addOrUpdateAssignment, addOrUpdateEmployee, addOrUpdateProject,
  loadAssignmentsDone, loadEmployees,
  loadEmployeesDone, loadProjects,
  loadProjectsDone, removeAssignmentFromState,
  sendBotMessage, sendBotMessageDone,
  setUser,
} from './data.actions';
import {PagedRequest} from "../../../settings/settings.component";
import {getCurrentTimeStampAsString} from "../../utils";
import {Sender} from "../../../assistant/chat-assistant.component";


export interface DataState {
  user?: UserDto;
  employees: EmployeePagedResponse;
  projects: ProjectsPagedResponse;
  assignments: AssignmentDto[];
  employeeRequest: PagedRequest;
  projectRequest: PagedRequest;
  isLoadingProjects: boolean;
  isLoadingEmployees: boolean;
  messages: AssistantMessageProperties[]
  isWaitingForMessageResponse: boolean;
}

export const dataFeatureKey = 'data';

export const pageSize = 5;

const initialMessage = {
  message: 'Hi! I am your chat assistant. How can I help you?',
  timestamp: getCurrentTimeStampAsString(),
  sender: Sender.BOT
}

const initialAppState: DataState = {
  user: undefined,
  employees: {
    totalPages: 0,
    totalItems: 0,
    currentPage: 1,
    pageSize: 0,
    results: []
  },
  projects: {
    totalPages: 0,
    totalItems: 0,
    currentPage: 1,
    pageSize: 0,
    results: []
  },
  employeeRequest: {
    page: 0,
    pageSize: pageSize
  },
  projectRequest: {
    page: 0,
    pageSize: pageSize
  },
  assignments: [],
  isLoadingProjects: false,
  isLoadingEmployees: false,
  messages: [initialMessage],
  isWaitingForMessageResponse: false
};

export const dataReducer = createReducer(
  initialAppState,
  on(setUser, (state, {user}) => {
    return {
      ...state,
      user: user ? {...user} : undefined
    };
  }),
  on(loadEmployees, (state, {request}) => {
    return {
      ...state,
      employeeRequest: request,
      isLoadingEmployees: true
    };
  }),
  on(loadEmployeesDone, (state, {employees}) => {
    return {
      ...state,
      employees: {...employees, currentPage: state.employeeRequest.page + 1},

      isLoadingEmployees: false
    };
  }),
  on(addOrUpdateEmployee, (state, { employee }) => {
    const employeeIndex = state.employees.results.findIndex(e => e.id === employee.id);

    if (employeeIndex === -1) {
      return state;
    }
    const results = [
      ...state.employees.results.slice(0, employeeIndex),
      employee,
      ...state.employees.results.slice(employeeIndex + 1)
    ];

    return {
      ...state,
      employees: {
        ...state.employees,
        results,
        totalItems: state.employees.totalItems,
        currentPage: state.employees.currentPage,
        totalPages: state.employees.totalPages
      }
    };
  }),
  on(loadProjects, (state, {request}) => {
    return {
      ...state,
      projectRequest: request,
      isLoadingProjects: true
    };
  }),
  on(loadProjectsDone, (state, {projects}) => {
    return {
      ...state,
      projects: { ...projects, currentPage: state.projectRequest.page + 1},
      isLoadingProjects: false
    };
  }),
  on(addOrUpdateProject, (state, {project}) => {
    return {
      ...state,
      projects: {
        ...state.projects,
        results: [...state.projects.results.filter((e: ProjectDto) => e.id !== project.id), project]
      }
    };
  }),
  on(loadAssignmentsDone, (state, {assignments}) => {
      return {
      ...state,
        assignments: assignments
      };
  }),
  on(addOrUpdateAssignment, (state, {assignment}) => {
    return {
      ...state,
      assignments: [...state.assignments.filter((a) => a.id !== assignment.id), assignment]
    };
  }),
  on(removeAssignmentFromState, (state, {id}) => {
    return {
      ...state,
      assignments: [...state.assignments.filter((a) => a.id !== id)]
    };
  }),
  on(sendBotMessage, (state, {message}) => {
    return {
      ...state,
      messages: [...state.messages, message],
      isWaitingForMessageResponse: true
    };
  }),
  on(sendBotMessageDone, (state, {botResponse}) => {
    const message: AssistantMessageProperties = {
      message: botResponse.message,
      timestamp: botResponse.timestamp,
      sender: botResponse.sender,
    }
    return {
      ...state,
      messages: [...state.messages, message],
      isWaitingForMessageResponse: false
    };
  })
);
