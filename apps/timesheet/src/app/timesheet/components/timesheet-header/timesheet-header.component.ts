import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { ApprovalEntity, ApprovalStatus, TimeEntry, Timesheet, TimesheetApproval, TimesheetConfigResponse, TimesheetConfiguration } from '../../../models/timesheetModels';
import { TimesheetValidationService } from '../../services/timesheet-validation.service';
import { TimesheetService } from '../../services/timesheet.service';
import { TimesheetStateService } from '../../state/timesheet-state.service';
import { startingDateCriteria } from '../timesheet-detail/timesheet-detail.component';

@Component({
  selector: 'app-timesheet-header',
  templateUrl: './timesheet-header.component.html',
  styleUrls: ['./timesheet-header.component.scss']
})
export class TimesheetHeaderComponent implements OnInit, OnChanges {
  @Input() timesheetConfig: TimesheetConfiguration | null = {
    WorkingDays: [],
    WorkingHour: 0
  };
  @Input() timesheet: Timesheet | null = null;
  @Input() timeEntries: TimeEntry[] | null = null;
  @Input() timesheetApprovals: TimesheetApproval[] | null = null;
  @Input() weekFirstDate: Date | null = null;
  @Input() weekLastDate: Date | null = null;
  @Input() isApproved = false;
  resubmitClicked:boolean|undefined;
  weeklyTotalHours: number = 0;
  configWeeklyTotalHour: number = 0;
  startingDateCriteria = startingDateCriteria

  validForApproal: boolean = false;
  btnText: string = "Request for Approval";
  timeSheetStatus = "not-submitted-enable";
  notSubmittedTooltip = "";
  toolTipColor = "red";
  toolTipText = "The time is passed total hour"
  rejectedTimesheet: TimesheetApproval| null = null;
  

  constructor(
    private timesheetService: TimesheetService,
    private timesheetValidationService: TimesheetValidationService,
    private timesheetStateService: TimesheetStateService
  ) { }

  ngOnInit(): void {
    if (this.weekFirstDate && this.weekLastDate) {
      this.timesheetValidationService.fromDate = new Date(this.weekFirstDate);
      this.timesheetValidationService.toDate = new Date(this.weekLastDate);
    }

    if (this.timeEntries) {
      this.weeklyTotalHours = this.timeEntries?.map(timeEntry => timeEntry.Hour).reduce((prev, next) => prev + next, 0);
    }
    else {
      this.weeklyTotalHours = 0;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.weekFirstDate && this.weekLastDate) {
      this.timesheetValidationService.fromDate = new Date(this.weekFirstDate);
      this.timesheetValidationService.toDate = new Date(this.weekLastDate);
    }

    if (this.timeEntries) {
      this.weeklyTotalHours = this.timeEntries?.map(timeEntry => timeEntry.Hour).reduce((prev, next) => prev + next, 0);
    }
    else {
      this.weeklyTotalHours = 0;
    }
    this.checkForSubmittedForApproal();
  }

  checkForSubmittedForApproal() {
    if (this.timesheetApprovals && this.timesheetApprovals.length > 0) {
      for(let i = 0; i < this.timesheetApprovals.length;i++){
        if(this.timesheetApprovals[i].Status===Object.values(ApprovalStatus)[2].valueOf()){
          this.btnText="Resubmit Timesheet";
          this.timeSheetStatus = "not-submitted-enable";
          break;
          }
        if(this.resubmitClicked || this.timesheetApprovals[i].Status===Object.values(ApprovalStatus)[0].valueOf() || this.timesheetApprovals[i].Status===Object.values(ApprovalStatus)[0].valueOf()){
           this.btnText = "Submitted";
           this.timeSheetStatus = "submitted-class";
      }
    }
  }
    else {
      this.checkIfValidForApproval();
    }
 }

  checkIfValidForApproval() {
    let timesheetConfig = this.timesheetConfig ?? {
      WorkingDays: [],
      WorkingHour: 0
    }
    if (this.timesheetValidationService.isValidForApproval(this.timeEntries ?? [], timesheetConfig)) {
      this.validForApproal = true;
      this.btnText = "Request for Approval";
      this.timeSheetStatus = "not-submitted-enable";
      this.notSubmittedTooltip = "";
    }
    else {
      this.validForApproal = false;
      this.btnText = "Request for Approval";
      this.timeSheetStatus = "not-submitted-disable";
      this.notSubmittedTooltip = `Please fill in your working days ${timesheetConfig.WorkingDays} with a minimum hour of ${timesheetConfig.WorkingHour}`;
    }
  }

  onRequestForApproval() {
    let timesheetConfig = this.timesheetConfig ?? {
      WorkingDays: [],
      WorkingHour: 0
    }
    if (!this.timesheet) {
      return;
    }

    if (!this.timeEntries || this.timeEntries.length === 0) {
      return;
    }

    if (this.timesheetValidationService.isValidForApproval(this.timeEntries, timesheetConfig)) {
      if(this.timesheetApprovals){
      for(let i=0;i<this.timesheetApprovals.length;i++){
        if(this.timesheetApprovals[i].Status===Object.values(ApprovalStatus)[2].valueOf()){
          this.rejectedTimesheet=this.timesheetApprovals[i];
        }
        if(this.rejectedTimesheet){
        const temp={
          TimesheetId: this.rejectedTimesheet.TimesheetId,
          ProjectId: this.rejectedTimesheet.ProjectId,
          ApprovalStatus: Object.values(ApprovalStatus)[0].valueOf()
        } as unknown as ApprovalEntity;
        
        this.timesheetService.updateTimesheetApproval(temp).subscribe();
        this.timesheetApprovals[i].Status= ApprovalStatus.Requested;
        this.resubmitClicked=true;
        this.checkForSubmittedForApproal();
      }
    }
  }
      else{
      this.timesheetService.addTimeSheetApproval(this.timesheet.Guid).subscribe(response => {
        if (this.timesheet) {
          this.timesheetStateService.getTimeSheetApproval(this.timesheet?.Guid)
        }
      }, error => {

      });
    }
  }
  }

  getConfigWeeklyTotalHours() {
    const numberOfDays = this.timesheetConfig?.WorkingDays?.length ?? 0;
    const workingHourPerDay = this.timesheetConfig?.WorkingHour ?? 0;

    return numberOfDays * workingHourPerDay;
  }
}
