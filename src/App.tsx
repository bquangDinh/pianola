import { useBoundStore } from '@src/store'
import './App.css'
import { PreGame } from './views/pre-game'
import { GameStatuses } from '@src/store/game-state'
import { InGame } from './views/in-game/in-game'
import { PostGame } from './views/post-game'
import { useEffect } from 'react'
import { loadScript } from '@src/helpers/helper'
import { GoogleSheetHelperIns } from '@src/helpers/google-sheet'

function App() {
  const { status } = useBoundStore()

  useEffect(() => {
	const initGoogleSheet = async () => {
		await GoogleSheetHelperIns.init()

		await loadScript('https://apis.google.com/js/api.js')

		GoogleSheetHelperIns.gapiLoaded()

		await loadScript('https://accounts.google.com/gsi/client')

		GoogleSheetHelperIns.gisLoaded()
	}

	initGoogleSheet()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div className='w-screen h-screen overflow-hidden'>
	{
		status === GameStatuses.IDLE ? <PreGame></PreGame> : (status === GameStatuses.PLAYING ? <InGame></InGame> : <PostGame></PostGame>)
	}
  </div>
}

export default App
