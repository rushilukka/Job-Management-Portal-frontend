import { Routes } from '@angular/router'; 
import { AuthGuard } from '../app/core/guards/auth.guard';
import { AdminRoleGuard } from '../app/core/guards/role.guard';
import { UserRoleGuard } from '../app/core/guards/users.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./common/landingpage/landingpage.module').then(m => m.LandingpageModule)  
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)   
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule), 
    canActivate: [AuthGuard,UserRoleGuard] 
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), 
    canActivate: [AuthGuard, AdminRoleGuard], 
  },
  {
    path: 'notfound',
    loadChildren: () => import('./common/notfound/notfound.module').then(m => m.NotfoundModule)
  },
  {
    path: 'unauthorized',
    loadChildren: () => import('./common/unauthorized/unauthorized.module').then(m => m.UnauthorizedModule)
  },
  { path: '**', redirectTo: 'notfound',pathMatch: 'full' }  
];
