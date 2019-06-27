import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeamService } from '../services/team.service';
import { AdminService } from '../services/admin.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private teamService: TeamService, private adminService: AdminService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.teamService.getTeam()) {
      req = req.clone({
        setHeaders: {
          authorization: `${this.teamService.getToken()}`
        }
      });
    } else if (this.adminService.loggedIn()) {
      req = req.clone({
        setHeaders: {
          authorization: `${this.adminService.getToken()}`
        }
      });
    }

    return next.handle(req);
  }
}
