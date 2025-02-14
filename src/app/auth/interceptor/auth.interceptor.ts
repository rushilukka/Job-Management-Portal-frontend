import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          const token = event.headers.get('Authorization'); // Get token from response headers
          console.log('efvdgbrdv',token);
          if (token) {
            // localStorage.setItem('authToken', token); // Save token directly in localStorage
          }
        }
      })
    );
  }
}
