import { GameObject } from "./game-object";

export class FlashEffect extends GameObject {
    protected _id = 'flash-effect'

    static readonly DURATION = 0.5 // seconds

    private timelapsed = 0

    private _activeFlash = false

    public activateFlash() {
        this._activeFlash = true
    }

    public init() {
        //
    }

    public render() {
        if (this._activeFlash) {
            this.drawFlashRectangle(this.timelapsed)    
        }
    }

    private drawFlashRectangle(timelapsed: number) {
        const percentage = timelapsed / FlashEffect.DURATION

        const easeSinFunc = (x: number) => 0.5 * Math.sin(x * Math.PI) + 0.5 * Math.sin(5 * x * Math.PI)

        const value = easeSinFunc(percentage)

        const canvas = this.game.canvas

        const ctx = this.game.canvas.getContext('2d')

        if (!ctx) return

        ctx.fillStyle = `rgba(231, 76, 60, ${0.5 * value})`

        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // reset fillStyle back to default
        ctx.fillStyle = '#000000'
    }

    public update(dt: number) {
        if (this._activeFlash) {
            if (this.timelapsed >= FlashEffect.DURATION) {
                this._activeFlash = false
                this.timelapsed = 0
            } else {
                this.timelapsed += dt
            }
        }
    }

    public destroy() {
        //
    }
}