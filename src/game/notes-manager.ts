import { useBoundStore } from "@src/store";
import { Game } from "./game";
import { GameObject } from "./game-object";
import { Note, NoteConfig } from "./note";
import { DURATIONS, SCALES_CONFIG } from "@src/constants/scales";
import { CLEFS, SCALES } from "@src/store/settings";
import { random } from "lodash";
import { AppConfigs } from "@src/configs/app.config";

export const NotesManagerEvents = {
  NOTE_HIT_ENDPOINT: "nm:note-hit-endpoint",
};

export class NotesManager extends GameObject {
  protected _id = "note-manager";

  private readonly ELAPSED = 1

  // private note: Note;

  private notes: Note[] = []

  // private _currentNoteConfig: NoteConfig | null = null;

  private elapsedTime = 0;

  private revertMotion = false;

  constructor(game: Game) {
    super(game);

    // this.note = new Note(game);
  }

  // public get currentNoteConfig() {
  //   return this._currentNoteConfig;
  // }

  public get currentNoteStr() {
    const firstActiveNote = this.getFirstActiveNote()

    if (!firstActiveNote) return

    const noteConfig = firstActiveNote.noteConfig

    if (!noteConfig) return;

    const note = noteConfig.note.split("/")[0];

    if (!note || note === "") {
      throw new Error(
        `Note config is not valid. Note: ${noteConfig.note}`
      );
    }

    return note;
  }

  // public getNote() {
  //   return this.note;
  // }

  // Return the first note that is active in the array
  public getFirstActiveNote() {
    for (const note of this.notes) {
      if (note.active) return note
    }

    return null
  }

  public init() {
    // this.note.init();
  }

  public render(dt: number) {
    for (const note of this.notes) {
      note.render(dt)
    }
  }

  public update(dt: number) {
    // if (!this.currentNoteConfig) return

    this.elapsedTime += dt;

    // Make each note moves one after another for each "elapsed" time
    if (this.elapsedTime >= this.ELAPSED) {
      // reset elapsed time
      this.elapsedTime = 0;

      // Spawn new note
      const note = new Note(this.game)

      note.init()

      this.resetNote(note)

      this.notes.push(note)
    }

    // Update note
    for (let i = this.notes.length - 1; i >= 0; --i) {
      const note = this.notes[i]

      note.update(dt)

      const rect = this.game.canvas.getBoundingClientRect();

      if (this.revertMotion) {
        if (note.x >= rect.width) {
          this.emit(NotesManagerEvents.NOTE_HIT_ENDPOINT, this.currentNoteStr);
  
          this.notes.splice(i, 1)

          return
        }
      } else {
        if (note.x <= -Note.STAVE_WIDTH) {
          this.emit(NotesManagerEvents.NOTE_HIT_ENDPOINT, this.currentNoteStr);

          this.notes.splice(i, 1)

          return
        }
      }

      note.hitTime += dt
    }
  }

  // public resetAllNotes() {
  //   for (const note of this.notes) {
  //     this.resetNote(note)
  //   }
  // }

  public resetNote(note: Note) {
    this.updateNote(note);

    this.resetNotePos(note);

    note.active = true

    note.hitTime = 0
  }

  // private updateNote() {
  //   const { scaleIndex, speedFactor, clef, revertMotion } =
  //     useBoundStore.getState();

  //   if (scaleIndex < 0 || scaleIndex >= SCALES.length) {
  //     throw new Error("Scale Index is not supposed to be out of bound");
  //   }

  //   const scale = SCALES_CONFIG[SCALES[scaleIndex]];

  //   if (typeof scale === "undefined" || scale === null) {
  //     throw new Error("Scale is not defined");
  //   }

  //   const noteConfig = this.generateNoteConfig(scale, clef);

  //   this.note.speedFactor = speedFactor;

  //   this.note.setNoteConfig({
  //     ...noteConfig,
  //   });

  //   this.note.setRevertMotion(revertMotion);

  //   this.revertMotion = revertMotion;

  //   this._currentNoteConfig = noteConfig;
  // }

  // private resetNotePos() {
  //   const rect = this.game.canvas.getBoundingClientRect();

  //   if (this.revertMotion) {
  //     this.note.setPosition(-Note.STAVE_WIDTH, rect.height / 2 - 60);
  //   } else {
  //     this.note.setPosition(rect.width, rect.height / 2 - 60);
  //   }
  // }

  private updateNote(note: Note) {
    const { scaleIndex, speedFactor, clef, revertMotion } =
      useBoundStore.getState();

    if (scaleIndex < 0 || scaleIndex >= SCALES.length) {
      throw new Error("Scale Index is not supposed to be out of bound");
    }

    const scale = SCALES_CONFIG[SCALES[scaleIndex]];

    if (typeof scale === "undefined" || scale === null) {
      throw new Error("Scale is not defined");
    }

    const noteConfig = this.generateNoteConfig(scale, clef);

    note.speedFactor = speedFactor;

    note.setNoteConfig({
      ...noteConfig,
    });

    note.setRevertMotion(revertMotion);

    // ???
    this.revertMotion = revertMotion;

    // this._currentNoteConfig = noteConfig;

    return note
  }

  private resetNotePos(note: Note) {
    const rect = this.game.canvas.getBoundingClientRect();

    if (this.revertMotion) {
      note.setPosition(-Note.STAVE_WIDTH, rect.height / 2 - 60);
    } else {
      note.setPosition(rect.width, rect.height / 2 - 60);
    }

    return note
  }

  private generateNoteConfig(scaleConfig: string, clef: CLEFS): NoteConfig {
    const notes = scaleConfig.split(" ");

    const note = notes[random(0, notes.length - 1)];

    const octave = clef === CLEFS.TREBLE ? random(AppConfigs.trebleRangeStart, AppConfigs.trebleRangeEnd) : random(AppConfigs.bassRangeStart, AppConfigs.bassRangeEnd);

    const [duration, time] = DURATIONS[random(0, DURATIONS.length - 1)];

    let stem: "down" | "up" = "down";

    if (clef === CLEFS.TREBLE) {
      stem = octave > 4 ? "down" : "up";
    } else {
      stem = octave > 3 ? "down" : "up";
    }

    return {
      clef: clef === CLEFS.TREBLE ? "treble" : "bass",
      note: `${note}${octave}/${duration}`,
      time,
      stem,
    };
  }

  public destroy() {
    this.removeAllListeners();

    for (const note of this.notes) {
      note.destroy()
    }
  }
}
