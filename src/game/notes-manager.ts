import { useBoundStore } from "@src/store";
import { Game } from "./game";
import { GameObject } from "./game-object";
import { Note, NoteConfig } from "./note";
import { DURATIONS, SCALES_CONFIG } from "@src/constants/scales";
import { CLEFS, SCALES } from "@src/store/settings";
import { random } from 'lodash'

export const NotesManagerEvents = {
    NOTE_HIT_ENDPOINT: 'nm:note-hit-endpoint'
}

export class NotesManager extends GameObject {
    protected _id = 'note-manager'

    private note: Note

    private _currentNoteConfig: NoteConfig | null = null

    private _hitTime = 0

    constructor(game: Game) {
        super(game)

        this.note = new Note(game)
    }

    public get currentNoteConfig() {
        return this._currentNoteConfig
    }

    public get currentNoteStr() {
        const currentNoteConfig = this.currentNoteConfig

        if (!currentNoteConfig) return

        const note = currentNoteConfig.note.split('/')[0]

        if (!note || note === '') {
            throw new Error(`Note config is not valid. Note: ${currentNoteConfig.note}`)
        }

        return note
    }

    public get hitTime() {
        return this._hitTime
    }

    public getNote() {
        return this.note
    }

    public init() {
        this.note.init()

        const rect = this.game.canvas.getBoundingClientRect()

        this.note.setPosition(rect.width + Note.STAVE_WIDTH, rect.height / 2 - 60)

        this.updateNote()
    }

    public render(dt: number) {
        this.note.render(dt)
    }

    public update(dt: number) {
        this.note.update(dt)

        this._hitTime += dt

        if (this.note.x <= -Note.STAVE_WIDTH) {
            this.resetNote()

            this.emit(NotesManagerEvents.NOTE_HIT_ENDPOINT, this.currentNoteStr)
        }
    }

    public resetNote() {
        this.resetNotePos()

        this.updateNote()

        this._hitTime = 0
    }

    private updateNote() {
        const { scaleIndex, speedFactor, clef } = useBoundStore.getState()

        if (scaleIndex < 0 || scaleIndex >= SCALES.length) {
            throw new Error('Scale Index is not supposed to be out of bound')
        }

        const scale = SCALES_CONFIG[SCALES[scaleIndex]]

        if (typeof scale === 'undefined' || scale === null) {
            throw new Error('Scale is not defined')
        }

        const noteConfig = this.generateNoteConfig(scale, clef)

        this.note.speedFactor = speedFactor

        this.note.setNoteConfig(noteConfig)

        this._currentNoteConfig = noteConfig
    }

    private resetNotePos() {
        const rect = this.game.canvas.getBoundingClientRect()

        this.note.setPosition(rect.width + Note.STAVE_WIDTH, rect.height / 2 - 60)
    }

    private generateNoteConfig(scaleConfig: string, clef: CLEFS): NoteConfig {
        const notes = scaleConfig.split(' ')

        const note = notes[random(0, notes.length - 1)]

        const octave = clef === CLEFS.TREBLE ? random(4, 5) : random(3, 4)

        const [duration, time] = DURATIONS[random(0, DURATIONS.length - 1)]

        let stem: 'down' | 'up' = 'down'

        if (clef === CLEFS.TREBLE) {
            stem = octave > 4 ? 'down' : 'up'
        } else {
            stem = octave > 3 ? 'down' : 'up'
        }

        return {
            clef: clef === CLEFS.TREBLE ? 'treble' : 'bass',
            note: `${note}${octave}/${duration}`,
            time,
            stem,
        }
    }

    public destroy() {
        this.removeAllListeners()

        this.note.destroy()
    }
}