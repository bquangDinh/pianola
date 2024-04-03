export enum MIDIControllers {
	PIANO,
	KEYBOARD
}

export const AppConfigs = {
	midiController: String(import.meta.env.VITE_MIDI_CONTROLLER_INPUT).toLowerCase() === "keyboard" ? MIDIControllers.KEYBOARD : MIDIControllers.PIANO
}

export const SheetConfigs = {
	avgTimingRange: import.meta.env.VITE_SHEET_AVG_TIMING_SAVED_RANGE ? String(import.meta.env.VITE_SHEET_AVG_TIMING_SAVED_RANGE).toUpperCase() : '',
	hitsRange: import.meta.env.VITE_SHEET_HITS_SAVED_RANGE ? String(import.meta.env.VITE_SHEET_HITS_SAVED_RANGE).toUpperCase() : '',
	missesRange: import.meta.env.VITE_SHEET_MISSES_SAVED_RANGE ? String(import.meta.env.VITE_SHEET_MISSES_SAVED_RANGE).toUpperCase() : '',
	keyNameRange: import.meta.env.VITE_SHEET_KEY_NAME_SAVED_RANGE ? String(import.meta.env.VITE_SHEET_KEY_NAME_SAVED_RANGE).toUpperCase() : '',
	keyHitsRange: import.meta.env.VITE_SHEET_KEY_HITS_SAVED_RANGE ? String(import.meta.env.VITE_SHEET_KEY_HITS_SAVED_RANGE).toUpperCase() : '',
	keyMissesRange: import.meta.env.VITE_SHEET_KEY_MISSES_SAVED_RANGE ? String(import.meta.env.VITE_SHEET_KEY_MISSES_SAVED_RANGE).toUpperCase() : '',
	keyAvgTimingRange: import.meta.env.VITE_SHEET_KEY_AVG_TIMING_SAVED_RANGE ? String(import.meta.env.VITE_SHEET_KEY_AVG_TIMING_SAVED_RANGE).toUpperCase() : '',
}