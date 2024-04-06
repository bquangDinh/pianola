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

  private note: Note;

  private _currentNoteConfig: NoteConfig | null = null;

  private _hitTime = 0;

  private revertMotion = false;

  constructor(game: Game) {
    super(game);

    this.note = new Note(game);
  }

  public get currentNoteConfig() {
    return this._currentNoteConfig;
  }

  public get currentNoteStr() {
    const currentNoteConfig = this.currentNoteConfig;

    if (!currentNoteConfig) return;

    const note = currentNoteConfig.note.split("/")[0];

    if (!note || note === "") {
      throw new Error(
        `Note config is not valid. Note: ${currentNoteConfig.note}`
      );
    }

    return note;
  }

  public get hitTime() {
    return this._hitTime;
  }

  public getNote() {
    return this.note;
  }

  public init() {
    this.note.init();

    this.resetNote();
  }

  public render(dt: number) {
    // If ready
    if (this.currentNoteConfig) {
      this.note.render(dt);
    }
  }

  public update(dt: number) {
    if (!this.currentNoteConfig) return

    this.note.update(dt);

    this._hitTime += dt;

    const rect = this.game.canvas.getBoundingClientRect();

    if (this.revertMotion) {
      if (this.note.x >= rect.width) {
        this.emit(NotesManagerEvents.NOTE_HIT_ENDPOINT, this.currentNoteStr);

        this.resetNote();
      }
    } else {
      if (this.note.x <= -Note.STAVE_WIDTH) {
        this.emit(NotesManagerEvents.NOTE_HIT_ENDPOINT, this.currentNoteStr);

        this.resetNote();
      }
    }
  }

  public resetNote() {
    this.updateNote();

    this.resetNotePos();

    this._hitTime = 0;
  }

  private updateNote() {
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

    this.note.speedFactor = speedFactor;

    this.note.setNoteConfig({
      ...noteConfig,
    });

    this.note.setRevertMotion(revertMotion);

    this.revertMotion = revertMotion;

    this._currentNoteConfig = noteConfig;
  }

  private resetNotePos() {
    const rect = this.game.canvas.getBoundingClientRect();

    if (this.revertMotion) {
      this.note.setPosition(-Note.STAVE_WIDTH, rect.height / 2 - 60);
    } else {
      this.note.setPosition(rect.width, rect.height / 2 - 60);
    }
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

    this.note.destroy();
  }
}
