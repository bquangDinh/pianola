import style from './style.module.scss'
import { useBoundStore } from "@src/store";
import { SCALES_CONFIG } from "@src/constants/scales";
import { CLEFS, SCALES } from "@src/store/settings";
import { useEffect } from 'react';
import { GoogleSheetHelperIns, ValueInputOptions } from '@src/helpers/google-sheet';
import { SheetConfigs } from '@src/configs/app.config';

export function PostGameStat() {
	const { keysPerformance, scaleIndex, hitsCount, missesCount, averageTiming, clef, googleSheetID } = useBoundStore();

	useEffect(() => {
		if (googleSheetID === null || googleSheetID.trim() === '') return

		const saveStatsToSheet = async () => {
			await GoogleSheetHelperIns.appendValues(googleSheetID, `Sheet1!${SheetConfigs.avgTimingRange}:${SheetConfigs.missesRange}`, [[averageTiming, hitsCount, missesCount]], ValueInputOptions.USER_ENTERED)

			const request: unknown[][] = []

			for (const key in keysPerformance) {
				const stat = keysPerformance[key]

				request.push([key, stat.hitsCount, stat.missesCount, stat.averageTiming])
			}

			await GoogleSheetHelperIns.appendValues(googleSheetID, `Sheet1!${SheetConfigs.keyNameRange}:${SheetConfigs.keyAvgTimingRange}`, request, ValueInputOptions.USER_ENTERED)
		}

		saveStatsToSheet()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [googleSheetID])

	const renderKeysPerformance = () => {
		if (Object.keys(keysPerformance).length > 7) {
			// There are only 7 keys in a scale
			// There's no way it goes over 7
			console.error('There are more than 7 keys')

			return <></>
		}

		if (typeof SCALES[scaleIndex] === 'undefined') {
			console.error('scaleIndex is not valid')

			return <></>
		}

		if (typeof SCALES_CONFIG[SCALES[scaleIndex]] === 'undefined') {
			console.error('Scale for this config does not exist')

			return <></>
		}

		const keysInScale = SCALES_CONFIG[SCALES[scaleIndex]].split(' ')

		return keysInScale.map((key) => (
			(key in keysPerformance) ?
				<div className='col-span-1' key={key}>
					<span className='text-5xl'>{ key }</span>
					<br></br>
					<span className='text-xl'>{ keysPerformance[key].averageTiming.toFixed(2) }</span>
					<br></br>
					<span className='text-xl'>{ keysPerformance[key].hitsCount }/{ keysPerformance[key].missesCount }</span>
				</div> : <div className='col-span-1' key={key}>
					<span className='text-5xl'>{ key }</span>
					<br></br>
				</div>
		))
	}

	return <div className={style['poststat-container']}>
		<div className='float-left h-full flex justify-center flex-col'>
			<div className={style['performance-stats-container'] + ' grid grid-cols-2'}>
				<div className='col-span-1'>
					<span className='text-xl'>Hits/Misses</span>
					<br></br>
					<span className={style['stat-content'] + ' text-6xl'}>{ hitsCount }/{ missesCount }</span>
				</div>
				<div className='col-start-2 col-span-1'>
					<span className='text-xl'>Average Timing</span>
					<br></br>
					<span className={style['stat-content'] + ' text-6xl'}>{ averageTiming ? averageTiming.toFixed(2) : -1 }</span>
				</div>
			</div>

			<div className={style['perkey-stats-container'] + ' mt-10'}>
				<div className='w-full text-left'>
					<span className='text-2xl'>Per keys on { clef === CLEFS.TREBLE ? 'treble' : 'bass' } Clef | { SCALES[scaleIndex] }</span>
				</div>
				<div className='grid gap-1 grid-cols-7'>
					{ renderKeysPerformance() }
				</div>
			</div>
		</div>
	</div>
}