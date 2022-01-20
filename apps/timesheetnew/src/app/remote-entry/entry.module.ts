import { DatePipe, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { TimesheetModule } from '../timesheet/timesheet.module';

import { RemoteEntryComponent } from './entry.component';

registerLocaleData(en);

@NgModule({
  declarations: [RemoteEntryComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzNotificationModule,
    TimesheetModule,
    RouterModule.forChild([]),
  ],
  providers: [{provide: NZ_I18N, useValue: en_US}, DatePipe],
})
export class RemoteEntryModule {}
