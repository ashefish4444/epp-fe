import { filter } from 'rxjs/operators';
import { ResponseDTO } from './../../Models/ResponseDTO';
import { Data } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import en from '@angular/common/locales/en';

import {DatePipe, registerLocaleData } from '@angular/common';
import { differenceInCalendarDays, setHours } from 'date-fns';

import { DisabledTimeFn, DisabledTimePartial } from 'ng-zorro-antd/date-picker';
import { GetClient } from '../../Models/get-client';
import { GetProject } from '../../Models/get-project';
import { ViewReportService } from '../../services/view-report.service';
import { Report,projects } from '../../Models/getReport';
import { ConstantPool } from '@angular/compiler';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'exec-epp-viewreport',
  templateUrl: './viewreport.component.html',
  styleUrls: ['./viewreport.component.scss']
})
export class ViewreportComponent implements OnInit {

  //Data = null;
  clientId = "";
  projectId?="";
  startDate:any;
  endDate:any;
  defualtMonth: Date;
  monthm: any;
  month:any;
  monthyear:any;
  today = new Date();
  firstDay = new Date();
  lastDay = new Date();
  isEnglish = false;
  reportForm = new FormGroup({
    clientIds: new FormControl(''),
    ProjectIds: new FormControl(''),
    months: new FormControl('')
  });

  clientList: GetClient[] = [];
  projectList: GetProject[] =[];
  reportList: Report[] = [];
  //data : any []=[];
  filtered : any []=[];
  employee : any []=[];
  list : any []=[];
  sumBillableHours=0;
  sumNonBillableHours=0;
  public listOfClients: [GetClient] | [] =[];
  public listOfProjects: [GetProject] | [] =[];
  constructor(
    private reportService:ViewReportService,
    public datepipe: DatePipe
  ) {
    this.defualtMonth = new Date();
    this.defualtMonth.setDate(-1 * (this.defualtMonth.getDate() + 1));
  
//let latest_date =this.datepipe.transform(this.defualtMonth, 'yyyy-MM-dd');

  }
  allmonths = [
    {name:'JANUARY',key:0},
    {name:'FEBRUARY',key:1},
    {name:'MARCH',key:2},
    {name:'APRIL',key:3},
    {name:'MAY',key:4},
    {name:'JUNE',key:5},
    {name:'JULAY',key:6},
    {name:'AUGUST',key:7},
    {name:'SEPTEMBER',key:8},
    {name:'OCTOBER',key:9},
    {name:'NOVEMBER',key:10},
    {name:'DECEMBER',key:11}]
    
  ngOnInit(): void {
    //this.clientId="d1f25a6c-3e2e-4d69-882b-9f67f65a6b7f";
    this.month = new Date().getMonth();
    const monthhh = new Date(this.today.getFullYear(), this.today.getMonth()+1, 0);
  this.startDate=  monthhh.setDate(0);
  const mm = new Date(this.today.getMonth());
  const monthh = (new Date().getMonth() + 1).toString();
  console.log("+++++++++++");
  console.log(monthh);
   this.monthm = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  
const d = new Date();
const namem = this.monthm[d.getMonth()- 1];
  //console.log(namem);
// this.defualtMonth = this.monthm[d.getMonth()- 1]
  console.log(namem);
  this.endDate= monthhh.setDate(1);
  console.log("Check start date of month");
  console.log(this.endDate);
  this.map();
  this.disabledDate;
  //this.getReport();
  registerLocaleData(en); 
  this.getAllClientList();
  
  //this.getProjectListByClientId(this.clientId);

  }
  getAllClientList(){
    this.reportService.getClientList().subscribe(
    (async (res:any) => {
      this.clientList = res;
     this.clientId =this.clientList[0].Guid;;
     console.log(this.clientId);
     console.log("++wwwwwwwwwwwwwwwwwwwwwwwtttttttttttttttttt++");
    })
  );
}
  getProjectListByClientId(clientId:any)
  {
    this.reportService.getProjectByClientId(clientId).subscribe(res => {
      this.projectList = res.Data;
      
    });
  }
   
  disabledDate = (current: Date): any =>
    // Can not select days before today and today
    //differenceInCalendarMonths(current,this.today.getMonth()>0)
      differenceInCalendarDays(current, this.today) > 0;
      
    

  onChangesFilterReport(event: string) {
    if (this.clientId === event) {
      this.getProjectListByClientId(this.clientId);
    }
  }


getAllClientLisddt(){
  this.reportService.getClientList().subscribe(
  (async (res:any) => {
    this.clientList = res;
    this.clientList[0].Guid;
    this.clientId="d1f25a6c-3e2e-4d69-882b-9f67f65a6b7f";
  for(let i=0;i<res.count();i++)
  {
    this.reportService.getProjectByClientId(this.clientId).subscribe(res => {
      this.projectList = res.Data;
    console.log("test for the first project");
    console.log(res);
    console.log("Project and and check ");
    console.log(res.Data);
    });
  }
   
  })
);
}
getAllProjectList(){
  this.reportService.getProjectList().subscribe(
  (async (res:any) => {
    this.listOfProjects = res.Data;
  })
);
}
getClientName(value: any) { 
  const result = this.listOfClients.find((obj) => {
    
    return obj.Guid === value;
  });
  //debugger;
  return result?.ClientName;
}
getClientDetail(){
  this.reportService.getAllClientLists().subscribe((response: any) => {
    this.clientList = response;
    console.log("wwwwwwwwwwwwto check");
    console.log(response);
    console.log("tttttttttttttttttttooooooo");
    console.log(response.data);
  });
  
}

FilterClients(cId:any)
{
  this.clientId = cId;
  console.log(cId);
 
}
onGenerateReports()
{
  console.log("Selected Client");
  console.log(this.clientId);
  console.log("Selected Projects")
  console.log(this.projectId);
  console.log("Selected month")
  console.log(this.defualtMonth);
this.firstDay = new Date(this.defualtMonth.getFullYear(), this.defualtMonth.getMonth(), 1);
this.lastDay = new Date(this.defualtMonth.getFullYear(), this.defualtMonth.getMonth() + 1, 0);
const fromDate = this.datepipe.transform(this.firstDay, 'yyyy-MM-dd');
 
console.log("forst date")
console.log(this.firstDay);
console.log("Short date date")
console.log(fromDate);
console.log("last date")
console.log(this.lastDay);
this.getReport(this.clientId,this.firstDay,this.lastDay,this.projectId);
}
getReport(cID:string,sDate:Date,eDate:Date,pID?:string){
 // clientId= "d1f25a6c-3e2e-4d69-882b-9f67f65a6b7f";
 const sDatestring = this.datepipe.transform(sDate, 'yyyy-MM-dd');
 const eDatestring = this.datepipe.transform(eDate, 'yyyy-MM-dd');
 console.log("hhhhhhhhhhhhhhhhhh");
 console.log(sDatestring);
 console.log("eeeeeeeee");
 console.log(eDatestring);
  this.reportService.getReports(cID,sDatestring,eDatestring, pID).subscribe((res:Report[])=>{
  this.reportList=res;
console.log("wwwwwwwwwwwres===>",  this.reportList);
this.filterProjects();
this.sumHours();
  });
  return this.reportList;
 }
  range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  
 


    // interface reports {
    //   no:number;
    //   employeeName:string;
    //   role:string;
    //   billableHours:string ;
    //   nonBillableHours:string;
    //   projectName:string;
    //   clientName:string;
          
    // }
    onChange(): void {
      ;
    }

    onMonthChange(monthDate: Date){
      //TODO: on Month Change
    }
  
    getWeek(result: Date): void {
     // console.log('week: ', getISOWeek(result));
    }
  
    data :any []= [
      {
        ProjectId: "4fc4c039-a216-40b1-af26-4ed35b19a046",
        ProjectName: "AAA",
        ClientGuid: "e177648b-3cf7-42ce-a047-e47f450416fc",
        ClientName: "Ingrem Barge",
        ClientManagerName: null,
        EmployeeGuid: "0cf7169d-5c7c-4ed1-b43e-ddf5d5f46f6e",
        FirstName: "Meba",
        LastName: "Feyissa",
        FullName: "Meba Feyissa",
        EmployeeRoleName: "Product Owner I",
        BillableHours: 18,
        NonBillableHours: 0
      },
      {
        ProjectId: "61849171-acd6-4dd2-8f71-bf2d1f7d5687",
        ProjectName: "AAA",
        ClientGuid: "d1f25a6c-3e2e-4d69-882b-9f67f65a6b7f",
        ClientName: "Engage2Excel",
        ClientManagerName: "Patrick Elalouf",
        EmployeeGuid: "a7d3695b-2cfd-4907-9390-c87c66511081",
        FirstName: "Brook   ",
        LastName: " ",
        FullName: "Brook     ",
        EmployeeRoleName: "Senior Developer II",
        BillableHours: 0,
        NonBillableHours: 80
      },
      {
        ProjectId: "21923ea8-6ac5-463f-a715-c042cd0c363c",
        ProjectName: "BBB",
        ClientGuid: "d1f25a6c-3e2e-4d69-882b-9f67f65a6b7f",
        ClientName: "Engage2Excel",
        ClientManagerName: "Patrick Elalouf",
        EmployeeGuid: "562f820e-6414-438e-a02e-edafa76e6beb",
        FirstName: "Ashenafi ",
        LastName: " ",
        FullName: "Ashenafi   ",
        EmployeeRoleName: "Senior Developer I",
        BillableHours: 0,
        NonBillableHours: 64
      },
      {
        ProjectId: "31feded5-ad32-4cc0-90e5-7c49d4ea57fa",
        ProjectName: "BBB",
        ClientGuid: "d1f25a6c-3e2e-4d69-882b-9f67f65a6b7f",
        ClientName: "Engage2Excel",
        ClientManagerName: "Patrick Elalouf",
        EmployeeGuid: "716e6ff1-f9f9-43b3-b21c-92403d07b5d7",
        FirstName: "Esayas   ",
        LastName: " ",
        FullName: "Esayas     ",
        EmployeeRoleName: "Technical Lead",
        BillableHours: 0,
        NonBillableHours: 76
      },];
      
map (){
 for (let i = 0; i<= this.data.length;i++){
  this.data.forEach(function(value){
  //console.log("Aman"+value);
    

  });
 }
}

reports: any[]=[
    
  {
    projectName: '',
    employees: [ ]
  }
  

]
filterProjects(){
  let project = this.reportList.map (i => i.ProjectName)
  .filter((value, index, self) => self.indexOf(value) === index)
  //const list: any[] = [];
  project.forEach(p => {
    this.list.push({
      ProjectName: p,
      Employee: this.reportList.filter(t => t.ProjectName === p)
    });
  })
  //console.log(project);
  //console.log(this.list)
  //console.log("AA"+this.reportList);
  for (let i = 0; i< project.length;i++){
    var push=  this.filtered.push(project[i]);
    //this.reports.em
    //this.filtered.push("Aman")
    let x = this.reportList.length;
    console.log(x);
    console.log(project[0]);
    console.log(this.reportList[0].ProjectName);
    for (let j = 0; j<x;j++){
      if (project[i] == this.reportList[j].ProjectName){
        this.employee.push(this.reportList[j]);
        
    }
    
    }
    this.filtered.push(this.employee);
  }
  //.log(this.filtered)
  

}
sumHours(){
  this.reportList.forEach((i)=>{
    this.sumBillableHours+=i.BillableHours;
  });
  this.reportList.forEach((i)=>{
    this.sumNonBillableHours+=i.NonBillableHours;
  });
  console.log("Billable Hours"+this.sumBillableHours);
  console.log("Non Billable Hours"+this.sumNonBillableHours);
}


  

  // reports: any[]=[
    
  //   {
  //     projectName: "Epp",
  //     employees: [
  //       {
  //         no: "1",
  //         employeeName: "Amanuel Zewdu",
  //         role : "Developer",
  //         billableHours: "8",
  //         nonBillableHours:"0",
  //         projectName : "Epp",
  //         clientName:"Excellerent ",
    
  //       },
  //       {
  //         no: "2",
  //         employeeName: "Ashenafi Fisseha",
  //         role : "Developer",
  //         billableHours: "8",
  //         nonBillableHours:"0",
  //         projectName : "Epp",
  //         clientName:"Excellerent ",
    
  //       },
  //       {
  //         no: "3",
  //         employeeName: "Yossef Assefa",
  //         role : "Developer",
  //         billableHours: "40",
  //         nonBillableHours:"0",
  //         projectName : "Epp",
  //         clientName:"Excellerent ",
    
  //       },
        
  //     ]
  //   },
  //   {
  //     projectName: "EDC_DB",
  //     employees: [
  //       {
  //         no: "4",
  //         employeeName: "Engdawork Berhane",
  //         role : "Developer",
  //         billableHours: "0",
  //         nonBillableHours:"40",
  //         projectName : "EDC_DB",
  //         clientName:"E2E ",
    
  //       },
  //       {
  //         no: "5",
  //         employeeName: "Hailu Debebe",
  //         role : "Developer",
  //         billableHours: "0",
  //         nonBillableHours:"40",
  //         projectName : "EDC_DB",
  //         clientName:"E2E ",
    
  //       },
  //       {
  //         no: "6",
  //         employeeName: "Abel Asrat",
  //         role : "Developer",
  //         billableHours: "0",
  //         nonBillableHours:"40",
  //         projectName : "EDC_DB",
  //         clientName:"E2E ",
    
  //       }
  //     ]
  //   }

  // ]
    
}