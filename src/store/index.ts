import { create  } from "zustand";
import { devtools, persist } from "zustand/middleware"
import { GameStates, createGameStatesSlice } from "./game-state";
import { GameSettings, createGameSettingsSlice } from "./settings";

export const useBoundStore = create<GameStates & GameSettings>()(
    devtools(
        persist(
            (...a) => ({
                ...createGameStatesSlice(...a),
                ...createGameSettingsSlice(...a)
            }),
            {
                name: 'settings',
                partialize: (state) => ({
                    scaleIndex: state.scaleIndex,
                    speedFactor: state.speedFactor,
                    googleSheetID: state.googleSheetID,
                    revertMotion: state.revertMotion,
                    clef: state.clef,
                    midiInput: state.midiInput,
                    leftPanelWidth: state.leftPanelWidth,
                    rightPanelWidth: state.rightPanelWidth
                })
            }
        )
    )
)