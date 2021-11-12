import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TimeEntryEvent } from '../../../models/clickEventEmitObjectType';
import { ClickEventType } from '../../../models/clickEventType';
import { Project } from '../../../models/project';
import { TimeEntry } from '../../../models/timesheetModels';
import { TimesheetService } from '../../services/timesheet.service';

@Component({
  selector: 'app-project-name-palet',
  templateUrl: './project-name-palet.component.html',
  styleUrls: ['./project-name-palet.component.scss']
})
export class ProjectNamePaletComponent implements OnInit {
  @Output() projectNamePaletClicked = new EventEmitter<TimeEntryEvent>()
  @Output() paletEllipsisClicked = new EventEmitter<ClickEventType>();
  @Output() editClicked = new EventEmitter<ClickEventType>()
  @Input() timeEntry: TimeEntry | null = null;
  project: Project | null = null;

  clickEventType = ClickEventType.none;
  popoverVisible = false;

  constructor(private timesheetService: TimesheetService) { }

  ngOnInit(): void {
    if (this.timeEntry) {
      this.timesheetService.getProject(this.timeEntry.projectId).subscribe(response => {
        this.project = response ? response[0] : null;
      });
    }
  }

  showPopover() {
    if (this.clickEventType === ClickEventType.none) {
      this.clickEventType = ClickEventType.showPaletPopover;
      this.paletEllipsisClicked.emit(this.clickEventType);
      this.popoverVisible = true;
    }
  }  

  onProjectNamePaletClicked() {
    let timeEntryEvent: TimeEntryEvent = {clickEventType: ClickEventType.showFormDrawer, timeEntry: this.timeEntry};

    if (this.clickEventType == ClickEventType.none){
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
}
