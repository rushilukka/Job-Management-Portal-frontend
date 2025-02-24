import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminRoleGuard } from './guards/role.guard';
import { UserRoleGuard } from './guards/users.guard';
export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./landingpage/landingpage.module').then(m => m.LandingpageModule)  
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
    loadChildren: () => import('./notfound/notfound.module').then(m => m.NotfoundModule)
  },
  {
    path: 'unauthorized',
    loadChildren: () => import('./unauthorized/unauthorized.module').then(m => m.UnauthorizedModule)
  },
  { path: '**', redirectTo: 'notfound',pathMatch: 'full' }  
];
