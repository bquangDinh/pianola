import { EventEmitter } from "events";

export interface IMidiInput {
  name: string;
}

export interface INote {
  name: string;
  accidental: null | string;
  octave: number;
}

export interface INoteMessageEvent {
  note: INote;
}

export const MIDI_EVENTS = {
  NOTE_ON: "midi:note_on",
  NOTE_OFF: "midi:note_off",
};

export abstract class MIDIInputable extends EventEmitter {
  protected abstract primaryInput: IMidiInput | null;

  public abstract init(): void | Promise<void>;

  public getPrimaryInputName() {
    return this.primaryInput ? this.primaryInput.name : "";
  }

  public abstract destroy(): void | Promise<void>;

  protected serializeNote(note: INote): string {
    return `${note.name}${note.accidental ?? ""}${note.octave}`;
  }
}
