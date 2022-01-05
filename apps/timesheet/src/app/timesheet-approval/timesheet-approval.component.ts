import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PaginatedResult } from '../models/PaginatedResult';
import { TimesheetApproval } from '../models/timesheetModels';
import { TimesheetService } from '../timesheet/services/timesheet.service';

interface ItemData {
  id: number,
  name: string;
  dateRange: string;
  projectName: number;
  clientName: string;
  hours: number,
  status: string
}


@Component({
  selector: 'exec-epp-timesheet-approval',
  templateUrl: './timesheet-approval.component.html',
  styleUrls: ['./timesheet-approval.component.scss']
})
export class TimesheetApprovalComponent implements OnInit {

  date = null;
  bulkCheck = true;
  statusColumn = true;
  cols: TemplateRef<any>[] = [];
  currentNameSubject$ = new BehaviorSubject(true);

  qtyofItemsSelected = 0

  searchProject = new FormControl();

  isVisible = false;
  isOkLoading = false;


  timeSheetApproval!: TimesheetApproval[];
  timeSheetApprovalAll!: TimesheetApproval[];
  totalAll = 10;
  pageIndexAll = 1;
  pageSizeAll = 10;
  totalPageAll!: number;
  totalRecordsAll = 10;

  timeSheetApprovalAwaiting!: TimesheetApproval[];
  totalAwaiting = 10;
  pageIndexAwaiting = 1;
  pageSizeAwaiting = 10;
  totalPageAwaiting!: number;
  totalRecordsAwaiting = 10;

  timeSheetApprovalApproved!: TimesheetApproval[];
  totalApproved = 10;
  pageIndexApproved = 1;
  pageSizeApproved = 10;
  totalPageApproved!: number;
  totalRecordsApproved = 10;

  timeSheetApprovalReview!: TimesheetApproval[];
  totalReview = 10;
  pageIndexReview = 1;
  pageSizeReview = 10;
  totalPageReview!: number;
  totalRecordsReview = 10;

  loading = true;

  idParam = '';
  totalPage!: number;

  //table
  params!: NzTableQueryParams;
  timeSheetHistory!: TimesheetApproval[];
  total = 10;
  pageIndex = 1;
  pageSize = 10;

  sortByParam = "";
  sortDirection = "asc";

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ItemData[] = [];
  listOfData: readonly ItemData[] = [];
  setOfCheckedId = new Set<string>();
  public arrayOfCheckedId:string[] =[];

  //setOfCheckedId:Set<Number>;

  ids: number[]=[];
  resources: any;

  // variables for generic method
    pageSizeG = 10;
    pageIndexG = 1;
    statusG = '';
    searchKeyG = '';
    sortByG = '';
    projectNameG = '';
    clientNameG = '';
    weekG = '';
    sortG = 'Ascending';

    // response
    TimesheetApprovalResponse!: TimesheetApproval[];
    totalResponse!: number;
    totalPageResponse!: number;
  // end of generic variables

  constructor(
    private router: Router,
    private timeSheetService: TimesheetService,
    private http: HttpClient
  ) { }



  ngOnInit(): void {
   // this.timesheetSubmissionPaginationAwaiting(this.pageIndexAwaiting, this.pageSizeAwaiting, '');
    console.log('direct');
    console.log(this.timesheetSubmissionPagination(1,10,'Requested','','Name','','','','Descending'));
  }

  timesheetSubmissionPagination(pageIndex: number,pageSize: number ,status:string,
                                searchKey: string,sortBy: string,projectName:string,
                                clientName: string, week: string, sort: string) {

    this.pageIndexG = pageIndex;
    this.pageSizeG = pageSize;
    this.statusG = status;
    this.searchKeyG =searchKey;
    this.sortByG = sortBy;
    this.projectNameG = projectName;
    this.clientNameG = clientName;
    this.weekG = week;
    this.sortG = sort;

    this.timeSheetService

      .getTimesheetApprovalPagination(

        this.pageIndexG,

         this.pageSizeG,

         this.searchKeyG,

         this.sortByG,

         this.projectNameG,

         this.clientNameG,this.weekG,this.sortG,this.statusG

      )

      .subscribe((response: PaginatedResult<TimesheetApproval[]>) => {

        this.TimesheetApprovalResponse = response.data;

        this.pageIndexG = response.pagination.pageIndex;

        this.pageSizeG = response.pagination.pageSize;

        this.totalRecordsAll = response.data.length;

        this.totalResponse = response.pagination.totalRecord;

        this.totalPageResponse = response.pagination.totalPage;

      });

  }

  PageIndexChangeG(index: number): void {
    this.pageIndexG = index;
    this.timesheetSubmissionPagination(this.pageIndexG,

      this.pageSizeG,

      this.searchKeyG,

      this.sortByG,

      this.projectNameG,

      this.clientNameG,this.weekG,this.sortG,this.statusG);
    this.loading = false;
  }


  timesheetApprovalPaginationAll(index: number, pageSize: number,search:string, sortBy: string) {
    this.timeSheetService
      .getTimesheetApprovalPagination(index, pageSize, search,'',sortBy)
      .subscribe((response: PaginatedResult<TimesheetApproval[]>) => {
        this.timeSheetApprovalAll = response.data;
        this.pageIndexAll = response.pagination.pageIndex;
        this.pageSizeAll = response.pagination.pageSize;
        this.totalRecordsAll = response.data.length;
        this.totalAll = response.pagination.totalRecord;
        this.totalPageAll = response.pagination.totalPage;
      });
  }

  PageIndexChangeAll(index: number): void {
    this.pageIndexAll = index;
    this.timesheetApprovalPaginationAll(index,this.pageSizeAll,'','');
    this.loading = false;
  }

  timesheetSubmissionPaginationAwaiting(index: number, pageSize: number, search:string) {
    this.timeSheetService
      .getTimesheetApprovalPagination(index, pageSize, search,'Requested')
      .subscribe((response: PaginatedResult<TimesheetApproval[]>) => {
        this.timeSheetApprovalAwaiting = response.data;
        this.pageIndexAwaiting = response.pagination.pageIndex;
        this.pageSizeAwaiting = response.pagination.pageSize;
        this.totalRecordsAwaiting = response.data.length;
        this.totalAwaiting = response.pagination.totalRecord;
        this.totalPageAwaiting = response.pagination.totalPage;
      });
  }

  onAllTabClick() {
    this.timesheetSubmissionPagination(1,10,'','','','','','','');
  }

  onAwaitingTabClick() {
    this.timesheetSubmissionPagination(1,10,'Requested','','','','','','');
  }

  onApprovedTabClick() {
    this.timesheetSubmissionPagination(1,10,'Approved','','','','','','');
  }

  onReviewTabClick() {
    this.timesheetSubmissionPagination(1,10,'Rejected','','','','','','');
  }

  PageIndexChangeAwaiting(index: number): void {
    this.pageIndexAwaiting = index;
    this.timesheetSubmissionPaginationAwaiting(index,this.pageSizeAwaiting,'');
    this.loading = false;
  }

  timesheetSubmissionPaginationApproved(index: number, pageSize: number, search:string) {
    this.timeSheetService
      .getTimesheetApprovalPagination(index, pageSize, search,'Approved')
      .subscribe((response: PaginatedResult<TimesheetApproval[]>) => {
        this.timeSheetApprovalApproved = response.data;
        this.pageIndexApproved = response.pagination.pageIndex;
        this.pageSizeApproved = response.pagination.pageSize;
        this.totalRecordsApproved = response.data.length;
        this.totalApproved = response.pagination.totalRecord;
        this.totalPageApproved = response.pagination.totalPage;
      });
  }

  PageIndexChangeApproved(index: number): void {
    this.pageIndexApproved = index;
    this.timesheetSubmissionPaginationApproved(index,this.pageSizeApproved,'');
    this.loading = false;
  }

  timesheetSubmissionPaginationReview(index: number, pageSize: number, search:string) {
    this.timeSheetService
      .getTimesheetApprovalPagination(index, pageSize, search,'Rejected')
      .subscribe((response: PaginatedResult<TimesheetApproval[]>) => {
        this.timeSheetApprovalReview = response.data;
        this.pageIndexReview = response.pagination.pageIndex;
        this.pageSizeReview = response.pagination.pageSize;
        this.totalRecordsReview = response.data.length;
        this.totalReview = response.pagination.totalRecord;
        this.totalPageReview = response.pagination.totalPage;
      });
  }

  PageIndexChangeReview(index: number): void {
    this.pageIndexReview = index;
    this.timesheetSubmissionPaginationReview(index,this.pageSizeReview,'');
    this.loading = false;
  }

test() {
  console.log("clicked");
}
  timesheetBulkApproval(arrayOfIds:any[]){
    this.timeSheetService.updateTimeSheetStatus(arrayOfIds);
    console.log("service"+arrayOfIds);
  }

  getweek(result: Date): void {
    console.log('week: ');
  }


  onTabSelected(tab: any) {
    console.log(tab);
    if (tab === 1) {
      this.currentNameSubject$.next(true);
    }
    else {
      this.currentNameSubject$.next(false);
    }
  }
onItemCheckStatusChange(event: number){
  this.qtyofItemsSelected = event;
}
updateProjectResourseList(resources: any) {
  this.resources = resources;
  console.log(this.resources);
}
// for the table




emitArray(evt:Set<string>){
  if(evt){
    this.setOfCheckedId=evt;
    ///this.arrayOfCheckedId= evt;
    console.log(this.setOfCheckedId);
  }

}

  // onCurrentPageDataChange($event: readonly ItemData[]): void {
  //   this.listOfCurrentPageData = $event;
  //   this.refreshCheckedStatus();
  // }

  // refreshCheckedStatus(): void {
  //   this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
  //   this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  // }

  sorter(sortIndex: string) {

    if (this.sortDirection === 'desc') {
      this.sortDirection = 'Ascending';
    } else {
      this.sortDirection = 'Descending';
    }

    if (sortIndex === "name") {
      this.timesheetApprovalPaginationAll(1,10,'','Name')
      console.log("name came"); //API call
    } else if (sortIndex === "dateRange") {
      console.log("dateRange came"); //API call
    } else if (sortIndex === "projectName") {
      console.log("projectName came"); //API call
    } else if (sortIndex === "clientName") {
      console.log("clientName came"); //API call
    }
  }



  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  onApprove(){

    for (let element of this.setOfCheckedId) {
      console.log(element);
      this.arrayOfCheckedId.push(element);
      console.log(this.arrayOfCheckedId);
    }

    this.timesheetBulkApproval(this.arrayOfCheckedId);
    console.log("Approved"+this.arrayOfCheckedId);
    console.log(this.arrayOfCheckedId);
    this.arrayOfCheckedId.length=0;

    //this.timesheetSubmissionPaginationAwaiting(this.pageIndexAwaiting, this.pageSizeAwaiting, '');
    //this.PageIndexChangeAwaiting(this.totalPageAwaiting);



  }
}
