import {
	ChangeDetectionStrategy,
	Component, ElementRef,
	EventEmitter, Inject,
	Input,
	OnDestroy,
	OnInit, Optional,
	Output,
	QueryList,
	Self,
	ViewChildren
} from '@angular/core';
import { TextItemField } from '../../objects/inspections/items/text-item-field';
import { TextSavedItemDataField } from '../../objects/inspections/saved-items/text-saved-item-data-field';
import { MAT_FORM_FIELD, MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NgControl, Validators } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Constants } from '../../utils/constants';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
	selector: 'app-separator-input',
	templateUrl: './separator-input.component.html',
	styleUrls: ['./separator-input.component.sass'],
	providers: [{ provide: MatFormFieldControl, useExisting: SeparatorInputComponent }],
	host: {
		'[class.separator-input-floating]': 'shouldLabelFloat',
		'[id]': 'id'
	},
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeparatorInputComponent
	implements ControlValueAccessor, MatFormFieldControl<TextSavedItemDataField[]>, OnInit, OnDestroy {

	static nextId = 0;

	@ViewChildren('fieldInput') fieldInputs: QueryList<HTMLInputElement>;

	@Input() fields: TextItemField[];
	@Input() model: TextSavedItemDataField[];
	@Output() valueEmitter: EventEmitter<TextSavedItemDataField[]>;

	private _placeholder: string;
	private _required = false;
	private _disabled = false;

	@Input() get placeholder(): string {
		return this._placeholder;
	}

	set placeholder(value: string) {
		this._placeholder = value;
		this.stateChanges.next();
	}

	@Input()
	get required(): boolean {
		return this._required;
	}

	set required(value: boolean) {
		this._required = coerceBooleanProperty(value);
		this.stateChanges.next();
	}

	@Input() get disabled(): boolean {
		return this._disabled;
	}

	set disabled(value: boolean) {
		this._disabled = coerceBooleanProperty(value);
		this._disabled ? this.formGroup.disable() : this.formGroup.enable();
		this.stateChanges.next();
	}

	formGroup: FormGroup;
	stateChanges = new Subject<void>();
	focused = false;
	touched = false;
	controlType = 'separator-input-element';
	id = `separator-input-element-${SeparatorInputComponent.nextId++}`;

	onChange = (_: any) => {
		this.valueEmitter.emit(this.value);
	}
	onTouched = () => {};

	get empty() {
		return !(Object.values(this.formGroup.controls).find(control => control.value) !== undefined);
	}

	get shouldLabelFloat() {
		return this.focused || !this.empty;
	}

	@Input()
	get value(): TextSavedItemDataField[] | null {
		if (this.formGroup.valid) {
			return this.findValue();
		}
		return null;
	}

	set value(value: TextSavedItemDataField[] | null) {
		this.formGroup.setValue(value);
		this.stateChanges.next();
	}

	get errorState(): boolean {
		return this.formGroup.invalid && this.touched;
	}

	constructor(
		private formBuilder: FormBuilder,
		private _focusMonitor: FocusMonitor,
		private _elementRef: ElementRef<HTMLElement>,
		@Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
		@Optional() @Self() public ngControl: NgControl
	) {
		this.valueEmitter = new EventEmitter<TextSavedItemDataField[]>();
		if (this.ngControl != null) {
			this.ngControl.valueAccessor = this;
		}
	}

	ngOnInit() {
		const controlsConfig = {};
		this.model.forEach(field => {
			const itemField = this.fields.find(f => f.order === field.order);
			controlsConfig[this.buildControlKey(field.order)] = [
				field.text, [Validators.required, Validators.maxLength(itemField.maxLength)]
			];
		});
		this.formGroup = this.formBuilder.group(controlsConfig);
	}

	buildControlKey(order: number): string {
		return `field-${order}`;
	}

	findKeyOrder(key: string): number {
		return parseInt(key.split('-')[1], 10);
	}

	ngOnDestroy() {
		this.stateChanges.complete();
		this._focusMonitor.stopMonitoring(this._elementRef);
	}

	onFocusIn() {
		if (!this.focused) {
			this.focused = true;
			this.stateChanges.next();
		}
	}

	onFocusOut(event: FocusEvent) {
		if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
			this.touched = true;
			this.focused = false;
			this.onTouched();
			this.stateChanges.next();
		}
	}

	autoFocusNext(control: AbstractControl, field: TextItemField, nextElement?: HTMLInputElement): void {
		const filledInput = control.value.length === field.maxLength;
		if (filledInput && nextElement) {
			this._focusMonitor.focusVia(nextElement, 'program');
		}
	}

	autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
		if (control.value.length < 1) {
			this._focusMonitor.focusVia(prevElement, 'program');
		}
	}

	setDescribedByIds(ids: string[]) {
		const controlElement = this._elementRef.nativeElement
			.querySelector('.separator-input-container')!;
		controlElement.setAttribute('aria-describedby', ids.join(' '));
	}

	onContainerClick() {
		const controls = Object.values(this.formGroup.controls);
		const invalidIndex = controls.findIndex(control => !control.valid);
		const index = invalidIndex !== -1 ? invalidIndex : controls.length - 1;
		const fieldInput = this.fieldInputs.toArray()[index];
		if (fieldInput) {
			this._focusMonitor.focusVia(fieldInput, 'program');
		}
	}

	writeValue(value: TextSavedItemDataField[] | null): void {
		this.value = value;
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	handleInput(i: number): void {
		/* Si no es el último input, se evalúa si se debe enfocar el siguiente */
		if (i < this.fields.length - 1) {
			const nextElem = this.fieldInputs.toArray()[(i + 1) % this.fieldInputs.length];
			this.autoFocusNext(this.formGroup.controls[this.buildControlKey(i)], this.fields[i], nextElem);
		}
		if (this.value) {
			this.onChange(this.value);
		}
	}

	handleAutoFocusPrev(i: number): void {
		if (i > 0) {
			this.autoFocusPrev(this.formGroup.controls[this.buildControlKey(i)], this.fieldInputs.toArray()[i - 1]);
		}
	}

	findMaxLength(field: TextItemField): number {
		return field.maxLength || Constants.TEXT_ITEM_MAX_LENGTH;
	}

	updateSelect(): void {
		if (this.formGroup.valid) {
			const textSavedItemFields = this.findValue();
			this.onChange(textSavedItemFields);
		}
	}

	findValue(): TextSavedItemDataField[] {
		const keys = Object.keys(this.formGroup.value);
		return keys.map(key => {
			const value = this.formGroup.value[key];
			return new TextSavedItemDataField({ text: value, order: this.findKeyOrder(key) });
		});
	}

}
