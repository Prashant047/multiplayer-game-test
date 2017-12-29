import {ctx, gameBoardDimentions} from './gameSettings';

class Bullet{
    constructor(x, y, velocity, color){
        this.color = color
        this.x = x;
        this.y = y;
        this.radius = 3;
        this.velocity = {
            x: velocity.x,
            y: velocity.y
        }
    }

    update(){
        this.x += this.velocity.x;
        this.y += this.velocity.y; 
    }
    
    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill(); 
    }
};

class Cannon{
    constructor(x, y, angle, color){
        this.color = color;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.bullets = [];
        this.bulletSpeed = 8;
        this.bulletVelocity = {
            x: this.bulletSpeed*Math.cos(this.angle),
            y: this.bulletSpeed*Math.sin(this.angle)
        };
    }

    fireBullet(){
        let bullet = new Bullet(this.x, this.y, this.bulletVelocity, this.color);
        this.bullets.push(bullet);
    }

    update(){
        this.bullets.forEach((bullet,index) => {
            bullet.update();
            bullet.draw();
        });
        for(let i=0;i<this.bullets.length;i++){
            if(this.bullets[i].x-this.bullets[i].radius > gameBoardDimentions.width || this.bullets[i].x+this.bullets[i].radius < 0){
                this.bullets.splice(i,1);
                console.log('removed x');
                continue;
            }
            if(this.bullets[i].y-this.bullets[i].radius > gameBoardDimentions.height || this.bullets[i].y+this.bullets[i].radius < 0){
                this.bullets.splice(i,1);
                console.log('removed y');
                continue;
            }
        }
    }


}

export {Cannon}; 