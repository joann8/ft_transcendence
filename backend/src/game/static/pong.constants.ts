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
    static readonly BALL_SPEED : number = 6; 
  
    //GAME CONFIG
    static readonly MAX_SCORE : number = 10;
    static readonly FPS : number = 1000 / 30; // frame per second --> vitesse de broadcast
}