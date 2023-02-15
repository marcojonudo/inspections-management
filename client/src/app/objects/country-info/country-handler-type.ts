import { CountryHandler } from './country-handler';
import { SpainHandler } from './spain-handler';
import { PortugalHandler } from './portugal-handler';

export class CountryHandlerType {

	private static all: { [name: string]: CountryHandlerType } = {};

	static readonly SPAIN_HANDLER = new CountryHandlerType('es', new SpainHandler());
	static readonly CATALONIA_HANDLER = new CountryHandlerType('ca', new SpainHandler());
	static readonly PORTUGAL_HANDLER = new CountryHandlerType('pt', new PortugalHandler());

	id: string;
	handler: CountryHandler;

	constructor(id: string, handler: CountryHandler) {
		this.id = id;
		this.handler = handler;
		CountryHandlerType.all[id] = this;
	}

	static parse(id: string): CountryHandlerType {
		return CountryHandlerType.all[id];
	}

}
