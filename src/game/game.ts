import { GameObject } from "./game-object";
import { EventEmitter } from 'events'
import { NotesManager, NotesManagerEvents } from "./notes-manager";
import { Staff } from "./staff";
import { isNaN } from "lodash";
import { MIDIInputable, MIDI_EVENTS } from "./midi-inputable";
import { MockMidiController } from "./keyboard-controller";
import { AppConfigs, MIDIControllers } from "@src/configs/app.config";
import { MidiController } from "./midi-controller";

export const GAME_EVENTS = {
	/* Game Events */
	RESIZE: 'game:resize',
	GOT_POINT: 'game:got_point',
	MISSED_POINT: 'game:missed_point',
	ENDGAME: 'game:end'
}

export class Game extends EventEmitter {
    private midiController: MIDIInputable = AppConfigs.midiController === MIDIControllers.PIANO ? MidiController : MockMidiController

    private notesManager: NotesManager;

    private _canvas: HTMLCanvasElement

    private ctx: CanvasRenderingContext2D

    private _initialized = false

    private gameObjects: GameObject[] = []

    public get canvas() {
        return this._canvas
    }

    constructor (canvas: HTMLCanvasElement) {
        super()

        this._canvas = canvas

		const ctx = this._canvas.getContext('2d')

		if (!ctx) {
			throw new Error('This browser does not support rendering context')
		}

		this.ctx = ctx

		// Make sure the canvas size fits the CSS size
		this._canvas.width = this._canvas.clientWidth

		this._canvas.height = this._canvas.clientHeight

        this.ctx.imageSmoothingEnabled = true

        this.ctx.imageSmoothingQuality = 'high'

        this.notesManager = new NotesManager(this)
    }

    public get initialized () {
        return this._initialized
    }

    public init() {
        if (this.initialized) return

        // Init Midi Controller

        // Already init in pre-game.tsx
        // this.midiController.init()

        this.midiController.on(MIDI_EVENTS.NOTE_ON, this.onMidiNoteOn.bind(this))

        this.midiController.on(MIDI_EVENTS.NOTE_OFF, this.onMidiNoteOff.bind(this))

        // Init Notes Manager
        this.notesManager.init()

        this.notesManager.on(NotesManagerEvents.NOTE_HIT_ENDPOINT, this.onMissedNote.bind(this))

        // Init Game Objects
        this.initGameObjects()

        this._initialized = true

        console.log('Game has been initialized')
    }

    private initGameObjects() {
        const staff = new Staff(this)

        // 20 is half height of the staff
        // the staff is drawn from the top to bottom
        staff.setPosition(0, (this.canvas.height / 2) - 20)

        staff.init()

        this.gameObjects.push(staff, this.notesManager)
    }

    private onMidiNoteOn(hitNote: string) {
		if (hitNote === 'C8' || hitNote === 'C#8') {
			this.emit(GAME_EVENTS.ENDGAME);
			return;
		}

        const note = this.notesManager.currentNoteStr

        if (!note) return

        if (this.compareTwoNotes(note, hitNote)) {
            this.onHitNote(note)
        } else {
            this.onMissedNote(note)
        }

        this.notesManager.resetNote()
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onMidiNoteOff(_: string) {
        //
    }

    private onHitNote(note: string) {
        const totalTravelTime = this.canvas.width / this.notesManager.getNote().getSpeed()

        const timing = this.notesManager.hitTime / totalTravelTime

        this.emit(GAME_EVENTS.GOT_POINT, note, timing)
    }

    private onMissedNote(note: string) {
        this.emit(GAME_EVENTS.MISSED_POINT, note)
    }

    public run() {
        /* Keep track of time */
		let previousTime = 0

		let deltaTime = 0

		const draw = (currentTime: number) => {
			// Convert time to seconds
			currentTime *= 0.001

			deltaTime = currentTime - previousTime

			previousTime = currentTime

			this.update(deltaTime)

			this.render(deltaTime)

			requestAnimationFrame(draw)
		}

		requestAnimationFrame(draw)
    }

    private update(dt: number) {
        for (const obj of this.gameObjects) {
            obj.update(dt)
        }
    }

    private render(dt: number) {
        this.resizeCanvasToDisplaySize()

        // Clear canvas for redraw
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        for (const obj of this.gameObjects) {
            obj.render(dt)
        }
    }

    public destroy() {
        for (const obj of this.gameObjects) {
            obj.destroy()
        }

		this.gameObjects = []

        // this.midiController.destroy()

        this.removeAllListeners()
    }

    private resizeCanvasToDisplaySize() {
		const width = this.canvas.clientWidth

		const height = this.canvas.clientHeight

		if (this.canvas.width !== width || this.canvas.height !== height) {
			this.canvas.width = width

			this.canvas.height = height

            this.ctx.imageSmoothingEnabled = true

            this.ctx.imageSmoothingQuality = 'high'

			// Emit resize event
			this.emit(GAME_EVENTS.RESIZE)
		}
	}

    public getGameObjectById (id: string): GameObject | undefined {
		return this.gameObjects.find((obj) => obj.id === id)
	}

	public getGameObjectsByClass(c: typeof GameObject) {
		return this.gameObjects.filter((obj) => Object.getPrototypeOf(obj).constructor === c)
	}

    // Helper
    private compareTwoNotes(n1: string, n2: string) {
        let n1Note: string, n1Accidental: string, n1Octave: string
        let n2Note: string, n2Accidental: string, n2Octave: string

        if (n1.length === 2) {
            n1Note = n1[0]
            n1Octave = n1[1]
            n1Accidental = ''
        } else if (n1.length === 3) {
            n1Note = n1[0]
            n1Accidental = n1[1]
            n1Octave = n1[2]
        } else {
            throw new Error(`n1 ${n1} is not a valid note string`)
        }

        if (n2.length === 2) {
            n2Note = n2[0]
            n2Octave = n2[1]
            n2Accidental = ''
        } else if (n2.length === 3) {
            n2Note = n2[0]
            n2Accidental = n2[1]
            n2Octave = n2[2]
        } else {
            throw new Error(`n2 ${n2} is not a valid note string`)
        }

        if (isNaN(n1Octave) || isNaN(n2Octave)) {
            throw new Error('Octave is not a numerical value')
        }

        if (n1Note === n2Note && n1Accidental === n2Accidental && n1Octave === n2Octave) {
            return true
        }

        // Check for enharmonic equivalent

        // Calculate the numerical value of note 1
        const numN1 = this.getNumericalValueOfNote(n1Note, n1Accidental, Number.parseInt(n1Octave))

        // Calculate the numerical value of note 2
        const numN2 = this.getNumericalValueOfNote(n2Note, n2Accidental, Number.parseInt(n2Octave))

        return numN1 === numN2
    }

    private getNumericalValueOfNote(note: string, accidental: string, octave: number): number {
        const noteValues: Record<string, number> = {
            'C': 0,
            'D': 1,
            'E': 2,
            'F': 3,
            'G': 4,
            'A': 5,
            'B': 6
        }

        if (!(note in noteValues)) {
            throw new Error(`Invalid note ${note}`)
        }

        return noteValues[note] + (accidental === '#' ? 1 : (accidental === 'b' ? -1 : 0)) + octave * 12
    }
}