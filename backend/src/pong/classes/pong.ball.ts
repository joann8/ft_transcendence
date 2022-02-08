import { Const } from "../static/pong.constants"
import { Game } from "./pong.game";
import { Paddle } from "./pong.paddle";

export class Ball {
    private _x: number;
    private _dx : number;
    private _y: number;
    private _dy : number;
    private _speed : number;
    private _isScoring : boolean;
    private _scorer : number;
    private _accelerate : boolean;

    constructor(accelerate : boolean) {
        this._x = Const.WIDTH / 2;
        this._dx = Math.random() > 0.5? 1 : -1;
        this._y = Const.HEIGHT / 2;
        this._dy = Math.random() > 0.5? 1 : -1;
        this._speed = Const.BALL_SPEED; 
        this._isScoring = false; 
        this._scorer = 0;
        this._accelerate = accelerate;
    }

    // Getters

    public getX() : number {
        return this._x;
    }

    public getY() : number {
        return this._y;
    }

    public setAccelerate (accelerate : boolean) : void {
        this._accelerate = accelerate;
        if (accelerate === false)
            this._speed = Const.BALL_SPEED;
    }

    // Other functions

    public hitPaddleLeft( paddle: Paddle , newX : number) : number {
        let toReturn = newX;
        if (newX - Const.BALL_RADIUS <= paddle.getX() + Const.PADDLE_W)
        {
            if ((this._y >= paddle.getY())
                && (this._y <= paddle.getY() + paddle.getHeight())) {
                toReturn = paddle.getX() + Const.PADDLE_W + Const.BALL_RADIUS;
                this._dx *= -1;
                if (this._accelerate === true)
                    this.accelerateBall();
            }
            else {
                this._isScoring = true;  
                this._scorer = 2; 
            }
        }    
        return toReturn;
    }

    public hitPaddleRight( paddle: Paddle , newX : number) : number {
        let toReturn = newX;
        if (newX + Const.BALL_RADIUS >= paddle.getX())
        {

            if ((this._y >= paddle.getY())
                && (this._y <= paddle.getY() + paddle.getHeight()))
            {
                toReturn = paddle.getX() - Const.BALL_RADIUS;
                this._dx *= -1;
                if (this._accelerate === true)
                    this.accelerateBall();
            }
            else {
                this._isScoring = true; 
                this._scorer = 1; 
            } 
        }    
        return toReturn;
    }
   
    public moveX(game) : void
    {      
        let newX = this._x + (this._speed * this._dx);
        if (this._dx === -1) //Zone de danger à gauche
            newX = this.hitPaddleLeft(game.getPlayer1().getPaddle(), newX);
        else //Zone de danger à droite
            newX = this.hitPaddleRight(game.getPlayer2().getPaddle(), newX);
        this._x = newX;      
    }   

    public moveY() : void {
        let newY = this._y + (this._speed * this._dy);
        if (newY + Const.BALL_RADIUS > Const.HEIGHT || newY < Const.BALL_RADIUS) {
            newY < Const.BALL_RADIUS ? this._y = Const.BALL_RADIUS : this._y = Const.HEIGHT - Const.BALL_RADIUS;
            this._dy *= -1;
        }
        else
            this._y = newY;
    }

    public  updateBall(game: Game) : void {
        if (this._isScoring === false) {
            this.moveX(game);
            this.moveY();
        }
        else if (this._isScoring === true)
            this._scorer === 2 ? game.pauseAndScore(game.getPlayer2()) : game.pauseAndScore(game.getPlayer1());
    }

    public accelerateBall() : void {
        if (this._speed < Const.BALL_SPEEDMAX)
            this._speed += Const.BALL_ACCELERATE;
    }

    public reset() : void {
        this._x = Const.WIDTH / 2;
        this._dx =  Math.random() > 0.5? 1 : -1;
        this._y = Const.HEIGHT / 2;
        this._dy = Math.random() > 0.5? 1 : -1;
        this._speed = Const.BALL_SPEED;
        this._isScoring = false; 
        this._scorer = 0; 
    }
}