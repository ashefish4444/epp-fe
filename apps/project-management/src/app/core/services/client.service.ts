import { ApiService } from '../models/apiService';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '..';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends ApiService<Client> {

  constructor(protected httpClient: HttpClient ) {
    super(httpClient);
  }

  getResourceUrl(): string {

    return 'ClientDetails';
  }

}
