import { Component, OnInit, ViewChild } from '@angular/core';
import { DayAndDateService } from "./services/day-and-date.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimesheetService } from './services/timesheet.service';
import { differenceInCalendarDays } from 'date-fns';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { ClickEventType } from '../models/clickEventType';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TimeEntry, Timesheet, TimesheetApproval, TimesheetApprovalResponse } from '../models/timesheetModels';
import { DateColumnEvent, TimeEntryEvent } from '../models/clickEventEmitObjectType';
import { Client } from '../models/client';
import { Project } from '../models/project';
import { Employee } from '../models/employee';

import { NzNotificationPlacement } from "ng-zorro-antd/notification";
import { retry } from 'rxjs/operators';
import { TimeEntryFormData } from '../models/timeEntryFormData';

@Component({
  selector: 'exec-epp-app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss'],
})
export class TimesheetComponent implements OnInit {
  userId: string | null = null;
  clickEventType = ClickEventType.none;
  drawerVisible = false;
  validateForm!: FormGroup;

  // Used for disabling client and project list when selected for edit.
  disableClient = false;
  disableProject = false;
  timesheet: Timesheet | null = null;
  timeEntries: TimeEntry[] | null = null;
  timeEntry: TimeEntry | null = null;
  weeklyTotalHours: number = 0;

  clients: Client[] | null = null;
  clientsFiltered: Client[] | null = null;
  projects: Project[] | null = null;
  projectsFiltered: Project[] | null = null;
  employee: Employee[] = [];

  formData: TimeEntryFormData = {
    fromDate: new Date(),
    toDate: new Date(),
    client: '', //this.clients,
    project: '', //this.projects
    hours: null,
    note: '',
  };

  dateColumnTotalHour: number = 0;
  date = new Date();
  futereDate: any;
  public weekDays: any[] = [];
  curr = new Date();
  firstday1: any;
  lastday1: any;
  parentCount = null;
  nextWeeks = null;
  lastWeeks = null;
  startValue: Date | null = null;
  endValue: Date | null = null;
  timesheetApprovals: TimesheetApproval[] | null = [];
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  endValue1 = new Date();
  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.date) > 0;

  constructor(
    private fb: FormBuilder,
    private timesheetService: TimesheetService,
    private notification: NzNotificationService,
    private dayAndDateService: DayAndDateService,
    private timeSheetService: TimesheetService) {
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem("userId");

    if (this.userId) {
      this.getTimesheet(this.userId);
      this.getProjectsAndClients(this.userId);
    }

    this.validateForm = this.fb.group({
      fromDate: [null, [Validators.required]],
      toDate: [null],
      client: [null, [Validators.required]],
      project: [null, [Validators.required]],
      hours: [null, [Validators.required]],
      note: [null, [Validators.required]],
    });

    this.weekDays = this.dayAndDateService.getWeekByDate(this.curr);
    this.firstday1 = this.dayAndDateService.getWeekendFirstDay();
    this.lastday1 = this.dayAndDateService.getWeekendLastDay();
    this.calcualteNoOfDaysBetweenDates();
  }

  // To calculate the time difference of two dates
  calcualteNoOfDaysBetweenDates() {
    let date1 = new Date("06/21/2019");
    let date2 = new Date("07/30/2019");
    let Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  }

  getTimesheet(userId: string, date?: Date) {
    this.weeklyTotalHours = 0;

    this.timesheetService.getTimeSheet(userId, date).subscribe(response => {
      this.timesheet = response ? response : null;

      if (this.timesheet) {
        this.timesheetService.getTimeEntries(this.timesheet.Guid).subscribe(response => {
          this.timeEntries = response ? response : null;
        }, error => {
          console.log(error);
        });

        this.timesheetService.getTimeSheetApproval(this.timesheet.Guid).subscribe(response => {
          this.timesheetApprovals = response ? response : null;
        });
      }
    }, error => {
      console.log(error);
    });
  }

  getProjectsAndClients(userId: string) {
    this.timesheetService.getProjects(userId).subscribe(response => {
      this.projects = response;

      let clientIds = this.projects?.map(project => project.clientId);
      clientIds = clientIds?.filter((client: string, index: number) => clientIds?.indexOf(client) === index);

      this.timesheetService.getClients(clientIds).subscribe(response => {
        this.clients = response;
      });
    });
  }

  clientValueChange(value: string) {
    if (!this.userId) {
      return;
    }
    let clientId = value;
    this.timesheetService.getProjects(this.userId, clientId).subscribe(pp => {
      this.projects = pp;
      this.setDefaultProject(this.projects);
    });
  }

  projectValueChange(value: string) {
    let projectId = value;
    let project: Project | null = null;
    this.timesheetService.getProject(projectId).subscribe(response => {
      project = response ? response[0] : null;
      if (project) {
        this.timesheetService.getClient(project.clientId).subscribe(response => {
          this.clients = response
          this.setDefaultClient(this.clients);
        });
      }
    });
  }

  disabledDate1 = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.date) > 0;

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() < this.endValue1.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
  };

  selectedDate(count: any) {
    this.parentCount = count;
    if (count != null) {
      this.weekDays = this.dayAndDateService.getWeekByDate(count);
      this.firstday1 = this.dayAndDateService.getWeekendFirstDay();
      this.lastday1 = this.dayAndDateService.getWeekendLastDay();

      if (this.userId) {
        this.getTimesheet(this.userId, this.weekDays[0]);
      }
    }
  }

  selectedDateCanceled(curr: any) {
    if (curr != null) {
      this.weekDays = this.dayAndDateService.getWeekByDate(curr);
      this.firstday1 = this.dayAndDateService.getWeekendFirstDay();
      this.lastday1 = this.dayAndDateService.getWeekendLastDay();
    }
  }

  nextWeek(count: any) {
    this.nextWeeks = count;
    let ss = this.dayAndDateService.getWeekendLastDay();
    this.weekDays = this.dayAndDateService.nextWeekDates(ss, count);
    this.firstday1 = this.dayAndDateService.getWeekendFirstDay();
    this.lastday1 = this.dayAndDateService.getWeekendLastDay();

    if (this.userId) {
      this.getTimesheet(this.userId, this.weekDays[0])
    }
  }

  lastastWeek(count: any) {
    this.lastWeeks = count;
    let ss = this.dayAndDateService.getWeekendFirstDay();
    this.weekDays = this.dayAndDateService.lastWeekDates(ss, count);
    this.firstday1 = this.dayAndDateService.getWeekendFirstDay();
    this.lastday1 = this.dayAndDateService.getWeekendLastDay();

    if (this.userId) {
      this.getTimesheet(this.userId, this.weekDays[0])
    }
  }

  calculateWeeklyTotalHours(dailyTotalHours: number) {
    if (this.timeEntries){
      this.weeklyTotalHours = this.timeEntries?.map(timeEntry => timeEntry.Hour).reduce((prev, next) => prev + next, 0);
    }
    else{
      this.weeklyTotalHours = 0;
    }
  }

  onDateColumnClicked(dateColumnEvent: DateColumnEvent, date: Date) {
    this.clickEventType = dateColumnEvent.clickEventType;
    this.date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    this.setDateColumnTotalHour();

    if (this.date <= new Date()) {
      if (this.dateColumnTotalHour < 24) {
        this.checkForApproalAndShowFormDrawer();
      } else {
        this.createNotificationError("bottomRight", "Day is already filled up to 24 hours");
      }
    } else {
      this.createNotificationError('bottomRight', "Can't fill timesheet for the future.");
    }
  }

  onProjectNamePaletClicked(timeEntryEvent: TimeEntryEvent, date: Date) {
    this.clickEventType = timeEntryEvent.clickEventType;
    this.timeEntry = timeEntryEvent.timeEntry;
    this.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.setDateColumnTotalHour();

    this.checkForApproalAndShowFormDrawer();
  }

  onPaletEllipsisClicked(timeEntryEvent: TimeEntryEvent, date: Date) {
    this.clickEventType = timeEntryEvent.clickEventType;
    this.timeEntry = timeEntryEvent.timeEntry;
    this.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.setDateColumnTotalHour();
  }

  onEditButtonClicked(clickEventType: ClickEventType, date: Date) {
    this.clickEventType = clickEventType;
    this.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.checkForApproalAndShowFormDrawer();
  }

  checkForApproalAndShowFormDrawer() {
    if (!this.timesheet) {
      this.showFormDrawer();
      return;
    }

    this.timeSheetService.getTimeSheetApproval(this.timesheet?.Guid).subscribe(objApprove => {
      this.timesheetApprovals = objApprove ? objApprove : null;
      if (!this.timesheetApprovals || this.timesheetApprovals.length === 0) {
        this.showFormDrawer();
        return;
      }

      if (!this.timeEntry) {
        this.notification.error('error', "You can't edit entries that are approved or submitted for approval.");
        this.clearFormData();
        return;
      }

      let timesheetApproval = this.timesheetApprovals.filter(tsa => tsa.ProjectId === this.timeEntry?.ProjectId);

      if (timesheetApproval.length === 0 || timesheetApproval[0].Status != 2) {
        this.notification.error('error', "You can't edit entries that are approved or submitted for approval.");
        this.clearFormData();
      }
      else {
        this.showFormDrawer();
      }
    });
  }

  showFormDrawer() {
    if (this.clickEventType === ClickEventType.showFormDrawer) {
      this.setDefaultClient(this.clients);
      this.setDefaultProject(this.projects);

      if (this.timeEntry) {
        let clientId = this.projects?.filter(project => project.id == this.timeEntry?.ProjectId)[0].clientId.toString();
        this.formData.client = clientId ? clientId : "";
        this.formData.project = this.timeEntry.ProjectId.toString();
        this.formData.hours = this.timeEntry.Hour;
        this.formData.note = this.timeEntry.Note;

        this.disableClient = true;
        this.disableProject = true;
      }

      this.formData.fromDate = this.date;
      this.formData.toDate = this.date;

      this.drawerVisible = true;
    }

    this.clickEventType = ClickEventType.none;
  }

  setDefaultClient(clients: Client[] | null) {
    if (!clients) {
      return;
    }
    else if(this.formData.client && this.formData.client != ""){
      return;
    }

    (clients.length === 1) ? this.formData.client = clients[0].id.toString() : this.formData.client = '';
  }

  setDefaultProject(projects: Project[] | null) {
    if (!projects) {
      return;
    }
    else if(this.formData.project && this.formData.project != ""){
      return;
    }

    (projects.length === 1) ? this.formData.project = projects[0].id.toString() : this.formData.project = '';
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }

    try {
      let timeEntry: TimeEntry = {
        Guid: "00000000-0000-0000-0000-000000000000",
        Note: this.validateForm.value.note,
        Date: new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), 3, 0, 0, 0),
        Index: 1,
        Hour: this.validateForm.value.hours,
        ProjectId: this.validateForm.value.project,
        TimeSheetId: "00000000-0000-0000-0000-000000000000"
      }

      if (this.timeEntry) {
        timeEntry.Guid = this.timeEntry.Guid;
        timeEntry.TimeSheetId = this.timeEntry.TimeSheetId;

        this.updateTimeEntry(timeEntry);
      }
      else if (this.timesheet) {
        this.timesheetService.getTimeEntries(this.timesheet.Guid, this.date, timeEntry.ProjectId).subscribe(response => {
          this.timeEntry = response ? response[0] : null;

          if (this.timeEntry) {
            timeEntry.Guid = this.timeEntry.Guid;
            timeEntry.Hour = this.timeEntry.Hour + timeEntry.Hour;
            timeEntry.Note = this.timeEntry.Note + "\n" + timeEntry.Note;
            timeEntry.TimeSheetId = this.timeEntry.TimeSheetId;

            this.updateTimeEntry(timeEntry);

            this.timeEntry = null;
          }
          else {
            this.addTimeEntry(timeEntry);
          }
        })
      }
      else {
        this.addTimeEntry(timeEntry);
      }

      this.closeFormDrawer();
    } catch (err) {
      console.error(err);
    }
  }

  addTimeEntry(timeEntry: TimeEntry) {
    if (!this.userId) {
      return;
    }

    this.timesheetService.addTimeEntry(this.userId, timeEntry).subscribe(response => {
      if (this.userId) {
        this.getTimesheet(this.userId, this.date);
      }
      this.createNotification("success");
    }, error => {
      this.createNotification("warning");
    });
  }

  updateTimeEntry(timeEntry: TimeEntry) {
    this.timesheetService.updateTimeEntry(timeEntry).subscribe(response => {
      if (this.userId) {
        this.getTimesheet(this.userId, this.date);
      }
      this.createNotification('success');
    }, error => {
      this.createNotification('error')
      console.log(error);
    });
  }

  closeFormDrawer(): void {
    this.clearFormData();
    this.drawerVisible = false;
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.clearFormData();
  }

  clearFormData() {
    this.timeEntry = null;
    this.disableClient = false;
    this.disableProject = false;
    this.validateForm.reset();
    this.setDateColumnTotalHour();
    if (this.userId) {
      this.getProjectsAndClients(this.userId);
    }
  }

  setDateColumnTotalHour() {
    let totalHour = this.timeEntries?.filter(timeEntry => new Date(timeEntry.Date).getTime() === this.date.getTime()).map(timeEntry => timeEntry.Hour).reduce((prev, curr) => prev + curr, 0);
    this.dateColumnTotalHour = totalHour ? totalHour : 0;
    this.dateColumnTotalHour -= this.timeEntry ? this.timeEntry.Hour : 0;
  }

  createNotificationError(position: NzNotificationPlacement, message: string): void {
    this.notification.error(
      '',
      message,
      { nzPlacement: position }
    );
  }

  createNotification(type: string): void {
    let message = "";
    if (type === "Success") {
      message = "Your Timesheet Added Successfully.";
    } else if (type === "error") {
      message = "Error on adding Timesheet."
    } else if (type === "warning") {
      message = "Warning"
    }

    this.notification.create(type, message, 'Timesheet');
  }
  disabledDates=(current: Date): boolean => {
      return current.valueOf() > Date.now();
  }

}
