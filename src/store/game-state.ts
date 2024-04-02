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
    increaseHitsCount: (hitTime: number) => void,

    missesCount: number,
    increaseMissesCount: () => void,

    averageTiming: number | null,
    // setAverageTiming: (averageTiming: number | null) => void,
    // recalAverageTimingAfterTrial: (timing: number) => void,

    keysPerformance: KeysPerformance,
    increaseKeyHitsCount: (key: string, hitTime: number) => void,
    increaseKeyMissesCount: (key: string) => void,

	resetStats: () => void,
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
    increaseHitsCount: (hitTime: number) => set((state) => {
        const totalHitTimes = state.hitsCount + 1

        if (state.averageTiming === null) {
            return {
                averageTiming: hitTime,
                hitsCount: totalHitTimes
            }
        }

        const oldAvg = state.averageTiming

        const newAvg = oldAvg + ((hitTime - oldAvg) / totalHitTimes)

        return {
            averageTiming: newAvg,
            hitsCount: totalHitTimes
        }
    }),

    missesCount: 0,
    increaseMissesCount: () => set((state) => ({ missesCount: state.missesCount + 1 })),

    averageTiming: null,

    keysPerformance: {},
    increaseKeyHitsCount: (key: string, hitTime: number) => set((state) => {
        const keysPerformance = state.keysPerformance

		const totalHitTimes = !(key in keysPerformance) ? 1 : state.keysPerformance[key].hitsCount + 1

        if (!(key in keysPerformance)) {
			return {
				...state,
				keysPerformance: {
					...state.keysPerformance,
					[key]: {
						hitsCount: totalHitTimes,
						missesCount: 0,
						averageTiming: hitTime
					}
				}
			}
        }

		const oldAvg = state.keysPerformance[key].averageTiming

        const newAvg = oldAvg + ((hitTime - oldAvg) / totalHitTimes)

        return {
            ...state,
            keysPerformance: {
                ...state.keysPerformance,
                [key]: {
                    ...state.keysPerformance[key],
                    hitsCount: totalHitTimes,
					averageTiming: newAvg,
                }
            }
        }
    }),
    increaseKeyMissesCount: (key: string) => set((state) => {
        const keysPerformance = state.keysPerformance

		const totalMissedTimes = !(key in keysPerformance) ? 1 : state.keysPerformance[key].missesCount + 1

        if (!(key in keysPerformance)) {
			return {
				...state,
				keysPerformance: {
					...state.keysPerformance,
					[key]: {
						hitsCount: 0,
						missesCount: totalMissedTimes,
						averageTiming: -1
					}
				}
			}
        }

        return {
            ...state,
            keysPerformance: {
                ...state.keysPerformance,
                [key]: {
                    ...state.keysPerformance[key],
                    missesCount: totalMissedTimes
                }
            }
        }
    }),

	resetStats: () => set((state) => ({
		...state,
		hitsCount: 0,
		missesCount: 0,
		averageTiming: null,
		keysPerformance: {}
	}))
})