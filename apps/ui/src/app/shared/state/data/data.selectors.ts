import {createFeatureSelector, createSelector} from '@ngrx/store';

import {dataFeatureKey, DataState} from './data.reducers';

const selectDataFeature = createFeatureSelector<DataState>(dataFeatureKey);

export const selectUser = createSelector(selectDataFeature, (state) => state.user);

export const selectPagedEmployees = createSelector(selectDataFeature, (state) => state.employees);

export const selectEmployees = createSelector(selectDataFeature, (state) => state.employees.results);

export const isLoadingEmployees = createSelector(selectDataFeature, (state) => state.isLoadingEmployees);

export const selectEmployeeRequest = createSelector(selectDataFeature, (state) => state.employeeRequest);

export const selectPagedProjects = createSelector(selectDataFeature, (state) => state.projects);

export const isLoadingProjects = createSelector(selectDataFeature, (state) => state.isLoadingProjects);

export const selectProjects = createSelector(selectDataFeature, (state) => state.projects.results);

export const selectProjectRequest = createSelector(selectDataFeature, (state) => state.projectRequest);

export const selectAssignments = createSelector(selectDataFeature, (state) => state.assignments);

export const selectMessages = createSelector(selectDataFeature, (state) => state.messages);

export const selectIsWaitingForMessageResponse = createSelector(selectDataFeature, (state) => state.isWaitingForMessageResponse);