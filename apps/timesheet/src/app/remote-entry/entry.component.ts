import { Component } from '@angular/core';

@Component({
  selector: 'exec-epp-timesheet-entry',
  template: `<div class="remote-entry">
    <h2>timesheet's Remote Entry Component</h2>
  </div>`,
  styles: [
    `
      .remote-entry {
        background-color: #143055;
        color: white;
        padding: 5px;
      }
    `,
  ],
})
export class RemoteEntryComponent {
  constructor() {
    let loggedInUserInfo = JSON.parse(localStorage.getItem("loggedInUserInfo") ?? "{}");
    let userId = "";
    if (loggedInUserInfo) {
      userId = loggedInUserInfo["EmployeeGuid"];
    }

    localStorage.setItem("userId", userId);
  }
}
