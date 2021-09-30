import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
	selector: 'app-splash-screen',
	templateUrl: './splash-screen.component.html',
	styleUrls: ['./splash-screen.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('enterAnimation', [
			transition(
				':enter',
				[
					style({ opacity: 0 }),
					animate('.3s', style({ opacity: 1 }))
				]
			)
		])
	]
})
export class SplashScreenComponent implements OnInit {

	constructor() {
	}

	ngOnInit(): void {
	}

}
