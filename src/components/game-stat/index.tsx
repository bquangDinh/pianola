import style from "./style.module.scss";

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  textColor?: string;
};

export function GameStat({ className, textColor, ...props }: Props) {
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
        <span className={style["stat-content"] + " text-5xl"}>40/25</span>
      </div>
      <div className="col-start-2 col-span-1 row-span-1">
        <span className={style["stat-label"]}>Average Timing</span>
        <br></br>
        <span className={style["stat-content"] + " text-5xl"}>0.25</span>
      </div>
      <div className="col-span-2 row-start-2 row-span-1 pt-3">
        <span className={style["stat-content"]}>Treble Clef / D major</span>
      </div>
    </div>
  );
}
