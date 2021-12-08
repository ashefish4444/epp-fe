
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TimeEntryEvent } from '../../../models/clickEventEmitObjectType';
import { ClickEventType } from '../../../models/clickEventType';
import { Project } from '../../../models/project';
import { ApprovalStatus, TimeEntry, TimesheetApproval } from '../../../models/timesheetModels';
import { TimesheetService } from '../../services/timesheet.service';
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-project-name-palet',
  templateUrl: './project-name-palet.component.html',
  styleUrls: ['./project-name-palet.component.scss']
})
export class ProjectNamePaletComponent implements OnInit {
  @Output() projectNamePaletClicked = new EventEmitter<TimeEntryEvent>()
  @Output() paletEllipsisClicked = new EventEmitter<TimeEntryEvent>();
  @Output() editClicked = new EventEmitter<ClickEventType>()
  @Input() timeEntry: TimeEntry | null = null;
  @Input() timesheetApproval: TimesheetApproval | null = null;
  project: Project | null = null;
  projectNamePaletClass = "project-name-palet"

  isVisible1 = false;
  clickEventType = ClickEventType.none;
  popoverVisible = false;

  constructor(private timesheetService: TimesheetService,
              private modal: NzModalService) {
  }

  ngOnInit(): void {
    if (this.timeEntry) {
      this.timesheetService.getProject(this.timeEntry.ProjectId).subscribe(response => {
        this.project = response ? response[0] : null;
      });
    }

    if (this.timesheetApproval && this.timesheetApproval.Status != ApprovalStatus.Rejected) {
      this.projectNamePaletClass = "project-name-palet-approval";
    } else {
      this.projectNamePaletClass = "project-name-palet";
    }
  }

  showPopover() {
    debugger;
    let timeEntryEvent: TimeEntryEvent = {clickEventType: ClickEventType.showPaletPopover, timeEntry: this.timeEntry};

    if (this.clickEventType === ClickEventType.none) {
      this.clickEventType = ClickEventType.showPaletPopover;
      this.paletEllipsisClicked.emit(timeEntryEvent);
      this.popoverVisible = this.timesheetApproval ? this.timesheetApproval.Status === ApprovalStatus.Rejected : true;
    }
  }

  onProjectNamePaletClicked() {
    let timeEntryEvent: TimeEntryEvent = {clickEventType: ClickEventType.showFormDrawer, timeEntry: this.timeEntry};

    if (this.clickEventType == ClickEventType.none) {
      this.clickEventType = ClickEventType.showFormDrawer;
      this.projectNamePaletClicked.emit(timeEntryEvent);
    }

    this.clickEventType = ClickEventType.none; //Use this line of code when the element is the container element.
  }

  showFormDrawer() {
    if (this.clickEventType === ClickEventType.none) {
      this.editClicked.emit(ClickEventType.showFormDrawer);
      this.popoverVisible = false;
    }

    this.clickEventType = ClickEventType.none;
  }

  closePopover() {
    this.popoverVisible = false;
  }

  showModal(): void {
    this.isVisible1 = true;

  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible1 = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible1 = false;
  }

  deleteTimeEntry(Guid:string):void{
    this.isVisible1 = true;
    this.timesheetService.deleteTimeEntry(Guid).subscribe(data => {
        console.log(data);
      });

    }

}
