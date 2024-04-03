import { EasyScore, Factory, Formatter, RenderContext, Renderer, RendererBackends, Stave, StemmableNote, Voice } from "vexflow";
import { GameObject } from "./game-object";
import { Game } from "./game";

export interface NoteConfig {
    clef: 'treble' | 'bass',
    note: string,
    time?: string,
    stem?: 'up' | 'down',
}

export class Note extends GameObject {
    protected _id = 'note'

    static readonly STAVE_WIDTH = 30

	readonly SPEED = 100

    public speedFactor = 1

	currentTime = 0

	formatter: Formatter = new Formatter()

	stave: Stave | null = null

	renderer: Renderer | null = null

	voice: Voice | null = null

	score: EasyScore

	vexflowCtx: RenderContext | null = null

	noteConfig: NoteConfig | null = null

	notes: StemmableNote[] = []

	revertMotion = false

	constructor(game: Game) {
		super(game)

		const vf = new Factory({
			renderer: {
				elementId: game.canvas.id,
				width: game.canvas.width,
				height: game.canvas.height
			}
		})

		this.score = vf.EasyScore()
	}

    public getSpeed() {
        return this.speedFactor * this.SPEED
    }

	public setRevertMotion(revertMotion: boolean) {
		this.revertMotion = revertMotion
	}

	public init(): void | Promise<void> {
		if (this.hasInitialized) {
			console.warn(`[${this.id}] has been initialized`)
			return
		}

		this.renderer = new Renderer(this.game.canvas, RendererBackends.CANVAS)

		this.vexflowCtx = this.renderer.getContext()

		this._hasInitialized = true
	}

    public setNoteConfig(noteConfig: NoteConfig) {
        this.noteConfig = noteConfig

        this.updateStave()
    }

    public setPosition(x: number, y: number) {
        super.setPosition(x, y)

        if (this.stave) {
            this.stave.setX(x)

            this.stave.setY(y)
        }
    }

	private updateStave() {
        if (!this.vexflowCtx) {
            throw new Error('You may forgot to initialize note')
        }

        if (!this.noteConfig) return

		const { note, clef, stem, time } = this.noteConfig

		const notes = this.score.notes(note, {
			stem: stem ?? 'up',
			clef: clef ?? 'treble'
		})

		this.notes = [...notes]

        if (!this.stave) {
            this.stave = new Stave(this.x, this.y, Note.STAVE_WIDTH)

            this.stave.setContext(this.vexflowCtx)
        }

		this.voice = this.score.voice(notes, {
            time
        })

        console.log(this.noteConfig)

		this.formatter.joinVoices([this.voice]).format([this.voice], Note.STAVE_WIDTH)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public render(_: number): void | Promise<void> {
        if (!this.vexflowCtx) {
            throw new Error('You may forgot to initialize note')
        }

        if (!this.stave || !this.voice) {
            console.warn('Missing stave')
            return
        }

		// this.stave.draw()

		this.voice.draw(this.vexflowCtx, this.stave)
	}

	public update(dt: number): void | Promise<void> {
        if (!this.stave) return

		let x = this.stave.getX()

		const canvasRect = this.game.canvas.getBoundingClientRect()

		if (this.revertMotion) {
			// If the note is not yet on the right of the screen
			// then move it toward to the right side of the screen
			if (x <= canvasRect.width) {
				x += this.speedFactor * this.SPEED * dt
			}
		} else {
			// If the note is not yet on the left of the screen
			// then move it toward the left of the screen
			if (x >= -Note.STAVE_WIDTH) {
				// Move the note from its original position to the left
				x -= this.speedFactor * this.SPEED * dt
			}
		}

		// Update position
		this.stave.setX(x)

		this.setPosition(x, this.y)
	}

    public destroy() {
        //
    }
}