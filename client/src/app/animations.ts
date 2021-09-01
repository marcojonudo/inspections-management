import { animate, style, transition, trigger } from '@angular/animations';

export const leaveAnimation = trigger('leaveAnimation', [
	transition(
		':leave',
		[
			style({ opacity: 1 }),
			animate('.3s', style({ opacity: 0 }))
		]
	)
]);

export const inOutAnimation = trigger('inOutAnimation', [
	transition(
		':enter',
		[
			style({ opacity: 0 }),
			animate('.2s', style({ opacity: 1 }))
		]
	),
	transition(
		':leave',
		[
			style({ opacity: 1 }),
			animate('.2s', style({ opacity: 0 }))
		]
	)
]);

export const inOutTranslateAnimation = trigger('inOutTranslateAnimation', [
	transition(
		':enter',
		[
			style({ opacity: 0, transform: 'translateY(25px)' }),
			animate('.2s', style({ opacity: 1, transform: 'translateY(0)' }))
		]
	),
	transition(
		':leave',
		[
			style({ opacity: 1, transform: 'translateY(0)' }),
			animate('.2s', style({ opacity: 0, transform: 'translateY(25px)' }))
		]
	)
]);
