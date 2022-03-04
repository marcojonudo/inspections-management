export class ItemType {

	private static all: { [name: string]: ItemType } = {};

	static readonly SELECT = new ItemType('SELECT');
	static readonly TEXT = new ItemType('TEXT');
	static readonly TEXT_AREA = new ItemType('TEXT_AREA');

	id: string;

	constructor(id: string) {
		this.id = id;
		ItemType.all[id] = this;
	}

	static parse(id: string): ItemType {
		return ItemType.all[id];
	}

}
