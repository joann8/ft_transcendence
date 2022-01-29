import { GameSate } from "./GameTypes";
import { width, height, ball_radius, l_paddle_x,r_paddle_x, paddle_w} from "./GameConst";
import { color_background,font_text,  } from "./GameConst";
import { PLAY, OVER } from "./GameConst";
import back from '../Images/dark.jpg'



    export function draw_background(ctx : CanvasRenderingContext2D) {
        console.log("---> draw background")
                ctx.clearRect(0,0, width, height);
        ctx.beginPath();
        ctx.fillStyle= color_background;
        ctx.fillRect(0,0, width, height);
    }

    /*
    export function draw_image(ctx : CanvasRenderingContext2D) {
        const backgroundImage = new Image();
        backgroundImage.src = `url(${back})`;
        backgroundImage.onload = function() {
            ctx.drawImage(backgroundImage, 0, 0, width, height);
        }
        console.log("---> draw image");
        ctx.clearRect(0,0, width, height);
        ctx.beginPath();
        ctx.drawImage(backgroundImage, 0, 0, width, height);
        //ctx.fillRect(0,0, width, height);
    }
    */  
    export function draw_line(ctx :  CanvasRenderingContext2D, color : string) {
        ctx.setLineDash([10, 15]);
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(width /2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();            
    }

    export function draw_ball(ctx :  CanvasRenderingContext2D, color : string, x : number, y : number) {
        ctx.beginPath(); //clear path
        ctx.arc(x, y, ball_radius, 0, 2* Math.PI); // create circular item position x,y radius start end 
        ctx.fillStyle = color;
        ctx.fill();
    }

    export function draw_paddle(ctx : CanvasRenderingContext2D, color : string, x : number, y : number, paddle_h : number) {
        ctx.beginPath();
        ctx.fillStyle= color;
        ctx.fillRect(x, y, paddle_w, paddle_h);
    }

    export function draw_text(ctx :  CanvasRenderingContext2D, text : string, color : string, font : string, x : number, y : number) {
        ctx.fillStyle = color;
        ctx.font = font; 
        ctx.fillText(text, x, y);
    }

    export function draw_end(image : boolean, ctx : CanvasRenderingContext2D, game : GameSate, color : string) {
    //  image ? draw_background(ctx) : draw_image(ctx) ;
        draw_background(ctx);
        draw_text(ctx, game.score.p1.toString(), color, "80px gameFont", 3 * (width / 8), height / 2);
        draw_text(ctx, game.score.p2.toString(), color,  "80px gameFont", 5 * (width / 8) - 50, height / 2)  
        draw_text(ctx, game.players.p1, color, "20px gameFont", 15, height / 12);
        draw_text(ctx, game.players.p2, color, "20px gameFont", 7 * (width / 8), height / 12) 
    }

    export function draw_pause(ctx : CanvasRenderingContext2D, color : string) {
        draw_background(ctx);
        draw_text(ctx, "PAUSE", color, font_text, width / 2 - 100, height / 2);
    }

    export function draw_welcome(ctx : CanvasRenderingContext2D, color : string) {
        draw_background(ctx);
        draw_text(ctx, "Welcome to Pong Game!", color, font_text, 100, height / 2);
    }

    export function draw_nogame(ctx : CanvasRenderingContext2D, color : string) {
        draw_background(ctx);
        draw_text(ctx, "No current game on going!", color, font_text, 100, height / 2);
    }

    export function draw_game(image : boolean, ctx : CanvasRenderingContext2D, game : GameSate, color : string) {
        //image ? draw_background(ctx) : draw_image(ctx) ;
        draw_background(ctx);
        draw_line(ctx,color);
        draw_ball(ctx, color, game.ball.x, game.ball.y);
        draw_paddle(ctx, color, l_paddle_x, game.paddles.ly, game.paddles.lh);
        draw_paddle(ctx, color, r_paddle_x, game.paddles.ry, game.paddles.rh);
        draw_text(ctx, game.score.p1.toString(), color, font_text, 3 * (width / 8), height / 12);
        draw_text(ctx, game.score.p2.toString(), color, font_text, 5 * (width / 8) - 50, height / 12)
        draw_text(ctx, game.players.p1, color, "20px gameFont", 15, height / 12);
        draw_text(ctx, game.players.p2, color, "20px gameFont", 7 * (width / 8), height / 12)    
    }
    
    export function draw_all(image : boolean, ctx : CanvasRenderingContext2D, game : GameSate,  color : string) {
        if (game.state === PLAY)
            draw_game(image, ctx, game, color);     
        else if (game.state === OVER)
            draw_end(image, ctx, game, color);
    }




    