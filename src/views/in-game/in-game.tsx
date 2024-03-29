import { useEffect, useReducer, useRef, useState } from 'react'
import style from './style.module.scss'
import { GameStat } from '@components/game-stat';

export function InGame() {
    const MAX_PANE_WIDTH = (document.body.clientWidth / 2) - 100
    
    const dragging = useRef(false);
    const isLeftDragging = useRef(false)
    const currentMousePosX = useRef<number>()
    
    const [leftPaneWidth, handleMouseMoveLeftPane] = useReducer((state: number, event: MouseEvent) => {
        if (dragging.current && isLeftDragging.current) {
            const mousePosX = event.movementX

            if (typeof currentMousePosX.current === 'undefined') {
                currentMousePosX.current = mousePosX
            }

            const deltaX = mousePosX - currentMousePosX.current

            if (state + deltaX >= MAX_PANE_WIDTH) return MAX_PANE_WIDTH

            return state + deltaX

        }

        return state
    }, (document.body.clientWidth / 2) - 100)

    const [rightPaneWidth, handleMouseMoveRightPane] = useReducer((state: number, event: MouseEvent) => {
        if (dragging.current && !isLeftDragging.current) {
            const mousePosX = event.movementX

            if (typeof currentMousePosX.current === 'undefined') {
                currentMousePosX.current = mousePosX
            }

            const deltaX = currentMousePosX.current - mousePosX

            if (state + deltaX >= MAX_PANE_WIDTH) return MAX_PANE_WIDTH

            return state + deltaX

        }

        return state
    }, (document.body.clientWidth / 2) - 100)

    const leftContainerRef = useRef<HTMLDivElement>(null)

    const midContainerRef = useRef<HTMLDivElement>(null)

    const rightContainerRef = useRef<HTMLDivElement>(null)

    const [gameStatPos, setGameStatPos] = useState<'left' | 'mid' | 'right'>('mid')

    useEffect(() => {
        const onMouseUp = () => {
            dragging.current = false
        }

        document.addEventListener('mouseup', onMouseUp)

        document.addEventListener('mousemove', handleMouseMoveLeftPane)

        document.addEventListener('mousemove', handleMouseMoveRightPane)

        return () => {
            document.removeEventListener('mouseup', onMouseUp)
            document.removeEventListener('mousemove', handleMouseMoveLeftPane)
            document.removeEventListener('mousemove', handleMouseMoveRightPane)
        }
    }, [])

    useEffect(() => {
        let resizeObserver: ResizeObserver | null = null

        if (leftContainerRef.current && midContainerRef.current && rightContainerRef.current) {
            resizeObserver = new ResizeObserver((event) => {
                console.log(event[0].contentRect)
                const rect = event[0].contentRect

                const width = rect.width

                // if the middle container getting smaler over a threshold
                // move the game stat container to either left panel or right panel
                if (width <= 350) {
                    if (leftContainerRef.current!.clientWidth >= 350) {
                        setGameStatPos('left')
                    } else if (rightContainerRef.current!.clientWidth >= 350) {
                        setGameStatPos('right')
                    } else {
                        throw new Error('Game Stat has no where to go!')
                    }
                } else {
                    setGameStatPos('mid')
                }
            })

            resizeObserver.observe(midContainerRef.current)
        }

        return () => {
            if (resizeObserver) {
                resizeObserver.disconnect()
            }
        }
    }, [])

    const onMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        dragging.current = true
        currentMousePosX.current = event.movementX

        const dataset = event.currentTarget.dataset

        if ('direction' in dataset) {
            isLeftDragging.current = dataset.direction === 'left'
        } else {
            throw new Error('Invalid target for draggable!!!')
        }
    }

    return <div className={style['in-game-container'] + ' w-full h-full flex'}>
        <div className={style['draggable-black-panel']} style={{
            width: leftPaneWidth
        }} ref={leftContainerRef}>
            <div className={style['stat-placeholder']}>
                {
                    gameStatPos === 'left' ? <GameStat className='ml-3 mt-3' textColor='#F2F2F2'></GameStat> : <></>
                }
            </div>
            <div data-direction="left" className={style['dashed-line-container']} onMouseDown={onMouseDown}>
                <svg className={style['dashed-line']} width="1" height="1024" viewBox="0 0 5 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="2.5" y1="2.5" x2="2.49996" y2="1021.5" stroke="white" strokeWidth="5" strokeLinecap="round" strokeDasharray="10 10"/>
                </svg>
            </div>
        </div>
        <div className={style['content-container']}>
            <div className={style['content-stat-placeholder']}>
                {
                    gameStatPos === 'mid' ? <GameStat className='ml-3 mt-3'></GameStat> : <></>
                }
            </div>
            <div className={style['main-content'] + ' flex justify-center items-center'} ref={midContainerRef}>
                <div className={style['staff-container'] + ' w-full'}>
                    <div className={style['staff']}></div>
                    <div className={style['staff']}></div>
                    <div className={style['staff']}></div>
                    <div className={style['staff']}></div>
                    <div className={style['staff']}></div>
                </div>
            </div>
            <div className={style['content-stat-placeholder']}></div>
        </div>
        <div className={style['draggable-black-panel']} style={{
            width: rightPaneWidth
        }} ref={rightContainerRef}>
            <div data-direction="right" className={style['dashed-line-container']} onMouseDown={onMouseDown}>
                <svg className={style['dashed-line']} width="1" height="1024" viewBox="0 0 5 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="2.5" y1="2.5" x2="2.49996" y2="1021.5" stroke="white" strokeWidth="5" strokeLinecap="round" strokeDasharray="10 10"/>
                </svg>
            </div>
            <div className={style['stat-placeholder']}>
                {
                    gameStatPos === 'right' ? <GameStat className='ml-3 mt-3' textColor='#F2F2F2'></GameStat> : <></>
                }
            </div>
        </div>
    </div>
}