import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminRoleGuard } from './guards/role.guard';
import { UserRoleGuard } from './guards/users.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./landingpage/landingpage.module').then(m => m.LandingpageModule) //   Lazy load AuthModule
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) //   Lazy load AuthModule
  
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule), //   Lazy load UsersModule
    canActivate: [AuthGuard,UserRoleGuard] // 🔒 Protected - Only Authenticated Users

  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), //   Lazy load UsersModule
    canActivate: [AuthGuard, AdminRoleGuard], // 🔒 Protected - Only Admins
    // data: { roles: ['admin'] } // 🚀 Pass required roles
  },
  {
    path: 'notfound',
    loadChildren: () => import('./notfound/notfound.module').then(m => m.NotfoundModule)
  },
  {
    path: 'unauthorized',
    loadChildren: () => import('./unauthorized/unauthorized.module').then(m => m.UnauthorizedModule)
  },
  

  { path: '**', redirectTo: 'notfound',pathMatch: 'full' } // Redirect unknown routes to notfound
];
