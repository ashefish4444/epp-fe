import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'exec-epp-page-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: MsalService) { }

  ngOnInit(): void {
    
  }

  logout() {
    this.authService.logout();
      window.sessionStorage.clear();
     window.location.reload();

  }

}
