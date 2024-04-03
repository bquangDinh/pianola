/**
 * This class is only the mockup for MidiController class
 * Since I can't carry my piano keyboard with me to school
 * So this class is used to (fake) handling MIDI Input that is supposed to be from
 * a piano keyboard
 */

import {
  IMidiInput,
  INoteMessageEvent,
  MIDIInputable,
  MIDI_EVENTS,
} from "./midi-inputable";

export class KeyboardController extends MIDIInputable {
  private readonly MAPPING_LAYOUT: Record<string, [string, number]> = {
    // 0 is C to 6 is B
    // the second number is the octave

    q: ["C", 3],
    w: ["D", 3],
    e: ["E", 3],
    r: ["F", 3],
    t: ["G", 3],
    y: ["A", 3],
    u: ["B", 3],

    a: ["C", 4],
    s: ["D", 4],
    d: ["E", 4],
    f: ["F", 4],
    g: ["G", 4],
    h: ["A", 4],
    j: ["B", 4],

    z: ["C", 5],
    x: ["D", 5],
    c: ["E", 5],
    v: ["F", 5],
    b: ["G", 5],
    n: ["A", 5],
    m: ["B", 5],

    // terminate key
    // space key
    " ": ["C", 8],
  };

  protected primaryInput: IMidiInput = {
    name: "Keyboard",
  };

  public init() {
    // Init events
    if (typeof document === "undefined" || document === null) {
      throw new Error("Document context cannot be found");
    }

    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  private onKeyDown(e: KeyboardEvent) {
    const accidental = e.shiftKey ? "#" : null;

    if (e.key.toLowerCase() in this.MAPPING_LAYOUT) {
      const [name, octave] = this.MAPPING_LAYOUT[e.key.toLowerCase()];

      const note: INoteMessageEvent = {
        note: {
          accidental,
          name,
          octave,
        },
      };

      const noteStr = this.serializeNote(note.note);

      this.emit(MIDI_EVENTS.NOTE_ON, noteStr);
    }
  }

  private onKeyUp(e: KeyboardEvent) {
    const accidental = e.shiftKey ? "#" : null;

    if (e.key.toLowerCase() in this.MAPPING_LAYOUT) {
      const [name, octave] = this.MAPPING_LAYOUT[e.key.toLowerCase()];

      const note: INoteMessageEvent = {
        note: {
          accidental,
          name,
          octave,
        },
      };

      const noteStr = this.serializeNote(note.note);

      this.emit(MIDI_EVENTS.NOTE_OFF, noteStr);
    }
  }

  public destroy() {
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
  }
}

export const MockMidiController = new KeyboardController();
