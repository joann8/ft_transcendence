import { Const } from "../static/pong.constants"
import { Game } from "./pong.game";
import { Paddle } from "./pong.paddle";
import { v4 as uuidv4} from 'uuid';


export class Ball {
    private _x: number;
    private _dx : number;
    private _y: number;
    private _dy : number;
    private _speed : number;
    private _radius : number;
    private _isScoring : boolean;

    constructor()
    {
        this._x = Const.WIDTH / 2;
        this._dx = 1;
       // this._dx = Math.random() > 0.5? 1 : -1;
        this._y = Const.HEIGHT / 2;
        this._dy = 1;
       // this._dx = Math.random() > 0.5? 1 : -1;
        this._speed = Const.BALL_SPEED; // 0 for beginning? 'pause'
        this._radius = Const.BALL_RADIUS;
        this._isScoring = false; 
    }

    // Getters

    public getX() : number {
        return this._x;
    
    }
    public getY() : number {
        return this._y;
    }

    // Other functions

    public hitPaddleLeft( paddle: Paddle , newX : number) : number
    {
        let toReturn = newX;
        // Zone danger
        if (this._isScoring === false 
            && newX - this._radius <= paddle.getX() + paddle.getWidth())
        {
            if (this._y >= paddle.getY() 
                &&  this._y <= paddle.getY() + paddle.getHeight())
            {
                toReturn = paddle.getX() + paddle.getWidth();
                this._dy = -this._dy;
            }
            else
                this._isScoring = true;   
        }    
        return toReturn;
    }

    public hitPaddleRight( paddle: Paddle , newX : number) : number
    {
        let toReturn = newX;
        // Zone danger
        if (this._isScoring === false 
            && newX + this._radius >= paddle.getX())
        {
            if (this._y >= paddle.getY() 
                &&  this._y <= paddle.getY() + paddle.getHeight())
            {
                toReturn = paddle.getX();
                this._dy = -this._dy;
            }
            else
                this._isScoring = true;   
        }    
        return toReturn;
    }
   
    public moveX(game) : void
    {
        let newX = this._x + (this._speed * this._dx);
        if(this._dx === -1) //Zone de danger à gauche
            newX = this.hitPaddleLeft(game.player1.getPaddle(), newX);
        else //Zone de danger à droite
            newX = this.hitPaddleRight(game.player2.getPaddle(), newX);
        this._x = newX;      
    }   

    public moveY() : void {
        let newY = this._y + (this._speed * this._dy);
        if (newY + this._radius > Const.HEIGHT || newY < this._radius)
        {
            this._y = newY < this._radius ? this._radius : Const.HEIGHT - this._radius;
            this._dy = -this._dy;
        }
        else
            this._y = newY;
    }

    public updateBall(game: Game)
    {
        this.moveX(game);
        this.moveY();
        if (this._x <= -this._radius)
            game.getPlayer2().setScore(game.getPlayer2().getScore() + 1);
        else if (this._x >= Const.WIDTH + this._radius)
            game.getPlayer1().setScore(game.getPlayer1().getScore() + 1);
    }

    public reset() : void
    {
        this._x = Const.WIDTH / 2;
       // this._dx = Math.random() > 0.5? 1 : -1;
       this._y = Const.HEIGHT / 2;
       // this._dy = Math.random() > 0.5? 1 : -1;
        this._speed = Const.BALL_SPEED;
        //this._radius = Const.BALL_RADIUS;
        this._isScoring = false; 
    }

    public pause() : void
    {
        this._speed = 0;
    }

    public resume() : void
    {
        this._speed = Const.BALL_SPEED;

    }
}