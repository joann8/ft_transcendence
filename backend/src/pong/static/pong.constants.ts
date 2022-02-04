export class Const {
    //CANVAS
    static readonly WIDTH : number = 800;
    static readonly HEIGHT : number = 600;
    
    //PADDLE
    static readonly PADDLE_H : number = 100;
    static readonly PADDLE_W : number = 8;
    static readonly PADDLE_X_L: number = 0; //2?
    static readonly PADDLE_X_R: number = Const.WIDTH - Const.PADDLE_W; // pas sure
    static readonly PADDLE_Y : number= (Const.HEIGHT / 2) - (Const.PADDLE_H /2)
    static readonly PADDLE_SPEED : number = 30;

    //BALL
    static readonly BALL_RADIUS : number = 10;
    static readonly BALL_SPEED : number = 5; 
    static readonly BALL_ACCELERATE : number = 2; 
    static readonly BALL_SPEEDMAX : number = 15; 
  
    //GAME CONFIG
    static readonly MAX_SCORE : number = 3; // put back to 10
    static readonly FPS : number = 100; // frame per second --> vitesse de broadcast
}