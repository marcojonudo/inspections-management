import { SelectTrigger } from './select-trigger';
import { TextTrigger } from './text-trigger';
import { RelationTrigger } from './relation-trigger';

export class TriggerType {

	private static all: { [name: string]: TriggerType } = {};

	static readonly SELECT = new TriggerType(
		'SELECT',
		(matchText: string, differentMatchText: boolean) => new SelectTrigger(matchText, differentMatchText)
	);

	static readonly TEXT = new TriggerType(
		'TEXT',
		() => new TextTrigger()
	);

	id: string;
	buildRelationTrigger: (matchText: string, differentMatchText: boolean) => RelationTrigger;

	constructor(id: string, buildRelationTrigger: (matchText: string, differentMatchText: boolean) => RelationTrigger) {
		this.id = id;
		this.buildRelationTrigger = buildRelationTrigger;
		TriggerType.all[id] = this;
	}

	static parse(id: string): TriggerType {
		return TriggerType.all[id];
	}

}
