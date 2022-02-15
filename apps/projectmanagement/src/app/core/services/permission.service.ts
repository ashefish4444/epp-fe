import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Permission } from '../models';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  userPrvilage:any;
  private permssionSource=  new BehaviorSubject<Permission[]>({} as Permission[]);
  private userTokenSource= new BehaviorSubject<any>(null);
  permssions$=this.permssionSource.asObservable();
  userPrivilage$=this. userTokenSource.asObservable();
  userEmail=window.sessionStorage.getItem('username');
  useEmails = JSON.parse(localStorage.getItem('loggedInUserInfo') ?? '{}');
  baseUrl = `${environment.baseApiUrl}UserGroups/GetPermissionsByUserEmail?email=${this.userEmail?.toLowerCase()}`;
  baseUrl1 = `${environment.baseApiUrl}UserGroups/GetPermissionsByUserEmail?email=${this.useEmails?.Email?.toLowerCase()}`;
  baseUrl2=`${environment.baseApiUrl}User/UserAuthToken?email=${this.userEmail?.toLowerCase()}`;
  baseUrl3=`${environment.baseApiUrl}User/UserAuthToken?email=${this.useEmails?.toLowerCase()}`;
  constructor(private http: HttpClient) { 
}

setUserPermissions()
{
  this.setUserPrevilage();
  this.http.get(this.baseUrl).subscribe((res:any)=>{
  this.permssionSource.next(res.Data);   
  }, error => {
    console.log(error);
  })
}

setUserPermissionByEmail()
{
  this.setUserPrevilage();
  this.http.get(this.baseUrl1).subscribe((res:any)=>{
  this.permssionSource.next(res.Data);   
  }, error => {
    console.log(error);
  })
}

setUserPrevilage()
{
 this.http.get(this.baseUrl2 || this.baseUrl3).subscribe((res:any)=>{
     this.userPrvilage=res.Data;
     this.userTokenSource.next(res.Data.Token);   
  })
}




get userTokenVaue()
{
  return this.userTokenSource.value;
}

  getUserPermission(key:string):Observable<boolean>{

   return this.permssions$.pipe(
      switchMap((response:any) =>{    
        for(let i=0;i< response.length;i++)  {
               if(response[i].KeyValue.toLowerCase()==key.toLowerCase()){
                    return of(true);  
               }
           };
           return of(false);

      }))
  }

  getUserPermissionByEmail(key:string):Observable<boolean>{

    return this.permssions$.pipe(
       switchMap((response:any) =>{    
         for(let i=0;i< response.length;i++)  {
                if(response[i].KeyValue.toLowerCase()==key.toLowerCase()){
                     return of(true);  
                }
            };
            return of(false);
 
       }))
   }
 
}
