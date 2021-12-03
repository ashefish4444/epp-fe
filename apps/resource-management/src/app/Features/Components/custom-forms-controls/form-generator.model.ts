import { Directive, Injectable } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { validateFirstName, validateLastName, validateMiddleName } from "../../Services/supporting-services/custom.validators";

@Injectable({
    providedIn: 'root'
})
export class FormGenerator {

    constructor(
        private readonly _formBuilder: FormBuilder
    ) {
    }

    // validateLastName
    getPersonalDetailsForm() {
return this._formBuilder.group({
    employeeIdNumberPrefix: [null],
    employeeIdNumber: [null],
    firstName: [null, [validateFirstName]],
    middleName: [null, [validateMiddleName]],
    lastName: [null, [validateLastName]],
    gender: [null],
    dateofBirth: [null],
    phoneNumbers: this._formBuilder.array([
        this._formBuilder.array([
            new FormControl(),
            new FormControl()
        ])
    ]),
    EmailAddresses: this._formBuilder.array([
        new FormControl()
    ]),
    nationalities: [null]
});
    }
}