import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Data, Router } from '@angular/router';
import { NzTableFilterList } from 'ng-zorro-antd/table';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ColumnItem } from '../../Models/ColumnItem';
import { listtToFilter } from '../../Models/listToFilter';
import { PaginationResult } from '../../Models/PaginationResult';
import { IUserList } from '../../Models/User/UserList';
import { UserParams } from '../../Models/User/UserParams';
import { UserService } from '../../Services/user.service';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: 'exec-epp-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
 
  loading = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  userList$ : Observable<IUserList[]>= new Observable<IUserList[]>();
  listOfData: readonly Data[] = [];
  listOfCurrentPageData: readonly Data[] = [];
  userList : IUserList[] = [];
  paginatedResult !: PaginationResult<IUserList[]>;
  userParams = new UserParams();
  searchStateFound !: boolean;
  pageSize = 10;
  pageIndex = 1;
  totalRows !:number;
  totalRecord !: number;
  beginingRow !: number;
  lastRow !: number;
  userName!: string;
  holdItDepartment: listtToFilter[] = [];
  holdItJobTitle: listtToFilter[] = [];
  holdItStatus: listtToFilter[] = [];

  userListJobTitle : NzTableFilterList=[];
  userListStatus: NzTableFilterList=[];
  userListDepartment: NzTableFilterList=[];
  userListLastActivityDate: NzTableFilterList=[];
  userListFullName : NzTableFilterList=[];

  listOfColumns!: ColumnItem<IUserList>[];

  listOfColumnsFullName: ColumnItem<IUserList>[] = [
    {
      name: 'Name',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: IUserList, b: IUserList) => a.FullName.length - b.FullName.length,
      filterMultiple: false,
      listOfFilter: this.userListFullName,
      filterFn: null
    },
    {
      name: 'Last Activity',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: IUserList, b: IUserList) => a.LastActivityDate.length - b.LastActivityDate.length,
      filterMultiple: true,
      listOfFilter:this.userListLastActivityDate,
      filterFn: (list: string[], item: IUserList) => list.some(name => item.LastActivityDate.indexOf(name) !== -1)
    }
  ]

  @ViewChild('searchInput', { static: true })
  input!: ElementRef;
  
  constructor(private userService : UserService,private _router: Router) {

  }

  ngOnInit(): void {
    this.userList as IUserList[];
    this.FeatchAllUsers();
  }

  FeatchAllUsers() {
    this.loading = true;
    this.userService.SearchEmployeeData(this.userParams).subscribe((response:PaginationResult<IUserList[]>) => {
      if(response.Data) {
        this.userList$=of(response.Data);
        this.userList = response.Data;
        this.listOfCurrentPageData = response.Data;
        this.pageIndex=response.pagination.PageIndex;
        this.pageSize=response.pagination.PageSize;
        this.totalRecord=response.pagination.TotalRecord
        this.totalRows=response.pagination.TotalRows;
        this.lastRow = this.totalRows;
        this.beginingRow = 1;
        this.FillTheFilter();
        this.loading = false;
      }
      else
      {
        this.loading = false;
        this.userList = [];
        this.userList$=of([]);
        this.FillTheFilter();
      }

    },error => {
      this.loading = false;
      this.PopulateFilterColumns();
     });
    this.searchStateFound=false;
  }

  PopulateFilterColumns() : ColumnItem<IUserList>[] {
    return this.listOfColumns = [
          {
            name: 'Department',
            sortOrder: null,
            sortDirections: ['ascend', 'descend', null],
            sortFn: (a: IUserList, b: IUserList) => a.Department.length - b.Department.length,
            filterMultiple: true,
            listOfFilter:this.userListDepartment,
            filterFn: (list: string[], item: IUserList) => list.some(name => item.Department.indexOf(name) !== -1)
          },
          {
            name: 'Status',
            sortOrder: null,
            sortDirections: ['ascend', 'descend', null],
            sortFn: (a: IUserList, b: IUserList) => a.JobTitle.length - b.JobTitle.length,
            filterMultiple: true,
            listOfFilter: this.userListJobTitle,
            filterFn: (list: string[], item: IUserList) => list.some(name => item.Status.indexOf(name) !== -1)
          },
          {
            name: 'Status',
            sortOrder: null,
            sortDirections: ['ascend', 'descend', null],
            sortFn: (a: IUserList, b: IUserList) => a.Status.length - b.Status.length,
            filterMultiple: true,
            listOfFilter: this.userListStatus,
            filterFn: (list: string[], item: IUserList) => list.some(name => item.Status.indexOf(name) !== -1)
          }
      ];
  }

  FillTheFilter() {
    this.holdItJobTitle.length = 0;
    this.holdItStatus.length = 0;
    this.holdItDepartment.length = 0;
    this.userList$.subscribe(
       val => {
           if(val.length > 0){
          this.userList = val
          for(let i=0; i < this.userList.length;i++){
            if(this.holdItDepartment.findIndex(x=>x.text === this.userList[i].Department.trim()) === -1 ){
                this.holdItDepartment.push(
                {
                  text: this.userList.map(x=>x.Department)[i],
                  value:this.userList.map(x=>x.Department)[i]
                })
              }
          }
          for(let i=0; i < this.userList.length;i++){
            if(this.holdItJobTitle.findIndex(x=>x.text === this.userList[i].JobTitle.trim()) === -1){
              this.holdItJobTitle.push(
                {
                  text:this.userList.map(x=>x.JobTitle)[i],
                  value:this.userList.map(x=>x.JobTitle)[i]
                }
              )
            }

          }
          for(let i=0; i < this.userList.length;i++){
              if(this.holdItStatus.findIndex(x=>x.text === this.userList[i].Status.trim()) === -1){
              this.holdItStatus.push(
                {
                  text:this.userList.map(x=>x.Status)[i],
                  value:this.userList.map(x=>x.Status)[i]
                }
              )

            }
          }

          this.userListDepartment= this.holdItDepartment,
          this.userListStatus=this.holdItStatus,
          this.userListJobTitle =this.holdItJobTitle

          if(this.userList.length > 0) {
            this.PopulateFilterColumns();
          }
        }
        else{
          this.PopulateFilterColumns();
      }
    });
  }

  SearchUsersByUserName() {
  if(this.userName.length > 2 || this.userName == ""){
    this.userParams.userName = this.userName;
    this.userService.SearchEmployeeData(this.userParams)
    .subscribe((response: PaginationResult<IUserList[]>) => {
      if(response.Data) {
        this.userList$=of(response.Data);
        this.userList = response.Data;
        this.listOfCurrentPageData = response.Data;
        this.pageIndex=response.pagination.PageIndex;
        this.pageSize=response.pagination.PageSize;
        this.totalRecord=response.pagination.TotalRecord
        this.totalRows=response.pagination.TotalRows;
        this.lastRow = this.totalRows;
        this.beginingRow = 1;
        this.FillTheFilter();
        this.loading = false;
      }
      else
      {
        this.loading = false;
        this.userList = [];
        this.userList$=of([]);
        this.FillTheFilter();
      }
      this.searchStateFound=true;
    },error => {
      this.loading = false;
      this.PopulateFilterColumns();
     });
    }
  }

  ngAfterViewInit() {

    fromEvent<any>(this.input.nativeElement,'keyup')
    .pipe(
      map(event => event.target.value),
      startWith(''),
      debounceTime(3000),
      distinctUntilChanged(),
      switchMap( async (search) => {this.userName = search,
      this.SearchUsersByUserName()
      })
    ).subscribe();
  }

  PageIndexChange(index: any): void {
    this.loading =true;
    this.userParams.pageIndex = index;
    this.userParams.userName = this.userName ?? "";
    if(this.searchStateFound == true)
    {
      this.userService.SearchEmployeeData(this.userParams).subscribe(
        (response:PaginationResult<IUserList[]>)=>{
          this.userList$ = of(response.Data);
          this.userList= response.Data;
          this.totalRows = response.pagination.TotalRows;
          this.pageIndex = response.pagination.PageIndex;
          if(this.totalRows === this.pageSize)
          {
            this.lastRow = this.pageSize * index;
            this.beginingRow = (this.totalRows * (index-1)) + 1;
          }
          else if((this.totalRows < this.pageSize))
          {
            this.lastRow = this.totalRecord;
            this.beginingRow = (this.totalRecord - this.totalRows) + 1;
          }
          this.loading =false;
          this.FillTheFilter();
        });
    } else {
      this.userService.SearchEmployeeData(this.userParams)
      .subscribe((response:PaginationResult<IUserList[]>)=>{
        this.userList$=of(response.Data);
        this.userList = response.Data;
        this.totalRows = response.pagination.TotalRows;
        this.pageIndex = response.pagination.PageIndex;
        if(this.totalRows === this.pageSize)
        {
          this.lastRow = this.pageSize * index;
          this.beginingRow = (this.totalRows * (index-1)) + 1;
        }
        else if((this.totalRows < this.pageSize))
        {
          this.lastRow = this.totalRecord;
          this.beginingRow = (this.totalRecord - this.totalRows) + 1;
        }
        this.loading =false;
        this.FillTheFilter();
      });
      this.searchStateFound=false;
      this.loading = false;
    }
  }

  AddToGroup(userId: string) {

  }

  Remove(userId: string) {

  }
}
