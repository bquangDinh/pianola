import style from './style.module.scss'

export type Props = {
    onAboutCallback?: () => void,
    onSettingsCallback?: () => void,
}

export function Footer({ onAboutCallback, onSettingsCallback }: Props) {
    return <div className={style['footer']}>
        <a className='text-xl' onClick={onAboutCallback}>What is this</a>
        <a className='text-xl ml-5' onClick={onSettingsCallback}>Settings</a>
        <a className='text-xl ml-5'>Github</a>
        <a className='text-xl ml-5'>Quang Dinh Bui</a>
    </div>
}