import style from './style.module.scss'

export type Props = {
    onAboutCallback?: () => void,
    onSettingsCallback?: () => void,
}

export function Footer({ onAboutCallback, onSettingsCallback }: Props) {
    return <div className={style['footer']}>
        <a className='text-xl cursor-pointer' onClick={onAboutCallback}>What is this</a>
        <a className='text-xl ml-5 cursor-pointer' onClick={onSettingsCallback}>Settings</a>
        <a className='text-xl ml-5 cursor-pointer'>Github</a>
        <a className='text-xl ml-5 cursor-pointer'>Quang Dinh Bui</a>
    </div>
}