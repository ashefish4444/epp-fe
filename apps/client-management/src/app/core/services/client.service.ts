import { ApiService } from '../models/apiService';
import { Client, CreateClient } from '..';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClientService extends ApiService<Client> {
  constructor(
    protected httpClient: HttpClient,
    private notification: NzNotificationService,
    private router: Router
  ) {
    super(httpClient);
  }
  private createClientSource = new BehaviorSubject<CreateClient>(
    {} as CreateClient
  );
  createClientSource$ = this.createClientSource.asObservable();

  getResourceUrl(): string {
    return 'ClientDetails';
  }

  updateCreateClientData(data: CreateClient) {
    this.createClientSource.next(data);
  }

  getCreateClientDataValue() {
    return this.createClientSource.value;
  }

  addClient() {
    if (this.getCreateClientDataValue() != ({} as CreateClient)) {
      this.post(this.getCreateClientDataValue()).subscribe(
        (response: any) => {
          if (response.ResponseStatus == 'error')
            this.notification.error(
              'Client Not Added',
              'Please try again letter'
            );
          else {
            this.notification.success('Client Added Successfully', '');
            this.updateCreateClientData({} as CreateClient);
          }
        },
        () => {
          this.notification.error(
            'Client  Not Added',
            'Please try again letter'
          );
        }
      );
    }
  }
}
