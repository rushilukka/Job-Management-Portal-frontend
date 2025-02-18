import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS,   provideHttpClient,  withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToasterService } from './core/components/toaster.service';
import { StoreTokenJWTInterceptor } from './interceptor/storeTokenJWT.interceptor';
import { SetHeaders_CheckExpireJWT_Interceptor } from './interceptor/setHeaders-CheckExpireJWT.interceptor';
 

export const appConfig: ApplicationConfig = {
  providers: [
     provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
  
    provideHttpClient(withInterceptorsFromDi()), //   Correct way to use class-based interceptors
    provideAnimations(), 
    ToasterService,
 
    
    { provide: HTTP_INTERCEPTORS, useClass: SetHeaders_CheckExpireJWT_Interceptor, multi: true }, //  Second (Request)
    { provide: HTTP_INTERCEPTORS, useClass: StoreTokenJWTInterceptor, multi: true }, //  Second (Request)
    // { provide: AuthInterceptor, useClass: AuthInterceptor },
     
  ]
}; 