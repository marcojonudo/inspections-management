import { RelationTrigger } from './relation-trigger';

export class SelectTrigger implements RelationTrigger {

	constructor(public matchText: string, public differentMatchText: boolean) {}

	match(newValue: string): boolean {
		return this.differentMatchText ? newValue !== this.matchText : newValue === this.matchText;
	}

}
