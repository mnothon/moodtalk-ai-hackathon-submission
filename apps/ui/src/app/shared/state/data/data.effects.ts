import {Inject, Injectable, LOCALE_ID} from '@angular/core';

import {Actions, concatLatestFrom, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap} from 'rxjs/operators';
import {LanguageDto} from '../../../../generated';
import {WINDOW} from '../../../app.config';
import {
    addOrUpdateAssignment,
    addOrUpdateEmployee,
    addOrUpdateProject,
    createAssignment,
    createEmployee,
    createProject,
    deleteAssignment,
    loadAssignments,
    loadAssignmentsDone,
    loadEmployees,
    loadEmployeesDone,
    loadProjects,
    loadProjectsDone,
    networkError,
    removeAssignmentFromState,
    removeEmployee,
    removeProject,
    setUser,
    setUserRedirectDone,
    updateEmployee,
    updateProject,
    sendBotMessage,
    sendBotMessageDone
} from './data.actions';
import {PlannerService} from '../../service/planner.service';
import {ToastService} from '../../../toast.service';
import {of, tap} from 'rxjs';
import {Store} from "@ngrx/store";
import {selectEmployeeRequest} from "./data.selectors";
import {Sender} from "../../../assistant/chat-assistant.component";
import {getCurrentTimeStampAsString, randomAlphanumeric} from "../../utils";

@Injectable()
export class DataEffects {


    networkError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(networkError),
      tap((action) => {
        this.toastService.showError(action.errorInfo);
      })
    )
    );
    
    loadEmployees$ = createEffect(() =>
        this.actions$.pipe(
          ofType(loadEmployees),
          switchMap((action) =>
            this.plannerService.getEmployees(action.request).pipe(
              map((employees) => loadEmployeesDone({employees})),
              catchError(() =>
                of(networkError({errorInfo: $localize`:@@error.load-employees:Employees could not be loaded.`}))
              )
            )
          )
        )
    );
    
    createEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createEmployee),
      concatLatestFrom(()=> this.store.select(selectEmployeeRequest)),
      switchMap(([action, request]) =>
        this.plannerService.createEmployee(action.employee).pipe(
          map((employee) => loadEmployees({request})),
          catchError(() =>
            of(
              networkError({errorInfo: $localize`:@@error.create-employees:Employee could not be created.`})
            )
          )
        )
      )
    )
    );
    
    updateEmployee$ = createEffect(() =>
    this.actions$.pipe(
        ofType(updateEmployee),
        switchMap((action) =>
            this.plannerService.updateEmployee(action.id, action.employee).pipe(
            map((employee) => addOrUpdateEmployee({employee})),
            catchError(() =>
                of(
                networkError({errorInfo: $localize`:@@error.update-employees:Employee could not be updated.`})
                )
            ))
        )
    )
    );
    
    removeEmployee$ = createEffect(() =>
    this.actions$.pipe(
        ofType(removeEmployee),
        concatLatestFrom(()=> this.store.select(selectEmployeeRequest)),
        switchMap(([action, request]) =>
            this.plannerService.removeEmployee(action.id).pipe(
            map(() => loadEmployees({request})),
            catchError(() =>
                of(networkError({errorInfo: $localize`:@@error.remove-employees:Employee could not be removed.`}))
            )
            )
        )
    )
    );
    
    loadProjects$ = createEffect(() =>
        this.actions$.pipe(
          ofType(loadProjects),
          switchMap((action) =>
            this.plannerService.getProjects(action.request).pipe(
              map((projects) => loadProjectsDone({projects})),
              catchError(() =>
                of(networkError({errorInfo: $localize`:@@error.load-projects:Projects could not be loaded.`}))
              )
            )
          )
        )
    );
    
    createProjects$ = createEffect(() =>
    this.actions$.pipe(
        ofType(createProject),
        concatLatestFrom(()=> this.store.select(selectEmployeeRequest)),
          switchMap(([action, request]) =>
            this.plannerService.createProject(action.project).pipe(
              map((project) => loadProjects({request})),
              catchError(() =>
                of(networkError({errorInfo: $localize`:@@error.create-project:Project could not be created.`}))
              )
            )
          )
    )
    );
  
    updateProject$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateProject),
            switchMap((action) =>
                this.plannerService.updateProject(action.id, action.project).pipe(
                map((project) => addOrUpdateProject({project})),
                catchError(() =>
                    of(
                    networkError({errorInfo: $localize`:@@error.update-project:Project could not be updated.`})
                    )
                ))
            )
        )
    );
    
    removeProject$ = createEffect(() => 
        this.actions$.pipe(
            ofType(removeProject),
            concatLatestFrom(()=> this.store.select(selectEmployeeRequest)),
            switchMap(([action, request]) =>
                this.plannerService.removeProject(action.id).pipe(
                map(() => loadProjects({request})),
                catchError(() =>
                    of(networkError({errorInfo: $localize`:@@error.remove-project:Project could not be removed.`}))
                ))
            )   
        )
    );
    
    loadAssignments$ = createEffect(() => 
        this.actions$.pipe(
            ofType(loadAssignments),
            switchMap((action) =>
                this.plannerService.getAssignments(action.request).pipe(
                    map((response) => loadAssignmentsDone({ assignments: response })),
                    catchError(() =>
                        of(networkError({errorInfo: $localize`:@@error.load-assignments:Assignments could not be loaded.`}))
                    )
                )
            )
    ));
        
    createAssignment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(createAssignment),
            switchMap((action) =>
                this.plannerService.createAssignment(action.assignment).pipe(
                    map((assignment) => addOrUpdateAssignment({assignment})),
                    catchError(() =>
                        of(
                            networkError({
                                errorInfo: $localize`:@@error.create-assignment:Assignment could not be created.`
                            })
                        )
                    )
                )
            )
        )
    );


    deleteAssignment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteAssignment),
            switchMap((action) =>
                this.plannerService.removeAssignment(action.id).pipe(
                    map(() => removeAssignmentFromState({id: action.id})),
                    catchError(() =>
                        of(
                            networkError({
                                errorInfo: $localize`:@@error.delete-assignment:Assignment could not be deleted.`
                            })
                        )
                    )
                )
            )
        )
    );

    sendBotMessage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(sendBotMessage),
            switchMap((action) =>
                this.plannerService.sendBotMessage(action.message).pipe(
                    map((botResponse) => sendBotMessageDone({botResponse})),
                    catchError(() =>
                        of(sendBotMessageDone({
                            botResponse: {
                                message: "Sorry, I encountered an error. Please try again later.",
                                sender: Sender.BOT,
                                timestamp: getCurrentTimeStampAsString(),
                                id: randomAlphanumeric(10)
                            }
                        }))
                    )
                )
            )
        )
    );

    
    setUserRedirect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setUser),
      map((action) => {
        const userLocale = (action.user?.language || LanguageDto.De).toLowerCase();
        if (this.locale.indexOf(userLocale) > -1) {
          // eslint-disable-next-line no-console
          console.info('User locale', userLocale, 'present in current locale', this.locale);
          return setUserRedirectDone();
        }
    
        // Make sure we have the locale in the current path
        if (this.window.location.href.indexOf('/' + this.locale.substring(0, 2) + '/') > -1) {
          // eslint-disable-next-line no-console
          console.info(
            'Replacing locale',
            this.locale.substring(0, 2),
            'with ',
            userLocale,
            'in',
            this.window.location.href
          );
    
          // Redirect to the user's language
          this.window.location.href = this.window.location.href.replace(
            '/' + this.locale.substring(0, 2) + '/',
            '/' + userLocale + '/'
          );
        }
    
        // eslint-disable-next-line no-console
        console.info('Done redirecting for user locale', userLocale, 'Href is now', this.window.location.href);
    
        return setUserRedirectDone();
      })
    )
    );
    
    constructor(
    private actions$: Actions,
    private plannerService: PlannerService,
    private toastService: ToastService,
    private store: Store,
    @Inject(WINDOW) private window: Window,
    @Inject(LOCALE_ID) private locale: string
    ) {}
}
