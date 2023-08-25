import { Injectable } from '@angular/core';
import { Constants } from '../utils/constants';

@Injectable({
	providedIn: 'root'
})
export class LocalStorageService {

	static setItem(key, value): void {
		localStorage.setItem(key, JSON.stringify(value));
	}

	static getItem(key): any {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : undefined;
	}

	static clear(): void {
		const version = this.getItem(Constants.LOCAL_STORAGE.VERSION);
		localStorage.clear();
		this.setItem(Constants.LOCAL_STORAGE.VERSION, version);
	}

}
