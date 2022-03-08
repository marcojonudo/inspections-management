export class Client {

	name: string;
	surnames: string;
	phoneNumber: number;
	email: string;

	constructor(client: any) {
		this.name = client.name;
		this.surnames = client.surnames;
		this.phoneNumber = client.phoneNumber;
		this.email = client.email;
	}

}
