export class Centre {

	name: string;
	addressLine1: string;
	addressLine2: string;
	addressLine3: string;
	phoneNumber: string;

	constructor(centre: any) {
		this.name = centre.name.trim();
		this.addressLine1 = centre.addressLine1.trim();
		this.addressLine2 = centre.addressLine2?.trim();
		this.addressLine3 = centre.addressLine3?.trim();
		this.phoneNumber = centre.phoneNumber.trim();
	}

}
