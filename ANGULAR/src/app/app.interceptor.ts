import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroments } from './shared/enviroment';

@Injectable()
export class mainInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem("token")
    if (authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: authToken
        }
      });
    }

    const updatedRequest = request.clone({
      url: request.url.replace('api', enviroments.REST_API_DOMAIN),
    });

    // Pass the updated request to the next interceptor or the HTTP handler
    return next.handle(updatedRequest);
  }
}
