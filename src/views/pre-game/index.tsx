import { useEffect, useRef, useState } from 'react'
import { Footer } from '@components/footer'
import style from './style.module.scss'
import { Settings } from '@components/settings';
import { PlayBtn } from '@components/play-btn';
import { MidiController } from '@src/game/midi-controller';
import { useBoundStore } from '@src/store';

export function PreGame() {
    const [content, setContent] = useState<'idle' | 'about' | 'settings'>('idle');

    const [playBtnSize, setPlayBtnSize] = useState<number>();

    const playBtnContainerRef = useRef<HTMLDivElement>(null);

    const { setMidiInput } = useBoundStore()

    useEffect(() => {
        // when DOMs are mounted
        let resizeObserver: ResizeObserver | null = null

        if (playBtnContainerRef.current) {
            resizeObserver = new ResizeObserver((event) => {
                // Depending on the layout, you may need to swap inlineSize with blockSize
                // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize
                setPlayBtnSize(Math.min(event[0].contentBoxSize[0].inlineSize, event[0].contentBoxSize[0].blockSize))
            });
    
            resizeObserver.observe(playBtnContainerRef.current);    
        }

        return () => {
            if (resizeObserver) {
                resizeObserver.disconnect()
            }
        }
    }, [])

    useEffect(() => {
        // when DOMs are mounted
        MidiController.init().then(() => {
            setMidiInput(MidiController.getPrimaryInputName())
        })
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
                <div className="col-start-2 col-span-2 row-start-1 row-span-1 flex justify-center items-center">
                    <h2 className={style['ribbon-title'] + ' text-4xl xl:text-6xl'}>Settings</h2>
                </div>
                <div className='col-start-1 col-span-3 row-start-2 row-span-3'>
                    <Settings></Settings>
                </div>
                <div ref={playBtnContainerRef} className='col-start-4 col-span-1 row-start-2 row-span-2'>
                    <PlayBtn size={playBtnSize}></PlayBtn>
                </div>
            </div>
        </div>

        <div className={style['bottom-container']}>
            <div className={style['footer-container']}>
                <Footer></Footer>
            </div>
        </div>
    </div>
}