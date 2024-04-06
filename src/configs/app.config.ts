import { isNaN } from "lodash";

export enum MIDIControllers {
  PIANO,
  KEYBOARD,
}

export const AppConfigs = {
  midiController:
    import.meta.env.MODE === "production"
    ? MIDIControllers.PIANO
    : (import.meta.env.VITE_MIDI_CONTROLLER_DEV_INPUT && import.meta.env.VITE_MIDI_CONTROLLER_DEV_INPUT === 'piano' ? MIDIControllers.PIANO : MIDIControllers.KEYBOARD),
  trebleRangeStart:
    import.meta.env.VITE_TREBLE_RANGE_START &&
    !isNaN(import.meta.env.VITE_TREBLE_RANGE_START)
      ? Number(import.meta.env.VITE_TREBLE_RANGE_START)
      : 4,
  trebleRangeEnd:
    import.meta.env.VITE_TREBLE_RANGE_END &&
    !isNaN(import.meta.env.VITE_TREBLE_RANGE_END)
      ? Number(import.meta.env.VITE_TREBLE_RANGE_END)
      : 5,
  bassRangeStart:
    import.meta.env.VITE_BASS_RANGE_START &&
    !isNaN(import.meta.env.VITE_BASS_RANGE_START)
      ? Number(import.meta.env.VITE_BASS_RANGE_START)
      : 3,
  bassRangeEnd:
    import.meta.env.VITE_BASS_RANGE_END &&
    !isNaN(import.meta.env.VITE_BASS_RANGE_END)
      ? Number(import.meta.env.VITE_BASS_RANGE_END)
      : 4,
};

export const SheetConfigs = {
  avgTimingRange: import.meta.env.VITE_SHEET_AVG_TIMING_SAVED_RANGE
    ? String(import.meta.env.VITE_SHEET_AVG_TIMING_SAVED_RANGE).toUpperCase()
    : "",
  hitsRange: import.meta.env.VITE_SHEET_HITS_SAVED_RANGE
    ? String(import.meta.env.VITE_SHEET_HITS_SAVED_RANGE).toUpperCase()
    : "",
  missesRange: import.meta.env.VITE_SHEET_MISSES_SAVED_RANGE
    ? String(import.meta.env.VITE_SHEET_MISSES_SAVED_RANGE).toUpperCase()
    : "",
  keyNameRange: import.meta.env.VITE_SHEET_KEY_NAME_SAVED_RANGE
    ? String(import.meta.env.VITE_SHEET_KEY_NAME_SAVED_RANGE).toUpperCase()
    : "",
  keyHitsRange: import.meta.env.VITE_SHEET_KEY_HITS_SAVED_RANGE
    ? String(import.meta.env.VITE_SHEET_KEY_HITS_SAVED_RANGE).toUpperCase()
    : "",
  keyMissesRange: import.meta.env.VITE_SHEET_KEY_MISSES_SAVED_RANGE
    ? String(import.meta.env.VITE_SHEET_KEY_MISSES_SAVED_RANGE).toUpperCase()
    : "",
  keyAvgTimingRange: import.meta.env.VITE_SHEET_KEY_AVG_TIMING_SAVED_RANGE
    ? String(
        import.meta.env.VITE_SHEET_KEY_AVG_TIMING_SAVED_RANGE
      ).toUpperCase()
    : "",
};

export const GoogleSheetConfigs = {
  apiKey: import.meta.env.VITE_GOOGLE_SHEET_API_KEY ?? "",
  redirectUri:
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_GOOGLE_SHEET_PROD_REDIRECT_URI ?? ""
      : import.meta.env.VITE_GOOGLE_SHEET_DEV_REDIRECT_URI ?? "",
  clientId: import.meta.env.VITE_GOOGLE_SHEET_CLIENT_ID ?? "",
  projectId: import.meta.env.VITE_GOOGLE_SHEET_PROJECT_ID ?? "",
  authUri:
    import.meta.env.VITE_GOOGLE_SHEET_AUTH_URI ??
    "https://accounts.google.com/o/oauth2/auth",
  tokenUri:
    import.meta.env.VITE_GOOGLE_SHEET_TOKEN_URI ??
    "https://oauth2.googleapis.com/token",
  authProviderX509CertUrl:
    import.meta.env.VITE_GOOGLE_SHEET_AUTH_PROVIDER_X509_CERT_URL ??
    "https://www.googleapis.com/oauth2/v1/certs",
  clientSecret: import.meta.env.VITE_GOOGLE_SHEET_CLIENT_SECRET ?? "",
  javascriptOrigin:
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_GOOGLE_SHEET_PROD_JAVASCRIPT_ORIGIN ?? ""
      : import.meta.env.VITE_GOOGLE_SHEET_DEV_JAVASCRIPT_ORIGIN ?? "",
  scope: "https://www.googleapis.com/auth/spreadsheets",
};
