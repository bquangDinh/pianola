import { create } from "zustand";
import { GameStates, createGameStatesSlice } from "./game-state";
import { GameSettings, createGameSettingsSlice } from "./settings";

export const useBoundStore = create<GameStates & GameSettings>()((...a) => ({
    ...createGameStatesSlice(...a),
    ...createGameSettingsSlice(...a)
}))