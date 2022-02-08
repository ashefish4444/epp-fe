import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, of } from "rxjs";
import { FormControlResponseModel } from "../../../../Models/supporting-models/form-control-response.model";
import { defaultFormControlParameter, defaultFormLabellParameter } from "../../../../Models/supporting-models/form-error-log.model";
import { SelectOptionModel } from "../../../../Models/supporting-models/select-option.model";
import { commonErrorMessage } from "../../../../Services/supporting-services/custom.validators";
import { FormGenerator } from "../../form-generator.model";
import { FormControlType } from "../../../../Models/supporting-models/form-control-name-type.enum"
import { EmployeeStaticDataMockService } from "../../../../Services/external-api.services/employee-static-data.mock.service";
import { EmployeeService } from "../../../../Services/Employee/EmployeeService";
import { map } from "rxjs/operators";

const errValidator = ((c: AbstractControl) => {
  return { error: true } ;
});
@Component({
  selector: 'exec-epp-custom-employee-id-number',
  templateUrl: './custom-employee-id-number.component.html',
  styleUrls: ['../../excel-styles/excel-single-control.style.scss']
})
export class CustomEmployeeIdNumberComponent implements OnInit {

  @Input() label = 'Employee Identification Number'
  @Input() labelConfig = defaultFormLabellParameter
  @Input() prefixControlConfig = defaultFormControlParameter
  @Input() controlConfig = defaultFormControlParameter
  @Input() formControl: FormControl = new FormControl()
  @Input() required = true
  @Input() formDescription: FormControlResponseModel = {} as FormControlResponseModel

  @Output() formResponse = new EventEmitter()

  errMessage = ''
  isEdit = true;
  minLengthofIdNumber = 3;
  maxLengthofIdNumber = 0;

  constructor(
    private readonly _employeeService: EmployeeService
  ) {
    this.isEdit = this._employeeService.isEdit;
  }

  ngOnInit(): void {
  }

  onChange() {
    this.formControl.removeValidators(errValidator);
    this.errMessage = '';
    const value = this.formControl.value;
    if (value) {
      const idNumber = this.formControl.value as string;
      if (idNumber.length < this.minLengthofIdNumber) {
        this.errMessage = `The minimum length of employee ID number should be ${this.minLengthofIdNumber}!`;
      } else if (this.maxLengthofIdNumber > 0 && idNumber.length > this.maxLengthofIdNumber) {
        this.errMessage = `The maximum length of employee ID number should be ${this.maxLengthofIdNumber}!`;
      } else {
        const result = this._employeeService.checkIdNumber(idNumber)
          .pipe(
            map((err: boolean) => {
              if (err) {
                this.errMessage = 'The employee ID number should be unique!';
              }
              return err;
            })
          );
      }
    } else {
      this.errMessage = commonErrorMessage.message.substring(0)
    }
    if(this.errMessage && this.errMessage !== '') {
      this.formControl.addValidators(errValidator);
    }
    this.formControl.updateValueAndValidity();
    this.formResponse.emit(this.formControl.value)
  }
}