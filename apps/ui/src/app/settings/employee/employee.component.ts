import {Component, Input, ViewChild} from '@angular/core';

import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalComponent} from '../../shared/components/modal/modal.component';
import {EmployeeDto, EmployeeProperties} from '../../../generated';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {EmployeeModalData, ModalState} from "../settings.component";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html'
})
export class EmployeeComponent {
  @ViewChild('modal') modal!: ModalComponent;
  mode: ModalState = ModalState.CREATE;
  employee?: EmployeeDto;

  workLocationOptions = [
    { value: true, label: 'Remote' },
    { value: false, label: 'In Office' }
  ];

  @Input()
  set properties(p: EmployeeProperties) {
    this.nameFormControl.setValue(p.name);
    this.surnameFormControl.setValue(p.surname);
    this.emailFormControl.setValue(p.email);
    this.remoteFormControl.setValue(p.worksRemotely);
  }

  constructor(public activeModal: NgbActiveModal) {}

  @Input()
  set employeeData(data: EmployeeModalData) {
    this.mode = data.mode;
    if (data.employee) {
      this.employee = data.employee;
      this.nameFormControl.setValue(data.employee.name);
      this.surnameFormControl.setValue(data.employee.surname);
      this.emailFormControl.setValue(data.employee.email);
      this.remoteFormControl.setValue(data.employee.worksRemotely || false);
    }
  }

  get title(): string {
    return this.mode === ModalState.CREATE ? 'Add Employee' : 'Edit Employee';
  }

  get submitButtonText(): string {
    return this.mode === ModalState.CREATE ? 'Add' : 'Update';
  }

  nameFormControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)]
  });

  surnameFormControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)]
  });

  emailFormControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email]
  });

  remoteFormControl = new FormControl<boolean>(false, {
    nonNullable: true
  });

  employeeFormGroup = new FormGroup({
    name: this.nameFormControl,
    surname: this.surnameFormControl,
    email: this.emailFormControl,
    worksRemotely: this.remoteFormControl
  });

  private isSubmittable(): boolean {
    if (!this.employeeFormGroup.valid) {
      return false;
    }
    if (this.mode === ModalState.CREATE) {
      return true;
    } else {
      if (!this.employee) return false;

      const currentFormValue = this.employeeFormGroup.getRawValue();

      const nameChanged = currentFormValue.name !== this.employee.name;
      const surnameChanged = currentFormValue.surname !== this.employee.surname;
      const emailChanged = currentFormValue.email !== this.employee.email;
      const remoteChanged = currentFormValue.worksRemotely !== this.employee.worksRemotely;

      return nameChanged || surnameChanged || emailChanged || remoteChanged;
    }
  }

  isDisabled(): boolean {
    return !this.isSubmittable();
  }

  submit() {
    if (this.isSubmittable()) {
      this.modal.save({
        name: this.nameFormControl.value,
        surname: this.surnameFormControl.value,
        email: this.emailFormControl.value,
        worksRemotely: this.remoteFormControl.value
      });
    }
  }
}
