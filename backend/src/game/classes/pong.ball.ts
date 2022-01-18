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
        //this._dx = 1;
        let rand = Math.random();
        this._dx = rand > 0.5? 1 : -1;
        this._y = Const.HEIGHT / 2;
        //this._dy = 1;
        rand = Math.random();
        this._dy = rand > 0.5? 1 : -1;
        this._speed = 0; // 0 for beginning? 'pause'
       //this._speed = Const.BALL_SPEED; // 0 for beginning? 'pause'
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
        if ((this._isScoring === false)
            && (newX - this._radius <= paddle.getX() + paddle.getWidth()))
        {
            if ((this._y >= paddle.getY())
                && (this._y <= paddle.getY() + paddle.getHeight()))
            {
                toReturn = paddle.getX() + paddle.getWidth() + this._radius;
                this._dx *= -1;
            }
            else
            {
                this._isScoring = true;   
                this.pause();
            }
        }    
        return toReturn;
    }

    public hitPaddleRight( paddle: Paddle , newX : number) : number
    {
        let toReturn = newX;
        // Zone danger
        if ((this._isScoring === false)
            && (newX + this._radius >= paddle.getX()))
        {
            if ((this._y >= paddle.getY())
                && (this._y <= paddle.getY() + paddle.getHeight()))
            {
                toReturn = paddle.getX() - this._radius;
                this._dx *= -1;
            }
            else
            {
                this._isScoring = true; 
                this.pause();
            } 
        }    
        return toReturn;
    }
   
    public moveX(game) : void
    {      
        let newX = this._x + (this._speed * this._dx);
        console.log(`before newX = ${newX}`);
        if (this._dx === -1) //Zone de danger à gauche
            newX = this.hitPaddleLeft(game.getPlayer1().getPaddle(), newX);
        else //Zone de danger à droite
            newX = this.hitPaddleRight(game.getPlayer2().getPaddle(), newX);
        console.log(` after newX = ${newX}`);
        this._x = newX;      
    }   

    public moveY() : void {
        let newY = this._y + (this._speed * this._dy);
        console.log(`______before newY = ${newY}`);

        if (newY + this._radius > Const.HEIGHT || newY < this._radius)
        {
            newY < this._radius ? this._y = this._radius : this._y = Const.HEIGHT - this._radius;
            this._dy *= -1;
        }
        else
            this._y = newY;
        console.log(`_______after newY = ${newY}`);

    }

    public updateBall(game: Game)
    {
        if (this._isScoring === false)
        {
            this.moveX(game);
            this.moveY();
        }
        else if (this._isScoring === true)
        {
            //this.pause();
            //if (this._x <= -this._radius)
            if (this._x < Const.PADDLE_W)
            {
                console.log("Scoring for player 2!!!!");
                game.pauseAndScore(game.getPlayer2());
            }
            else
            {
                console.log("Scoring for player 1!!!!");
                game.pauseAndScore(game.getPlayer1());
            }
        }
        /*
        if (this._x <= -this._radius)

        {
            game.getPlayer2().setScore(game.getPlayer2().getScore() + 1);
            this.reset();
        }
        else if (this._x >= Const.WIDTH + this._radius)
        {
            game.getPlayer1().setScore(game.getPlayer1().getScore() + 1);
            this.reset();
        }
        */
    }

    public reset() : void
    {
        this._x = Const.WIDTH / 2;
       // let rand = Math.random();
        //this._dx = rand > 0.5? 1 : -1;
        this._dx *= -1;
        this._y = Const.HEIGHT / 2;
        //rand = Math.random();
        //this._dy = rand > 0.5? 1 : -1;
        this._dy *= -1;
        this._speed = Const.BALL_SPEED;
        //this._radius = Const.BALL_RADIUS;
        this._isScoring = false; 
        console.log(`Ball reset |  x = ${this._x}  | y = ${this._y}`);
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