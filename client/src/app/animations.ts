import { animate, group, query, style, transition, trigger } from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
	transition('HomePage => InspectionPage', [
		style({ position: 'relative', 'overflow-x': 'hidden' }),
		query(':enter', [style({ transform: 'translateX(100%)' })]),
		group([
			query(':leave', [animate('.5s cubic-bezier(0.5, 0.25, 0,1)', style({ transform: 'translate3d(-100%, 0, 0)' }))], { optional: true }),
			query(':enter', [animate('.5s cubic-bezier(0.5, 0.25, 0,1)', style({ transform: 'translate3d(0, 0, 0)' }))])
		])
	]),
	transition('InspectionPage => HomePage', [
		style({ position: 'relative', 'overflow-x': 'hidden' }),
		query(':enter', [style({ transform: 'translateX(-100%)' })]),
		group([
			query(':leave', [animate('.5s cubic-bezier(0.5, 0.25, 0,1)', style({ transform: 'translate3d(100%, 0, 0)' }))]),
			query(':enter', [animate('.5s cubic-bezier(0.5, 0.25, 0,1)', style({ transform: 'translate3d(0, 0, 0)' }))])
		])
	])
]);

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
