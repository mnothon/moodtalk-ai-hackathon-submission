import {createAction, props} from '@ngrx/store';
import {
    AssignmentDto, AssignmentProperties, AssistantMessageDto, AssistantMessageProperties,
    EmployeeDto, EmployeePagedResponse,
    EmployeeProperties,
    ProjectDto,
    ProjectProperties, ProjectsPagedResponse,
    UserDto
} from '../../../../generated';
import {AssignmentRequest} from "../../../planner/planner.models";
import {PagedRequest} from "../../../settings/settings.component";
import {MessagesRequest} from "../../../assistant/chat-assistant.component";

export const setUser = createAction('Set User [Direct]', props<{user: UserDto | undefined}>());
export const setUserRedirectDone = createAction('Set User Redirect Done');

export const loadEmployees = createAction('Load Employees', props<{request: PagedRequest}>());
export const loadEmployeesDone = createAction('Load Employees [Done]', props<{employees: EmployeePagedResponse}>());
export const createEmployee = createAction('Create Employee', props<{employee: EmployeeProperties}>());
export const updateEmployee = createAction('Update Employee', props<{id: string; employee: EmployeeProperties}>());
export const removeEmployee = createAction('Remove Employee', props<{id: string}>());
export const addOrUpdateEmployee = createAction('Add or update Employee', props<{employee: EmployeeDto}>());

export const loadProjects = createAction('Load Projects', props<{request: PagedRequest}>());
export const loadProjectsDone = createAction('Load Projects [Done]', props<{projects: ProjectsPagedResponse}>());
export const createProject = createAction('Create Project', props<{project: ProjectProperties}>());
export const updateProject = createAction('Update Project', props<{id: string; project: ProjectProperties}>());
export const removeProject = createAction('Remove Project', props<{id: string}>());
export const addOrUpdateProject = createAction('Add or update Project', props<{project: ProjectDto}>());

export const networkError = createAction('Network Error occurred', props<{errorInfo: string}>());

export const loadAssignments = createAction('Load Assignments', props<{ request: AssignmentRequest }>());
export const loadAssignmentsDone = createAction('Load Assignments [Done]', props<{ assignments: AssignmentDto[] }>());
export const createAssignment = createAction('Create Assignment', props<{ assignment: AssignmentProperties }>());
export const deleteAssignment = createAction('Delete Assignment', props<{ id: string }>());
export const removeAssignmentFromState = createAction('Remove Assignment from State', props<{ id: string }>());
export const addOrUpdateAssignment = createAction('Add or update Assignment', props<{ assignment: AssignmentDto }>());

export const loadBotMessages = createAction('Load Bot Messages', props<{ request: MessagesRequest }>());
export const sendBotMessage = createAction('Send Bot Message', props<{ message: AssistantMessageProperties }>());
export const sendBotMessageDone = createAction('Send Bot Message [Done]', props<{ botResponse: AssistantMessageDto }>());
