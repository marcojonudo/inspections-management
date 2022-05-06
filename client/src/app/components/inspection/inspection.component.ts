import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../../utils/constants';
import { Employee } from '../../objects/employee';
import { SavedItem } from '../../objects/inspections/saved-items/saved-item';
import { EmployeeService } from '../../services/employee.service';
import { InspectionService } from '../../services/inspection.service';
import { VehicleType } from '../../objects/orders/vehicles/vehicle-type';
import { CategoryItems } from '../../objects/print/category-items';
import { Image } from '../../objects/inspections/image';
import { Order } from '../../objects/orders/order';
import { SavedInspection } from '../../objects/inspections/saved-inspection';
import { Centre } from '../../objects/centre';
import { ItemType } from '../../objects/inspections/items/item-type';
import { Url } from '../../utils/url';
import { HttpClient } from '@angular/common/http';
import { PrintService } from '../../services/print.service';

@Component({
	selector: 'app-inspection',
	templateUrl: './inspection.component.html',
	styleUrls: ['./inspection.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionComponent {

	private readonly EXIT_INSPECTION = 'exit-inspection';
	private readonly IMAGES_ROW_ITEMS = 3;
	private readonly CAR_TYRES = ['DI', 'DD', 'TI', 'TD'];

	adviser: Employee;
	mechanics: Employee[];
	vehicleType: VehicleType;
	tyreGroupedItems: { [key: string]: SavedItem[] };
	showTyreSheet: boolean;
	visualControlSavedItem: SavedItem;
	pressureSavedItem: SavedItem;
	measurementSavedItem: SavedItem;
	groupedCategories: CategoryItems[][];
	groupedImageCategories: CategoryItems[][];
	images: Image[];

	@HostBinding('class') classes = this.EXIT_INSPECTION;

	@HostListener(Constants.EVENT.CLICK, ['$event'])
	onClick(event): void {
		if (event.target.className.includes(this.EXIT_INSPECTION)) {
			this.router.navigate([Constants.PATH.ROOT]);
		}
	}

	constructor(private http: HttpClient, private cdRef: ChangeDetectorRef, private router: Router) {
		this.images = [];
		this.adviser = EmployeeService.findEmployee(this.order.sellerCode);
		this.mechanics = this.savedInspection.items
			.map(i => i.employeeCode)
			.filter((value, index, self) => value && self.indexOf(value) === index)
			.map(employeeCode => EmployeeService.findEmployee(employeeCode));

		this.vehicleType = VehicleType.parse(this.savedInspection.vehicle);

		const savedItems = this.savedInspection.items.filter(i => i.item.header === undefined && i.item.print);
		this.tyreGroupedItems = this.findTyreItems(savedItems);
		const depthCodes = this.CAR_TYRES.map(carTyre => `${Constants.ITEM_CODE.PN}${carTyre}`);
		const depthItems = savedItems.filter(i => depthCodes.find(c => c === i.code) !== undefined);
		this.showTyreSheet = depthItems.find(i => i.imageId) !== undefined;
		this.visualControlSavedItem = savedItems.find(i => i.code === 'CVGN');
		this.pressureSavedItem = savedItems.find(i => i.code === 'PPN');
		this.measurementSavedItem = savedItems.find(i => i.code === 'PN');

		const existentSavedItems = savedItems.filter(i => {
			const selectItem = i.type === ItemType.SELECT.id;
			return !i.hidden && (selectItem ? i.findValue() !== Constants.SELECT_ITEM_OPTION_CODE.NA : true);
		});
		const categories = this.buildPrintCategories(existentSavedItems);
		this.groupedCategories = this.buildGroupedCategories(categories);

		const imageSavedItems = this.savedInspection.items.filter(savedItem => savedItem.imageId);
		if (imageSavedItems.length) {
			const imageIds = imageSavedItems.map(savedItem => savedItem.imageId);
			this.http.get(Url.images(), { params: { ids: `${imageIds.join(',')}` } }).subscribe((images: Image[]) => {
				this.images = images;
				const noTyreImages = imageSavedItems.filter(i => depthCodes.find(c => c === i.code) === undefined);
				if (noTyreImages.length) {
					const imageCategories = this.buildPrintCategories(noTyreImages);
					this.groupedImageCategories = this.buildGroupedImageCategories(imageCategories);
				}
				this.cdRef.detectChanges();
			});
		}
	}

	// region Getters / setters

	get order(): Order {
		return InspectionService.selectedOrderInspection.order;
	}

	get savedInspection(): SavedInspection {
		return InspectionService.selectedSavedInspection;
	}

	get centre(): Centre {
		return InspectionService.centre;
	}

	// endregion

	findTyreItems(savedItems: SavedItem[]): { [key: string]: SavedItem[] } {
		const tyreSavedItems = {};
		this.CAR_TYRES.forEach(carTyre => {
			tyreSavedItems[carTyre] = [];
			Constants.TYRE_ITEM_CODES.forEach(tyreCode => {
				const savedItem = savedItems.find(s => s.code === `${tyreCode}${carTyre}`);
				if (savedItem) {
					tyreSavedItems[carTyre].push(savedItem);
				}
			});
		});
		return tyreSavedItems;
	}

	buildPrintCategories(savedItems: SavedItem[]): CategoryItems[] {
		const categories = [];
		savedItems.forEach(savedItem => {
			if (savedItem.item.category) {
				const existent: CategoryItems = categories.find(cat =>
					cat.category && cat.category.code === savedItem.item.category.code
				);
				if (existent) {
					existent.addItem(savedItem);
				} else {
					categories.push(new CategoryItems([savedItem], savedItem.item.category));
				}
			} else {
				categories.push(new CategoryItems([savedItem]));
			}
		});
		return categories;
	}

	sortCategories(categories: CategoryItems[]): CategoryItems[] {
		return categories.sort((a, b) => {
			if (!a.category) { return 1; }
			if (!b.category) { return -1; }
			else {
				return a.category.order < b.category.order ? -1 : 1;
			}
		});
	}

	buildGroupedCategories(categories: CategoryItems[]): CategoryItems[][] {
		const sortedCategories = this.sortCategories(categories);
		const i = sortedCategories.findIndex(cat => cat.category?.code === 'F');
		return i !== -1 ?
			[sortedCategories.slice(0, i + 1), sortedCategories.slice(i + 1, sortedCategories.length)] :
			[sortedCategories];
	}

	buildGroupedImageCategories(categories: CategoryItems[]): CategoryItems[][] {
		const groupedCategories = [[]];
		const sortedCategories = this.sortCategories(categories);
		sortedCategories.forEach(category => {
			const rows = groupedCategories[groupedCategories.length - 1]
				.map(cat => Math.ceil(cat.items.length / Constants.ROW_IMAGES))
				.reduce((a, b) => a + b, 0);
			const newRows = rows + category.imagesRows.length;
			const pageRows = rows < this.IMAGES_ROW_ITEMS ?
				(newRows - this.IMAGES_ROW_ITEMS > 0 ? newRows - this.IMAGES_ROW_ITEMS : newRows)
				: 0;
			const newPageRows = category.imagesRows.length - pageRows;
			if (newPageRows > 0) {
				if (pageRows > 0) {
					const samePageItems = [].concat(...category.imagesRows.slice(0, pageRows));
					const samePageCategoryItems = category.clone(samePageItems);
					const newPageItems = [].concat(...category.imagesRows.slice(pageRows + 1, category.imagesRows.length));
					const newPageCategoryItems = category.clone(newPageItems);

					groupedCategories[groupedCategories.length - 1].push(samePageCategoryItems);
					groupedCategories.push([newPageCategoryItems]);
				} else {
					groupedCategories.push([category]);
				}
			} else {
				groupedCategories[groupedCategories.length - 1].push(category);
			}
		});
		return groupedCategories;
	}

}
