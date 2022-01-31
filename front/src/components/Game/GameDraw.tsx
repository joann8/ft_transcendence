import { GameSate } from "./GameTypes";
import { width, height, ball_radius, l_paddle_x,r_paddle_x, paddle_w, color_object2, color_object3} from "./GameConst";
import { color_background, color_background2, font_text} from "./GameConst";
import { WAIT, PLAY, OVER } from "./GameConst";


    export function draw_background(ctx : CanvasRenderingContext2D, backColor : string) {
        ctx.clearRect(0,0, width, height);
        ctx.beginPath();
        ctx.fillStyle= backColor;
        ctx.fillRect(0,0, width, height);
    }
     
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

    export function draw_end(color : boolean, ctx : CanvasRenderingContext2D, game : GameSate, colorObject : string) {
        let back : string, object : string;
        if (color) {
            back = color_background2;
            object = color_object2;
        }
        else {
            back = color_background;
            object = colorObject;
        }       
        draw_background(ctx, back); 
        draw_text(ctx, game.score.p1.toString(), object, "80px gameFont", 3 * (width / 8), height / 2);
        draw_text(ctx, game.score.p2.toString(), object,  "80px gameFont", 5 * (width / 8) - 50, height / 2)  
        draw_text(ctx, game.players.p1, object, "20px gameFont", 15, height / 12);
        draw_text(ctx, game.players.p2, object, "20px gameFont", 7 * (width / 8), height / 12) 
    }

    export function draw_wait(color : boolean, ctx : CanvasRenderingContext2D, game : GameSate, colorObject : string) {
        let back : string, object : string;
        if (color) {
            back = color_background2;
            object = color_object2;
        }
        else {
            back = color_background;
            object = colorObject;
        }           
        draw_background(ctx, back); 
        ctx.fillStyle = object;
        ctx.font = font_text; 
        ctx.fillText("Waiting for another player", 75, height / 2);
    }

    export function draw_already(color : boolean, ctx : CanvasRenderingContext2D, game : GameSate, colorObject : string) {
        let back : string, object : string;
        if (color) {
            back = color_background2;
            object = color_object2;
        }
        else {
            back = color_background;
            object = colorObject;
        }           
        draw_background(ctx, back); 
        ctx.fillStyle = object;
        ctx.font = font_text; 
        ctx.fillText("Waiting for another player", 75, height / 2);
    }

    export function draw_game(color : boolean, ctx : CanvasRenderingContext2D, game : GameSate, colorObject : string) {
        let back : string, object : string;
        if (color) {
            back = color_background2;
            object = color_object2;
        }
        else {
            back = color_background;
            object = colorObject;
        }       
        draw_background(ctx, back); 
        draw_line(ctx, object);
        draw_ball(ctx, object, game.ball.x, game.ball.y);
        draw_paddle(ctx, object, l_paddle_x, game.paddles.ly, game.paddles.lh);
        draw_paddle(ctx, object, r_paddle_x, game.paddles.ry, game.paddles.rh);
        draw_text(ctx, game.score.p1.toString(), object, font_text, 3 * (width / 8), height / 12);
        draw_text(ctx, game.score.p2.toString(), object, font_text, 5 * (width / 8) - 50, height / 12)
        draw_text(ctx, game.players.p1, object, "20px gameFont", 15, height / 12);
        draw_text(ctx, game.players.p2, object, "20px gameFont", 7 * (width / 8), height / 12)    
    }
    
    export function draw_all(color : boolean, ctx : CanvasRenderingContext2D, game : GameSate,  colorObject : string) {
        if (game.state === PLAY)
            draw_game(color, ctx, game, colorObject);     
        else if (game.state === OVER)
            draw_end(color, ctx, game, colorObject);
        else if (game.state === WAIT && colorObject !== color_object3)
            draw_wait(color, ctx, game, colorObject);
    }