import {Injectable} from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RealTimeService } from '../services/real-time.service';

@Injectable({
	providedIn: 'root'
})
export class SessionIdInterceptor implements HttpInterceptor {

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const sessionId = RealTimeService.sessionId;
		req = req.clone({ setHeaders: { sessionId } });
		return next.handle(req);
	}

}
