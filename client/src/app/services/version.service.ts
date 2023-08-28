import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Url } from '../utils/url';
import { filter, map, tap } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { Constants } from '../utils/constants';

@Injectable({
	providedIn: 'root'
})
export class VersionService {

	constructor(private http: HttpClient) {}

	getVersion(): Observable<any> {
		return this.http.get(Url.info()).pipe(
			map((data: any) => data.git.tags)
		);
	}

	findNewVersion(): Observable<string> {
		return this.getVersion().pipe(
			filter(version => {
				const existent = LocalStorageService.getItem(Constants.LOCAL_STORAGE.VERSION);
				return version && version !== existent;
			}),
			tap(version => {
				console.log(`Updated version from ${LocalStorageService.getItem(Constants.LOCAL_STORAGE.VERSION)} to ${version}`);
				LocalStorageService.setItem(Constants.LOCAL_STORAGE.VERSION, version);
			})
		);
	}
}
