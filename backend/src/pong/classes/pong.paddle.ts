import { Const } from "../static/pong.constants"

export class Paddle {
    private _x: number;
    private _y: number;
    private _y_tmp : number;
    private _left : boolean;
    private _speed : number;
    private _height : number;

    constructor(left: boolean) {
        this._left = left;
        this._x = left? Const.PADDLE_X_L : Const.PADDLE_X_R;
        this._y = Const.PADDLE_Y;
        this._y_tmp = Const.PADDLE_Y;
        this._speed = Const.PADDLE_SPEED;
        this._height = Const.PADDLE_H;
    }

    // Getters

    public getX() : number {
        return this._x;
    }

    public getY() : number {
        return this._y;
    }

    public getHeight() : number {
        return this._height;
    }
 
    // Other functions

    public up() : void {
        let newY = this._y - this._speed ;
        this._y_tmp = newY < 0? 0 : newY;
    }

    public down() : void {
        let newY = this._y + this._speed ;
        this._y_tmp = newY + this._height > Const.HEIGHT? Const.HEIGHT - this._height : newY;
    }

    public update() : void {
       if (this._y_tmp !== this._y)
        this._y = this._y_tmp;
    }

    public reset() : void {
        this._x = this._left? Const.PADDLE_X_L : Const.PADDLE_X_R;
        this._y = Const.PADDLE_Y;
        this._y_tmp = Const.PADDLE_Y;
        this._speed = Const.PADDLE_SPEED;
    }
   
    public enlargeOn() : void {
        this._height *= 2;
    }

    public enlargeOff() : void {
        this._height = Const.PADDLE_H;
    }
}