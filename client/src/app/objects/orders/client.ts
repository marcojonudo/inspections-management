export class Client {

	name: string;
	surnames: string;
	phoneNumber: number;

	constructor(client: any) {
		this.name = client.name;
		this.surnames = client.surnames;
		this.phoneNumber = client.phoneNumber;
	}

}
