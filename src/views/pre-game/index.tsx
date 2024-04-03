import { useEffect, useRef, useState } from 'react'
import { Footer } from '@components/footer'
import style from './style.module.scss'
import { Settings } from '@components/settings';
import { PlayBtn } from '@components/play-btn';
import { MidiController } from '@src/game/midi-controller';
import { useBoundStore } from '@src/store';
import { AppConfigs, MIDIControllers } from '@src/configs/app.config';
import { MockMidiController } from '@src/game/keyboard-controller';

export function PreGame() {
	const [content, setContent] = useState<'idle' | 'about' | 'settings'>('idle');

	const [playBtnSize, setPlayBtnSize] = useState<number>();

	const playBtnContainerRef = useRef<HTMLDivElement>(null);

	const resizeObserver = useRef<ResizeObserver>(new ResizeObserver((event) => {
		// Depending on the layout, you may need to swap inlineSize with blockSize
		// https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize
		setPlayBtnSize(Math.min(event[0].contentBoxSize[0].inlineSize, event[0].contentBoxSize[0].blockSize))
	}));

	const { setMidiInput } = useBoundStore()

	useEffect(() => {
		const observer = resizeObserver.current

		if (playBtnContainerRef.current) {
			observer.observe(playBtnContainerRef.current);
		}

		return () => {
			observer.disconnect()
		}
	}, [content])

	useEffect(() => {
		// when DOMs are mounted
		if (AppConfigs.midiController === MIDIControllers.PIANO) {
			MidiController.init().then(() => {
				setMidiInput(MidiController.getPrimaryInputName())
			})
		} else {
			MockMidiController.init();

			setMidiInput(MockMidiController.getPrimaryInputName())
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const onSettingsClicked = () => {
		setContent('settings');
	}

	const onAboutClicked = () => {
		setContent('about');
	}

	return <div className='w-full h-full flex justify-center items-center flex-col'>
		<div className={style['top-container']}>
			<h1 className='text-8xl mt-4'>Pianola</h1>
		</div>

		<div className={style['mid-container']}>
			<div className={style['black-ribbon'] + ' h-4/5 grid grid-cols-4 grid-rows-4'}>
				{
					content === 'idle' ? <>
						<div ref={playBtnContainerRef} className='col-start-2 col-span-2 row-start-2 row-span-2 flex justify-center'>
							<PlayBtn size={playBtnSize}></PlayBtn>
						</div>
					</> : <></>
				}

				{
					content === 'settings' ? <>
						<div className="col-start-2 col-span-2 row-start-1 row-span-1 flex justify-center items-center">
							<h2 className={style['ribbon-title'] + ' text-4xl xl:text-6xl'}>Settings</h2>
						</div>
						<div className='col-start-1 col-span-3 row-start-2 row-span-3'>
							<Settings></Settings>
						</div>
						<div ref={playBtnContainerRef} className='col-start-4 col-span-1 row-start-2 row-span-2 flex justify-center'>
							<PlayBtn size={playBtnSize}></PlayBtn>
						</div>
					</> : <></>
				}

				{
					content === 'about' ? <>
						<div className="col-start-2 col-span-2 row-start-1 row-span-1 flex justify-center items-center">
							<h2 className={style['ribbon-title'] + ' text-4xl xl:text-6xl'}>About</h2>
						</div>
						<div className='col-start-1 col-span-3 row-start-2 row-span-3 px-5 text-sm xl:text-lg' style={{ color: '#F2F2F2' }}>
							<p>
								The primary goal of this project is pretty simple and straightforward {'('} at least for me {')'} that is "spamming" practicing sight-read musical notes as many times as possible.
							</p>
							<br></br>
							<p>
								It has a few options to play with. You can practice notes on any scales you want, you can revert its motion, you can accelerate or deccelerate its speed for easy-or-challenging practice.
								You can practice on Treble Clef or Bass Clef (the option for both clefs isn't supported). One thing for sure is that you need to connect your piano to your computer. And I haven't had time to finish the mobile version of this (I have the design prototype though)
								so you may need a separate monitor attached somewhere in front of you or whatever.
							</p>
							<br></br>
							<p>
								If you want to save your stats of each trials to Google Sheet. Make sure you make your Google Sheet public and editable by everyone. Then you can copy its ID and paste it to the "Google Sheet ID" option. When you're done, the stats will be posted after. The structure is
								Average Timing | Hits | Misses | Key Name | Hits of this key | Misses of this key | Average Timing of this key.
							</p>
							<p>
								And make sure you don't add any other data to the sheet since I don't have code to read your sheet, just post it, so if you add anything other things, the structure will be screwed up
							</p>
						</div>
						<div ref={playBtnContainerRef} className='col-start-4 col-span-1 row-start-2 row-span-2 flex justify-center'>
							<PlayBtn size={playBtnSize}></PlayBtn>
						</div>
					</> : <></>
				}
			</div>
		</div>

		<div className={style['bottom-container']}>
			<div className={style['footer-container']}>
				<Footer
					onSettingsCallback={onSettingsClicked}
					onAboutCallback={onAboutClicked}
				></Footer>
			</div>
		</div>
	</div>
}