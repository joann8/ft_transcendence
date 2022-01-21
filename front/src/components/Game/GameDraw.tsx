import { GameSate } from "./GameTypes";
import { ball_radius, l_paddle_x,r_paddle_x, paddle_w, paddle_h } from "./GameConst";
import { WAIT, PLAY, OVER, PAUSE } from "./GameConst";
            
        export function draw_background(ctx : CanvasRenderingContext2D, color : string, width : number, height : number)
        {
            ctx.clearRect(0,0, width, height);
            ctx.beginPath();
            ctx.fillStyle= color;
            ctx.fillRect(0,0, width, height);
        }
            
        export function draw_line(ctx :  CanvasRenderingContext2D, color : string, width : number, height : number)
        {
            ctx.setLineDash([10, 15]);
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(width /2, 0);
            ctx.lineTo(width / 2, height);
            ctx.stroke();            
        }

        export function draw_ball(ctx :  CanvasRenderingContext2D, color : string, x : number,y : number ,radius : number)
        {
            ctx.beginPath(); //clear path
            ctx.arc(x, y, radius, 0, 2* Math.PI); // create circular item position x,y radius start end 
            ctx.fillStyle = color;
            ctx.fill();
        }

        export function draw_paddle(ctx :  CanvasRenderingContext2D, color : string, x : number, y : number, paddle_w : number, paddle_h : number)
        {
            ctx.beginPath();
            ctx.fillStyle= color;
            ctx.fillRect(x,y, paddle_w, paddle_h);
        }

        export function draw_text(ctx :  CanvasRenderingContext2D, text : string, color : string, font : string, x : number, y : number)
        {
            ctx.fillStyle = color;
            ctx.font = font; 
            ctx.fillText(text, x, y);
        }

        export function draw_end(ctx : CanvasRenderingContext2D, game : GameSate, color_background : string, width : number, height : number, color_object : string, font_text : string)
        {
            draw_background(ctx, color_background, width, height);
            draw_text(ctx, game.score.p1.toString(), color_object, "80px gameFont", 3 * (width / 8), height / 2);
            draw_text(ctx, game.score.p2.toString(), color_object,  "80px gameFont", 5 * (width / 8) - 50, height / 2)  
        }

        export function draw_pause(ctx : CanvasRenderingContext2D, color_background : string, width : number, height : number, color_object : string, font_text : string)
        {
            draw_background(ctx, color_background, width, height);
            draw_text(ctx, "PAUSE", color_object, font_text, width / 2 - 100, height / 2);
        }

        export function draw_welcome(ctx : CanvasRenderingContext2D, color_background : string, width : number, height : number, color_object : string, font_text : string)
        {
            draw_background(ctx, color_background, width, height);
            draw_text(ctx, "Welcome to Pong Game!", color_object, font_text, 100, height / 2);
        }

        export function draw_nogame(ctx : CanvasRenderingContext2D, color_background : string, width : number, height : number, color_object : string, font_text : string)
        {
            draw_background(ctx, color_background, width, height);
            draw_text(ctx, "No current game on going!", color_object, font_text, 100, height / 2);
        }

        export function draw_game(ctx : CanvasRenderingContext2D, game : GameSate,  color_background : string, width : number, height : number, color_object : string, font_text : string)
        {
            draw_background(ctx, color_background, width, height);
            draw_line(ctx,color_object, width, height);
            draw_ball(ctx, color_object, game.ball.x, game.ball.y, ball_radius);
            draw_paddle(ctx, color_object, l_paddle_x, game.paddles.ly, paddle_w, paddle_h);
            draw_paddle(ctx, color_object, r_paddle_x, game.paddles.ry, paddle_w, paddle_h);
            draw_text(ctx, game.score.p1.toString(), color_object, font_text, 3 * (width / 8), height / 12);
            draw_text(ctx, game.score.p2.toString(), color_object, font_text, 5 * (width / 8) - 50, height / 12)    
        }
        
       

        export function draw_all(ctx : CanvasRenderingContext2D, game : GameSate,  color_background : string, width : number, height : number, color_object : string, font_text : string) {
            if (game.state === PLAY)
                draw_game(ctx, game, color_background, width, height, color_object, font_text );     
            else if (game.state === OVER)
                draw_end(ctx, game, color_background, width, height, color_object, font_text);
            else if (game.state === PAUSE)
                draw_pause(ctx, color_background, width, height, color_object, font_text);
            else if (game.state === WAIT)
                draw_welcome(ctx, color_background, width, height, color_object, font_text);
        }



    