import { useBoundStore } from '@src/store'
import './App.css'
import { PreGame } from './views/pre-game'
import { GameStatuses } from '@src/store/game-state'
import { InGame } from './views/in-game/in-game'
import { PostGame } from './views/post-game'
import { useEffect } from 'react'

function App() {
  const { status } = useBoundStore()

  useEffect(() => {
    console.log(status)
  }, [])

  return <div className='w-screen h-screen overflow-hidden'>
    {
      status === GameStatuses.IDLE ? <PreGame></PreGame> : (status === GameStatuses.PLAYING ? <InGame></InGame> : <PostGame></PostGame>)
    }
  </div>
}

export default App
