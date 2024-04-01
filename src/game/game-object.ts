import { EventEmitter } from "events";
import { Game } from "./game";

export abstract class GameObject extends EventEmitter{
	protected _id = ''

	public x = 0

	public y = 0

	protected _hasInitialized = false

    public get id() {
        return this._id
    }

	constructor (public readonly game: Game) {
        super()
    }

	get hasInitialized () {
		return this._hasInitialized
	}

	public abstract init(): void | Promise<void>;

	public abstract update(dt: number): void | Promise<void>;

	public abstract render(dt: number): void | Promise<void>;

	public abstract destroy(): void | Promise<void>;

	public setPosition(x: number, y: number) {
		this.x = x
		this.y = y
	}
}