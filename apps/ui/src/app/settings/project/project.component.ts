import {Component, Input, ViewChild} from '@angular/core';

import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalComponent} from '../../shared/components/modal/modal.component';
import {ProjectDto, ProjectProperties} from '../../../generated';
import {ModalState, ProjectModalData} from "../settings.component";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ColorEvent} from "ngx-color";



@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  @ViewChild('modal') modal!: ModalComponent;
  mode: ModalState = ModalState.CREATE;
  project?: ProjectDto;
  showColorPicker = false;
  workLocationOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ];


  @Input()
  set properties(p: ProjectProperties) {
    this.nameFormControl.setValue(p.name);
    this.colorFormControl.setValue(p.color || '#3f51b5');
    this.remoteFormControl.setValue(p.mustBeOnPremises || false);
  }
  
  constructor(public activeModal: NgbActiveModal) {}
  
  @Input()
    set projectData(data: ProjectModalData) {
        this.mode = data.mode;
        if (data.project) {
          this.project = data.project;
          this.nameFormControl.setValue(data.project.name);
          this.colorFormControl.setValue(data.project.color);
          this.remoteFormControl.setValue(data.project.mustBeOnPremises || false);
        }
    }
    
  get title(): string {
    return this.mode === ModalState.CREATE ? 'Add Project' : 'Edit Project';
  }
  
  get submitButtonText(): string {
      return this.mode === ModalState.CREATE ? 'Add' : 'Update';
  }

  nameFormControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)]
  });

  colorFormControl = new FormControl<string>('#3f51b5', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)]
  });

  remoteFormControl = new FormControl<boolean>(false, {
    nonNullable: true
  });

  isDisabled(): boolean {
    return !this.isSubmittable();
  }

  private isSubmittable(): boolean {
    if (!this.projectFormGroup.valid) {
      return false;
    }
    if (this.mode === ModalState.CREATE) {
      return true;
    } else {
      if (!this.project) return false;

      const nameChanged = this.nameFormControl.value !== this.project.name;
      const colorChanged = this.colorFormControl.value !== this.project.color;
      const remoteChanged = this.remoteFormControl.value !== this.project.mustBeOnPremises;
      return nameChanged || colorChanged || remoteChanged;
    }
  }

  onColorChange($event: ColorEvent) {
    this.colorFormControl.setValue($event.color.hex);
  }

  projectFormGroup = new FormGroup({
    name: this.nameFormControl,
    color: this.colorFormControl,
    mustBeOnPremises: this.remoteFormControl
  });

  addProject() {
    if (this.isSubmittable()) {
      this.modal.save({
        name: this.nameFormControl.value,
        color: this.colorFormControl.value,
        mustBeOnPremises: this.remoteFormControl.value
      });
    }
  }
}
