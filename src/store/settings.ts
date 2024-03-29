import { StateCreator } from "zustand"
import { GameStates } from "./game-state"

export enum CLEFS {
    TREBLE,
    BASS,
    BOTH
}

export const SCALES = [
    'C Major', 'G Major', 'D Major', 'A Major', 'E Major', 'B Major', 'Gb Major',
    'Db Major', 'Ab Major', 'Eb Major', 'Bb Major', 'F Major', 'a minor', 'e minor', 
    'b minor', 'f# minor', 'c# minor', 'g# minor', 'eb minor', 'f minor', 'c minor',
    'g minor', 'd minor'
]

export interface GameSettings {
    scaleIndex: number,
    setScaleIndex: (scale: number) => void,

    speedFactor: number,
    setSpeedFactor: (speedFactor: number) => void,

    googleSheetID: string | null,
    setGoogleSheetID: (googleSheetID: string | null) => void,

    revertMotion: boolean,
    setRevertMotion: (revertMotion: boolean) => void,

    clef: CLEFS,
    setClef: (celf: CLEFS) => void,

    midiInput: string | null,
    setMidiInput: (midiInput: string | null) => void
}

export const createGameSettingsSlice: StateCreator<
    GameStates & GameSettings,
    [],
    [],
    GameSettings
> = (set) => ({
    scaleIndex: 0, // C Major as default
    setScaleIndex: (scaleIndex: number) => set(() => ({ scaleIndex })),

    speedFactor: 1,
    setSpeedFactor: (speedFactor: number) => set(() => ({ speedFactor })),

    googleSheetID: null,
    setGoogleSheetID: (googleSheetID: string | null) => set(() => ({ googleSheetID })),

    revertMotion: false,
    setRevertMotion: (revertMotion: boolean) => set(() => ({ revertMotion })),

    clef: CLEFS.TREBLE,
    setClef: (clef: CLEFS) => set(() => ({ clef })),

    midiInput: null,
    setMidiInput: (midiInput: string | null) => set(() => ({ midiInput }))
})