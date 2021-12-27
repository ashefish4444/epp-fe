import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiderComponent } from '../../components/application/sider/sider.component';
import { AuthorizationCheck } from '../../services/autherization/authorizationCheck';
import { aoiGuard } from '../../services/navigationGuard/userGuard';
import { educationGuard } from '../../services/navigationGuard/groupGuard';
import { SigninComponent } from '../../features/Account/signin/signin.component';
import { UserDashboardComponent } from '../../features/components/user-dashboard/user-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: SiderComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'user' },
      {
        path: 'personal-information',
        component: SigninComponent,
        canActivate: [AuthorizationCheck]
      },
      {
        path: '/apps/user-management/src/app/features/components/user-dashboard',
        component: UserDashboardComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
