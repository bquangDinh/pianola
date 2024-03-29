import { StateCreator } from "zustand"
import { GameSettings } from "./settings"

export enum GameStatuses {
    IDLE,
    PLAYING,
    ENDED
}

export interface KeyStat {
    hitsCount: number,
    missesCount: number,
    averageTiming: number,
}

export type KeysPerformance = Record<string, KeyStat>

export interface GameStates {
    status: GameStatuses,
    setStatus: (status: GameStatuses) => void,

    hitsCount: number,
    increaseHitsCount: () => void,

    missesCount: number,
    increaseMissesCount: () => void,

    averageTiming: number | null,
    setAverageTiming: (averageTiming: number | null) => void,

    keysPerformance: KeysPerformance,
    setKeysPerformance: (key: string, stat: KeyStat) => void,
    increaseKeyHitsCount: (key: string) => void,
    increaseKeyMissesCount: (key: string) => void,
    setKeyAverageTiming: (key: string, averageTiming: number) => void,
}

export const createGameStatesSlice: StateCreator<
    GameStates & GameSettings,
    [],
    [],
    GameStates
> = (set) => ({
    status: GameStatuses.IDLE,
    setStatus: (status: GameStatuses) => set(() => ({ status })),

    hitsCount: 0,
    increaseHitsCount: () => set((state) => ({ hitsCount: state.hitsCount + 1 })),

    missesCount: 0,
    increaseMissesCount: () => set((state) => ({ missesCount: state.missesCount + 1 })),

    averageTiming: null,
    setAverageTiming: (averageTiming: number | null) => set(() => ({ averageTiming })),

    keysPerformance: {},
    setKeysPerformance: (key: string, stat: KeyStat) => set((state) => ({
        ...state,
        keysPerformance: {
            ...state.keysPerformance,
            key: stat
        }
    })),
    increaseKeyHitsCount: (key: string) => set((state) => {
        const keysPerformance = state.keysPerformance

        if (!(key in keysPerformance)) {
            throw new Error(`Key ${key} does not exist in KeysPerformance! Cannot update hits count of ${key}`)
        }

        return {
            ...state,
            keysPerformance: {
                ...state.keysPerformance,
                key: {
                    ...state.keysPerformance[key],
                    hitsCount: state.keysPerformance[key].hitsCount + 1
                }
            }
        }
    }),
    increaseKeyMissesCount: (key: string) => set((state) => {
        const keysPerformance = state.keysPerformance

        if (!(key in keysPerformance)) {
            throw new Error(`Key ${key} does not exist in KeysPerformance! Cannot update misses count of ${key}`)
        }

        return {
            ...state,
            keysPerformance: {
                ...state.keysPerformance,
                key: {
                    ...state.keysPerformance[key],
                    missesCount: state.keysPerformance[key].hitsCount + 1
                }
            }
        }
    }),
    setKeyAverageTiming: (key: string, averageTiming: number) => set((state) => {
        const keysPerformance = state.keysPerformance

        if (!(key in keysPerformance)) {
            throw new Error(`Key ${key} does not exist in KeysPerformance! Cannot update average timing of ${key}`)
        }

        return {
            ...state,
            keysPerformance: {
                ...state.keysPerformance,
                key: {
                    ...state.keysPerformance[key],
                    averageTiming
                }
            }
        }
    })
})