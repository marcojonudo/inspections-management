export class Image {

	id: number;
	image: string;
	landscape: boolean;

	constructor(image: any) {
		this.id = image.id;
		this.image = image.image;
		this.landscape = image.landscape;
	}

}
