import style from './style.module.scss'

export type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    size?: number
}

export function PlayBtn({ className, size, ...props }: Props) {
    return <div className={style['outer-circle'] + ' ' + className} style={{
        ...props.style,
        width: size ?? '250px',
        height: size ?? '250px'
    }}>
        <div className={style['inner-black-ribbon']}>
            <svg width="223" height="223" viewBox="0 0 223 223" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                <circle id='ld' cx="111.5" cy="111.5" r="106.5" stroke="#262626" strokeWidth="20" strokeLinecap="round" strokeDasharray="19 20"/>
                    <clipPath id="clip">
                        <use href="#ld"/>
                    </clipPath>
                </defs>
                <g>
                    <use href="#ld" stroke="#262626" strokeWidth="10" clipPath="url(#clip)"/>
                    <path d="M167 102.84C173.667 106.689 173.667 116.311 167 120.16L91.25 163.895C84.5833 167.744 76.25 162.932 76.25 155.234V67.7657C76.25 60.0677 84.5833 55.2565 91.25 59.1055L167 102.84Z" fill="#262626"/>
                </g>
            </svg>
        </div>
    </div>
}