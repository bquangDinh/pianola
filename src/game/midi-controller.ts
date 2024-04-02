import { Input, NoteMessageEvent, WebMidi } from "webmidi";
import { MIDIInputable, MIDI_EVENTS } from "./midi-inputable";

export class MIDIController extends MIDIInputable {
    protected primaryInput: Input | null = null

    public async init () {
        await WebMidi.enable()

        // Print all inputs and outputs
		WebMidi.inputs.forEach(input => console.log('[INPUT]', input.name))

		WebMidi.outputs.forEach(output => console.log('[OUTPUT]', output.name))

        if (WebMidi.inputs.length === 0) {
			console.warn('No MIDI input found! Turn on the piano and refresh the page again')
			return
		}

        this.primaryInput = WebMidi.inputs[0]

        // Init events
        this.primaryInput.addListener('noteon', this.onNoteOn.bind(this))
        this.primaryInput.addListener('noteoff', this.onNoteOff.bind(this))
    }

    public getPrimaryInputName() {
        return this.primaryInput ? this.primaryInput.name : ''
    }

    private onNoteOn(e: NoteMessageEvent) {
        const note = this.serializeNote(e.note)

        this.emit(MIDI_EVENTS.NOTE_ON, note)
    }

    private onNoteOff(e: NoteMessageEvent) {
		const note = this.serializeNote(e.note)

        this.emit(MIDI_EVENTS.NOTE_OFF, note)
    }

    public destroy () {
        if (this.primaryInput) {
            this.primaryInput.removeListener('noteon', this.onNoteOn)
            this.primaryInput.removeListener('noteoff', this.onNoteOff)
        }
    }
}

export const MidiController = new MIDIController()