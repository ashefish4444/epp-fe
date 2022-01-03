import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

interface ItemData {
  id: number,
  name: string;
  dateRange: string;
  projectName: number;
  clientName: string;
  hours: number,
  stats: string
}

@Component({
  selector: 'exec-epp-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  total=10;
  pageIndex = 1;
  pageSize = 10;

  sortByParam="";
  sortDirection = "asc";
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ItemData[] = [];
  listOfData: readonly ItemData[] = [];
  setOfCheckedId = new Set<number>();
  timesheetDetail:any;
  isModalVisible=false;
  arrayOfCheckedId:number[] =[];

  @Input() rowData : any[] = [];
  @Input() colsTemplate: TemplateRef<any>[] | undefined;
  @Input() headings: string[] | undefined;
  @Input() bulkCheck: boolean | undefined;
  @Input() status: boolean | undefined;

  qtyofItemsChecked = 0

  @Output() itemsSelected = new EventEmitter<number>();
  @Output() CheckedIds = new EventEmitter<number[]>();






  listOfSelection = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.onAllChecked(true);
      }
    }
  ];


  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
      this.arrayOfCheckedId.push(id);
      console.log(this.setOfCheckedId);
      console.log(this.arrayOfCheckedId)
    } else {
      this.setOfCheckedId.delete(id);
      this.RemoveElementFromArray(id);
      console.log(this.setOfCheckedId);
      console.log(this.arrayOfCheckedId)
    }
this.CheckedIds.emit(this.arrayOfCheckedId);

  }
  RemoveElementFromArray(element: number) {
    this.arrayOfCheckedId.forEach((value,index)=>{
        if(value==element) this.arrayOfCheckedId.splice(index,1);
    });
}

  onItemChecked(id: number, checked: boolean): void {
    this.qtyofItemsChecked = this.qtyofItemsChecked + (checked? 1: -1);
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
    this.itemsSelected.emit(this.qtyofItemsChecked);
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly ItemData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  sorter(heading:string) {
    if (heading === 'Name'){
      this.sortByParam = "name";
    } else if (heading === 'Date Range'){
      this.sortByParam = "dateRange";
    }else if (heading === 'Project Name') {
      this.sortByParam = "projectName";
    } else if (heading === 'Client Name') {
      this.sortByParam = "clientName";
    } else {
      this.sortByParam = "";
    }

    if (this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
    } else {
      this.sortDirection = 'desc';
    }
  }
  showModal(row: any) {
    this.isModalVisible=true;
    this.timesheetDetail=row;

  }
  timesheetDetailClose(event: boolean){
    this.isModalVisible=false;
  }
  

  // PageSizeChange(pageSize: number) {
  //   console.log(pageSize);
  //   this.pageSize = pageSize;
  //   this._clientservice
  //     .getWithPagnationResut(this.pageIndex, pageSize, this.searchProject.value)
  //     .subscribe((response: PaginatedResult<Client[]>) => {
  //       this.clientsdata = response.data;
  //       this.pageIndex = response.pagination.pageIndex;
  //       this.pageSize = response.pagination.pageSize;
  //       this.loading = false;

  //     });
  // }

  // PageIndexChange(index: any): void {

  //   if(this.isFilter){
  //    this.clientsdata =this.totalData.slice((index-1)*10,index*10);

  //   }
  //   else{
  //    this.pageIndex = index;
  //    this.loading = true;
  //    if (this.searchProject.value?.length > 1 && this.searchStateFound == true) {
  //      this._clientservice
  //        .getWithPagnationResut(index, 10, this.searchProject.value)
  //        .subscribe((response: PaginatedResult<Client[]>) => {
  //          this.clientsdata = response.data;
  //          this.unfilteredData = response.data;
  //          this.pageIndex = response.pagination.pageIndex;
  //          this.total = response.pagination.totalRecord;

  //          this.totalPage = response.pagination.totalPage;
  //          this.pageSize = response.pagination.pageSize;
  //          this.loading = false;
  //        });


  //    } else {
  //      this._clientservice
  //        .getWithPagnationResut(index, 10)
  //        .subscribe((response: PaginatedResult<Client[]>) => {
  //          this.clientsdata = response.data;
  //          this.unfilteredData = response.data;
  //          this.pageIndex = response.pagination.pageIndex;
  //          this.pageSize = response.pagination.pageSize;
  //          this.loading = false;
  //          if((this.searchAddressList.length > 0) || (this.searchstatusList.length> 0) || (this.searchsalesPersonList.length> 0)){
  //            this.search(
  //              this.searchAddressList,
  //              this.searchstatusList,
  //              this.searchsalesPersonList
  //            );

  //          }


  //        });
  //      this.searchStateFound = false;
  //    }}
  //  }

}



