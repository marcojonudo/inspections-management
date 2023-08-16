import { HideAction } from './hide-action';
import { RemoveTextAction } from './remove-text-action';
import { Action } from './action';
import { SetAction } from './set-action';
import { ShowAction } from './show-action';

export class ActionType {

	private static all: { [name: string]: ActionType } = {};

	static readonly HIDE = new ActionType(
		'HIDE',
		() => new HideAction()
	);

	static readonly SHOW = new ActionType(
		'SHOW',
		() => new ShowAction()
	);

	static readonly SET = new ActionType(
		'SET',
		() => new SetAction()
	);

	static readonly REMOVE_TEXT = new ActionType(
		'REMOVE_TEXT',
		() => new RemoveTextAction()
	);

	id: string;
	buildAction: () => Action;

	constructor(id: string, buildAction: () => Action) {
		this.id = id;
		this.buildAction = buildAction;
		ActionType.all[id] = this;
	}

	static parse(id: string): ActionType {
		return ActionType.all[id];
	}

}
