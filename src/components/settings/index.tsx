import style from "./style.module.scss";
import { useBoundStore } from "@src/store";
import { CLEFS, SCALES } from "@src/store/settings";
import { useEffect, useState } from "react";

export type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function Settings(props: Props) {
  const {
    scaleIndex,
    setScaleIndex,
    revertMotion,
    setRevertMotion,
    clef,
    setClef,
    speedFactor,
    setSpeedFactor,
    googleSheetID,
    setGoogleSheetID,
    midiInput,
  } = useBoundStore();

  const [speedFactorStr, setSpeedFactorStr] = useState(speedFactor.toString())

  useEffect(() => {
    try {
        setSpeedFactor(Number.parseFloat(speedFactorStr))
    } catch {
        //
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speedFactorStr])

  const onScaleClicked = () => {
    setScaleIndex((scaleIndex + 1) % SCALES.length);
  };

  const onRevertMotionChanged = (value: boolean) => {
    setRevertMotion(value);
  };

  const onClefChanged = (value: CLEFS) => {
    setClef(value);
  };

  const onGoogleIdChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoogleSheetID(e.target.value);
  };

  const onSpeedFactorChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeedFactorStr(e.target.value)
  }

  return (
    <div {...props}>
      <div className={style["settings"] + " w-full gap-y-4 grid grid-cols-12"}>
        <div className={style["setting-option"] + " col-span-6"}>
          <span className={style["hint"] + " text-sm xl:text-base"}>
            Practice on a specific scale
          </span>
          <div className="flex">
            <span className={style["option-name"] + " text-2xl xl:text-4xl"}>
              Scale:&emsp;
            </span>
            <div className="flex-1">
              <span
                id={style["scale-option"]}
                className={style["option-name"] + " text-2xl xl:text-4xl"}
                onClick={onScaleClicked}
              >
                {SCALES[scaleIndex]}
              </span>
            </div>
          </div>
        </div>

        <div className={style["setting-option"] + " col-span-6"}>
          <span className={style["hint"] + " text-sm xl:text-base"}>
            Switching note-taking direction
          </span>
          <div className="flex">
            <span className={style["option-name"] + " text-2xl xl:text-4xl"}>
              Revert motion:&emsp;
            </span>
            <div className="flex-1">
              <label
                className={
                  style["option-name"] +
                  " " +
                  style["option-radio"] +
                  " text-2xl xl:text-4xl"
                }
              >
                <input
                  type="radio"
                  checked={revertMotion}
                  name="revert-motion-radio"
                  onChange={() => onRevertMotionChanged(true)}
                ></input>
                <span>Yes</span>
              </label>
              <label
                className={
                  style["option-name"] +
                  " " +
                  style["option-radio"] +
                  " text-2xl xl:text-4xl ml-3"
                }
              >
                <input
                  type="radio"
                  checked={!revertMotion}
                  name="revert-motion-radio"
                  onChange={() => onRevertMotionChanged(false)}
                ></input>
                <span>No</span>
              </label>
            </div>
          </div>
        </div>

        <div className={style["setting-option"] + " col-span-6"}>
          <span className={style["hint"] + " text-sm xl:text-base"}>
            Lower or fasten the speed of notes
          </span>
          <div className="flex">
            <span className={style["option-name"] + " text-2xl xl:text-4xl"}>
              Speed factor:&emsp;
            </span>
            <div className="flex-1">
              <label>
                <input
                  type="text"
                  placeholder="Enter"
                  className={
                    style["option-name"] +
                    " " +
                    style["option-input"] +
                    " text-2xl xl:text-4xl"
                  }
                  value={speedFactorStr}
                  onChange={onSpeedFactorChanged}
                ></input>
              </label>
            </div>
          </div>
        </div>

        <div className={style["setting-option"] + " col-span-6"}>
          <span className={style["hint"] + " text-sm xl:text-base"}>
            Practice on a specific clef or both
          </span>
          <div className="flex">
            <span className={style["option-name"] + " text-2xl xl:text-4xl"}>
              Clef:&emsp;
            </span>
            <div className="flex-1">
              <label
                className={
                  style["option-name"] +
                  " " +
                  style["option-radio"] +
                  " text-2xl xl:text-4xl"
                }
              >
                <input
                  type="radio"
                  checked={clef == CLEFS.TREBLE}
                  name="clef-radio"
                  onChange={() => onClefChanged(CLEFS.TREBLE)}
                ></input>
                <span>Treble</span>
              </label>
              <label
                className={
                  style["option-name"] +
                  " " +
                  style["option-radio"] +
                  " text-2xl xl:text-4xl ml-3"
                }
              >
                <input
                  type="radio"
                  checked={clef == CLEFS.BASS}
                  name="clef-radio"
                  onChange={() => onClefChanged(CLEFS.BASS)}
                ></input>
                <span>Bass</span>
              </label>
            </div>
          </div>
        </div>

        <div className={style["setting-option"] + " col-span-6"}>
          <span className={style["hint"] + " text-sm xl:text-base"}>
            Save stat data into Google Sheet
          </span>
          <div className="flex">
            <span className={style["option-name"] + " text-2xl xl:text-4xl"}>
              Google Sheet ID:&emsp;
            </span>
            <div className="flex-1">
              <label>
                <input
                  type="text"
                  placeholder="Enter"
                  className={
                    style["option-name"] +
                    " " +
                    style["option-input"] +
                    " text-2xl xl:text-4xl"
                  }
                  value={googleSheetID}
                  onChange={onGoogleIdChanged}
                ></input>
              </label>
            </div>
          </div>
        </div>

        <div className={style["setting-option"] + " col-span-6"}>
          <span className={style["hint"] + " text-sm xl:text-base"}>
            Connect computer to a piano
          </span>
          <div className="flex">
            <span className={style["option-name"] + " text-2xl xl:text-4xl"}>
              MIDI Input:&emsp;
            </span>
            <div className="flex-1">
              <span className={style["option-name"] + " text-2xl xl:text-4xl"}>
                {midiInput}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
