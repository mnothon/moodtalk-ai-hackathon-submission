import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {NgbAccordionModule, NgbDatepickerModule, NgbModule, NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxEchartsModule} from 'ngx-echarts';
import * as echarts from 'echarts';

import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr-CH';
import localeIt from '@angular/common/locales/it-CH';
import localeDe from '@angular/common/locales/de-CH';
import localeEn from '@angular/common/locales/en';
import {LottieModule} from 'ngx-lottie';
import player from 'lottie-web';
import {ApiModule, Configuration} from '../generated';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DataEffects} from './shared/state/data/data.effects';
import {dataFeatureKey, dataReducer} from './shared/state/data/data.reducers';
import {SettingsComponent} from './settings/settings.component';

import {LanguageSwitcherComponent} from './language-switcher/language-switcher.component';
import {getLocale} from './shared/utils';
import {LoadingDirective} from './shared/components/loading/loading.directive';
import {APP_CONFIG, AppConfig} from './app.config';
import {AuthModule} from './auth/auth.module';
import {ModalComponent} from './shared/components/modal/modal.component';
import {NavigationComponent} from './navigation/navigation.component';
import {UserInitialsComponent} from './shared/components/user-initials/user-initials.component';
import {NoUserFoundComponent} from './auth/no-user-found/no-user-found.component';
import {ToastsComponent} from './shared/components/toasts/toasts.component';
import {visualFeatureKey, visualReducer} from './shared/state/visual/visual.reducers';
import {UserNavigationComponent} from './navigation/user-navigation/user-navigation.component';
import {ButtonComponent} from './shared/components/button/button.component';
import {EmployeeComponent} from './settings/employee/employee.component';
import {FormErrorsComponent} from './shared/components/form-errors/form-errors.component';
import {ProjectComponent} from './settings/project/project.component';
import {PlannerComponent} from './planner/planner.component';
import {ChatAssistantComponent} from "./assistant/chat-assistant.component";
import {ColorChromeModule} from "ngx-color/chrome";
import {MarkdownToHtmlPipe} from "./shared/components/pipes/markdowntohtml.pipe";

registerLocaleData(localeDe);
registerLocaleData(localeFr);
registerLocaleData(localeIt);
registerLocaleData(localeEn);

// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
  return player;
}

export function getApiConfiguration(config: AppConfig): Configuration {
  return new Configuration({
    basePath: config.api.baseUrl,
    withCredentials: true
  });
}

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    PlannerComponent,
    LanguageSwitcherComponent,
    LoadingDirective,
    ModalComponent,
    NavigationComponent,
    ChatAssistantComponent,
    UserNavigationComponent,
    UserInitialsComponent,
    NoUserFoundComponent,
    ButtonComponent,
    EmployeeComponent,
    ProjectComponent,
    FormErrorsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    AuthModule.forRoot(),
    {
      ngModule: ApiModule,
      providers: [
        {
          provide: Configuration,
          useFactory: getApiConfiguration,
          deps: [APP_CONFIG]
        }
      ]
    },
    NgxEchartsModule.forRoot({
      echarts
    }),
    HttpClientModule,
    DragDropModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbAccordionModule,
    ColorChromeModule,
    MarkdownToHtmlPipe,
    StoreModule.forRoot({
      [dataFeatureKey]: dataReducer,
      [visualFeatureKey]: visualReducer
    }),
    EffectsModule.forRoot([DataEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      connectInZone: true
    }),
    ReactiveFormsModule,
    LottieModule.forRoot({player: playerFactory}),
    ToastsComponent
  ],
  providers: [{provide: LOCALE_ID, useValue: getLocale()},DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
