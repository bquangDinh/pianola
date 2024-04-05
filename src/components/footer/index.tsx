import style from './style.module.scss'

export type Props = {
	onAboutCallback?: () => void,
	onSettingsCallback?: () => void,
}

export function Footer({ onAboutCallback, onSettingsCallback }: Props) {
	return <div className={style['footer']}>
		<a className={style['text'] + ' text-xl cursor-pointer'} onClick={onAboutCallback}>What is this</a>
		<a className={style['text'] + ' text-xl ml-5 cursor-pointer'} onClick={onSettingsCallback}>Settings</a>
		<a className={style['text'] + ' text-xl ml-5 cursor-pointer'} target='_blank' href='https://github.com/bquangDinh/pianola.git' rel='noopener noreferrer'>Github</a>
		<a className={style['text'] + ' text-xl ml-5 cursor-pointer'} target='_blank' href='https://qdinh.me/jupiter' rel='noopener noreferrer'>Quang Dinh Bui</a>
	</div>
}