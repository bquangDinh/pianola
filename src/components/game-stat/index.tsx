import { CLEFS, SCALES } from "@src/store/settings";
import style from "./style.module.scss";
import { useBoundStore } from "@src/store";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  textColor?: string;
};

export function GameStat({ className, textColor, ...props }: Props) {
  const {
    hitsCount,
    missesCount,
    averageTiming,
    clef,
    scaleIndex
  } = useBoundStore();

  return (
    <div
      className={
        style["stat-container"] +
        " grid grid-cols-2 grid-rows-2" +
        " " +
        className
      }
      style={{
        ...props,
        color: textColor ?? "#262626",
      }}
      {...props}
    >
      <div className="col-span-1 row-span-1">
        <span className={style["stat-label"]}>Hits/Misses</span>
        <br></br>
        <span className={style["stat-content"] + " text-5xl"}>{hitsCount}/{missesCount}</span>
      </div>
      <div className="col-start-2 col-span-1 row-span-1">
        <span className={style["stat-label"]}>Average Timing</span>
        <br></br>
        <span className={style["stat-content"] + " text-5xl"}>{averageTiming ? averageTiming.toFixed(2) : -1}</span>
      </div>
      <div className="col-span-2 row-start-2 row-span-1 pt-3">
        <span className={style["stat-content"]}>{clef === CLEFS.TREBLE ? 'Treble' : 'Bass'} Clef / {SCALES[scaleIndex]}</span>
      </div>
    </div>
  );
}
