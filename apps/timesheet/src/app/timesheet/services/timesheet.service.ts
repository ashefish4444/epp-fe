import {
  ApprovalEntity,
  TimeEntriesResponse,
  TimeEntry,
  TimeEntryResponse,
  Timesheet,
  TimesheetApproval,
  TimesheetApprovalResponse,
  TimesheetBulkApproval,
  TimesheetConfigResponse,
  TimesheetConfiguration,
  TimesheetResponse,
} from '../../models/timesheetModels';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { PaginatedResult, Pagination } from '../../models/PaginatedResult';
import { filter, map } from 'rxjs/operators';

import { Client } from '../../models/client';
import { DayAndDateService } from './day-and-date.service';
import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { Project } from '../../models/project';
import { environment } from 'apps/timesheet/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService {
  success=''
  error=''

  baseUrl = environment.apiUrl;
  timesheetId?:string;
  timesheetApp?:Timesheet;
  statusChanged=false;
  timesheetApprove!:TimesheetApproval;
  constructor(
    private notification: NzNotificationService,
    private http: HttpClient,
    private dayAndDateService: DayAndDateService
  ) {

  }

  //#region timesheet and timeEntry

  getTimeSheet(userId: string, date?: Date) {
    let fromDate;

    if (date) {
      fromDate = this.dayAndDateService.getWeeksFirstDate(date);
    } else {
      fromDate = this.dayAndDateService.getWeeksFirstDate(new Date());
    }
    fromDate.setHours(3, 0, 0, 0);


    let params = new HttpParams();

    params = params.append('employeeId', userId);
    params = params.append('date', fromDate.toISOString());

    let response = this.http.get<TimesheetResponse>(
      this.baseUrl + 'Timesheets',
      { observe: 'response', params: params }
    );

    return response.pipe(map((r) => r.body?.Data));
  }

  getTimeEntry(timeEntryId: string) {
    let params = new HttpParams();

    params = params.append('id', timeEntryId);

    let response = this.http.get<TimeEntryResponse>(
      this.baseUrl + 'timeentries',
      { observe: 'response', params: params }
    );

    return response.pipe(map((r) => r.body?.Data));
  }

  getTimeEntries(timesheetId: string, date?: Date, projectId?: string) {
    let params = new HttpParams();

    params = params.append('timesheetId', timesheetId);

    if (date) {
      date = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        3,
        0,
        0,
        0
      );
      params = params.append('date', date.toISOString());
    }

    if (projectId) {
      params = params.append('projectId', projectId);
    }

    let response = this.http.get<TimeEntriesResponse>(
      this.baseUrl + 'TimeEntries',
      { observe: 'response', params: params }
    );

    return response.pipe(map((r) => r.body?.Data));
  }

  addTimeEntry(employeeId: string, timeEntry: TimeEntry) {
    const headers = { 'content-type': 'application/json' };

    let params = new HttpParams();

    params = params.append('employeeId', employeeId);

    return this.http.post<any>(this.baseUrl + 'timeentries', timeEntry, {
      headers: headers,
      params: params,
    });
  }

  addTimeEntryForRangeOfDates(employeeId: string, timeEntries: TimeEntry[]) {
    const headers = { 'content-type': 'application/json' };

    let params = new HttpParams();

    params = params.append('employeeId', employeeId);

    return this.http.post<any>(
      this.baseUrl + 'TimeEntriesForRange',
      timeEntries,
      { headers: headers, params: params }
    );
  }

  updateTimeEntry(timeEntry: TimeEntry) {
    const headers = { 'content-type': 'application/json' };

    return this.http.put<TimeEntryResponse>(
      this.baseUrl + 'timeentries',
      timeEntry,
      { headers: headers }
    );
  }

  deleteTimeEntry(timeEntryId: string): Observable<unknown> {
    let params = new HttpParams();

    params = params.set('timeEntryId', timeEntryId);

    return this.http.delete(this.baseUrl + 'DeleteTimeEntry', { params });
  }

  //#endregion

  //#region Time sheet approval

  getTimeSheetApproval(timeSheetId: string) {
    let params = new HttpParams();

    params = params.append('timesheetGuid', timeSheetId);

    let response = this.http.get<TimesheetApprovalResponse>(
      this.baseUrl + 'TimesheetAproval',
      { observe: 'response', params: params }
    );

    return response.pipe(map((r) => r.body?.Data));
  }

  addTimeSheetApproval(timeSheetId: string) {
    const headers = { 'content-type': 'application/json' };

    let params = new HttpParams();

    params = params.append('timesheetGuid', timeSheetId);

    let response = this.http.post<TimesheetApprovalResponse>(
      this.baseUrl + 'TimesheetAproval',
      null,
      { headers: headers, params: params }
    );

    return response.pipe(map((r) => r.Data));
  }

  //#endregion

  //#region Timesheet Configuration

  getTimeSheetConfiguration() {
    let response = this.http.get<TimesheetConfigResponse>(
      this.baseUrl + 'TimeSheetConfig'
    );

    return response.pipe(map((r) => r.Data));
  }

  addTimeSheetConfiguration(timesheetConfig: TimesheetConfiguration) {
    const headers = { 'content-type': 'application/json' }

    return this.http.post<TimesheetConfigResponse>(this.baseUrl + 'TimeSheetConfig', timesheetConfig, {headers: headers});
  }

  //#endregion

  //#region client and poject from mock server

  getClients(clientIds?: string[]) {
    if (clientIds) {
      let params = new HttpParams();

      for (const index in clientIds) {
        params = params.append('id', clientIds[index]);
      }

      let response = this.http.get<Client[]>('http://localhost:3000/clients', {
        observe: 'response',
        params: params,
      });

      return response.pipe(map((r) => r.body));
    } else {
      return this.http.get<Client[]>('http://localhost:3000/clients');
    }
  }

  getClient(clientId: string) {
    let params = new HttpParams();

    params = params.append('id', clientId);

    let response = this.http.get<Client[]>('http://localhost:3000/clients', {
      observe: 'response',
      params: params,
    });

    return response.pipe(map((r) => r.body));
  }

  getProjects(userId: string, clientId?: string) {
    let params = new HttpParams();

    params = params.append('employeeId', userId);

    if (clientId) {
      params = params.append('clientId', clientId);
    }

    let response = this.http.get<Project[]>('http://localhost:3000/projects', {
      observe: 'response',
      params: params,
    });

    return response.pipe(map((r) => r.body));
  }

  getProject(projectId: string) {
    let params = new HttpParams();

    params = params.append('id', projectId);

    let response = this.http.get<Project[]>('http://localhost:3000/projects', {
      observe: 'response',
      params: params,
    });

    return response.pipe(map((r) => r.body));
  }
  //#endregion
  getUserTimesheetApprovalSubmissions(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filters: Array<{ key: string; value: string[] }>
  ) {
    let params = new HttpParams()
      .append('PageIndex', `${pageIndex}`)
      .append('PageSize', `${pageSize}`)
      .append('SortField', `${sortField}`)
      .append('SortOrder', `${sortOrder}`)
      .append('EmployeeGuId', `${localStorage.getItem('userId')}`);
    if (filters)
      for (let i = 0; i < filters.length; i++) {
        if (filters[i].key == 'Project' && filters[i].value)
          for (let j = 0; j < filters[i].value.length; j++)
            params = params.append('ProjectFilters', filters[i].value[j]);

        if (filters[i].key == 'Client' && filters[i].value)
          for (let z = 0; z < filters[i].value.length; z++)
            params = params.append('ClientFilters', filters[i].value[z]);

        if (filters[i].key == 'Status') {
          for (let w = 0; w < filters[i].value.length; w++)
            params = params.append('StatusFilter', filters[i].value[w]);
        }
        if (filters[i].key == 'DateWeek' && filters[i].value)
          params = params.append('DateWeek', filters[i].value.toLocaleString());
      }

    const clientNameFliter: { text: string; value: string }[] = [] as {
      text: string;
      value: string;
    }[];
    const projectNameFliter: { text: string; value: string }[] = [] as {
      text: string;
      value: string;
    }[];
    const statusFilter: { text: string; value: string }[] = [] as {
      text: string;
      value: string;
    }[];
    return this.http
      .get(`${this.baseUrl}UserTimesheetApprovalsHistory?` + params.toString())
      .pipe(
        map((response: any) => {
          if(Object.keys(response.Data.Filters).length!= 0)
          { for (let i = 0; i < response.Data.Filters.ClientFilter.length; i++)
              clientNameFliter.push({
                text: response.Data.Filters.ClientFilter[i].ClientName,
                value: response.Data.Filters.ClientFilter[i].Guid,
              });
             
            for (let i = 0; i < response.Data.Filters.StatusFilter.length; i++)
              statusFilter.push({
                text: response.Data.Filters.StatusFilter[i],
                value: response.Data.Filters.StatusFilter[i],
              });
            
            for (let i = 0; i < response.Data.Filters.ProjectFilter.length; i++)
              projectNameFliter.push({
                text: response.Data.Filters.ProjectFilter[i].ProjectName,
                value: response.Data.Filters.ProjectFilter[i].ProjectId,
              });
        }
          return {
            data: response.Data.UserTimesheetApprovals,
            pagination: {
              pageIndex: response.Data.PageIndex,
              totalPage: response.Data.TotalPage,
              pageSize: response.Data.PageSize,
              totalRecord: response.Data.TotalRecord,
            },
            projectFilter: projectNameFliter,
            clientFilters: clientNameFliter,
            statusFilter: statusFilter,
          };
        })
      );
  }
 

  getTimesheetApprovalPagination(

    pageindex: number,

    pageSize: number,

    searchKey?: string,

    SortBy?: string,

    ProjectName?: string,

    ClientName?: string,

    Week?: string,

    sort?: string,

    status ?:string

  ): Observable<PaginatedResult<TimesheetApproval[]>> {

    const params = new HttpParams()

      .set('PageIndex', pageindex.toString())

      .set('PageSize', pageSize.toString())

      .set('searchKey', searchKey ? searchKey : '')

      .set('SortBy', SortBy? SortBy:'')

      .set('ProjectName', ProjectName ? ProjectName:'')

      .set('ClientName',ClientName ? ClientName:'')

      .set('Week',Week? Week:'')

      .set('sort',sort ? sort:'Ascending')

      .set('status', status ? status :'');

    let paginatedResult: PaginatedResult<TimesheetBulkApproval[]> = {
      data: [] as TimesheetBulkApproval[],
      pagination: {} as Pagination,
    };
    return this.http.get(`${this.baseUrl}TimesheetsApprovalPaginated?` + params.toString()).pipe(
      map((response: any) => {
        paginatedResult = {
          data: response.Data,
          pagination: {
            pageIndex: response.PageIndex,
            totalPage: response.TotalPage,
            pageSize: response.PageSize,
            totalRecord: response.TotalRecord,
          },
        };
        return paginatedResult;
      })
    );
  }

  updateTimesheetApproval(timesheetApproval: ApprovalEntity): Observable<any> {
    const headers = { "content-type": "application/json" };

    return this.http.put(this.baseUrl + "ProjectStatus", timesheetApproval, { "headers": headers });
  }

  updateTimeSheetStatus(arrayOfId: string[]) {
    console.log("updateStatus"+arrayOfId);

    return this.http.post(this.baseUrl + 'TimesheetApprovalBulkApprove',arrayOfId).subscribe((response:any)=>{
      if (response.ResponseStatus.toString() == 'Success') {
        this.notification.success("Bulk approval successfull","", { nzPlacement: 'bottomRight' });
      }
      else{
        this.notification.error("Bulk approval is not successfull","", { nzPlacement: 'bottomRight' });
      }
    });
  }

  updateTimesheetProjectApproval(approval: TimesheetApproval) {
    const headers = { 'content-type': 'application/json' };

    return this.http.put<TimesheetApprovalResponse>(
      this.baseUrl + 'TimesheetProjectStatus', approval,{ headers: headers }).subscribe((response:any)=>{
        if (response.ResponseStatus.toString() == 'Success') {
          this.notification.success(this.success,"",
          { nzPlacement: 'bottomRight' }

          );
          this.statusChanged=true;
          this.timesheetApprove=approval;
        }
        else{

          this.notification.error(this.error,"",
          { nzPlacement: 'bottomRight' }
          );
          this.statusChanged=false;

        }
      });
    }

}
