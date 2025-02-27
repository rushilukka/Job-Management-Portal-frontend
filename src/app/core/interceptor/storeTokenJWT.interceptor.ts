import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LOCALSTORAGE } from '../../auth/constants/local-storage.constant';

//will work every time - but here for response from server only 
//only handling responses from the server and storing the JWT if it's present
@Injectable()
export class StoreTokenJWTInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          // Extract token from response body if it exists
          const token = event.body?.data?.LoginTokenJWT || event.headers.get('Authorization');
          
          if (token) {
            localStorage.setItem(LOCALSTORAGE.AUTH_TOKEN, token);
          }
        }
      })
    );
  }
}
