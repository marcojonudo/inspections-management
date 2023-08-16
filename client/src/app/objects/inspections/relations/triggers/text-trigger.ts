import { RelationTrigger } from './relation-trigger';

export class TextTrigger implements RelationTrigger {

	match(newValue: string): boolean {
		return true;
	}

}
