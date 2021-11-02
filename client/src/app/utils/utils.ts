export class Utils {

	static collate(array: any[], size: number): any[] {
		const newArray = [];
		for (let i = 0; i < array.length; i = i + size) {
			newArray.push(array.slice(i, i + size));
		}
		return newArray;
	}

	static sort(array: any[], criteria: any): any[] {
		return array.sort((a, b) => {
			if (criteria(a) < criteria(b)) {
				return -1;
			}
			if (criteria(a) > criteria(b)) {
				return 1;
			}
			return 0;
		});
	}

}
