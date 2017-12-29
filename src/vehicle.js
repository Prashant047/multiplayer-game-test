import {ctx} from './gameSettings';
import {Cannon} from './cannon';
import {socket} from './socket';

class Vehicle{
    constructor(position, color, angle, id){
        this.id = id;
        this.x = position.x;
        this.y = position.y;
        this.color = color
        this.noseLength = 40;
        this.angle = angle; // in radians
        this.angularVelocity = 0.07; 
        this.isRotating = false;
        this.turningLeft = false;
        this.turningRight = false;
        this.speed = 3;
        this.velocity = {
            x: this.speed*Math.cos(this.angle),
            y: this.speed*Math.sin(this.angle)
        };
        this.isMoving = false;
        this.movingForwards = false;
        this.movingBackwards = false;
        this.cannon = new Cannon(this.x+this.noseLength*Math.cos(this.angle), 
                                 this.y+this.noseLength*Math.sin(this.angle), this.angle, this.color);
    }

    activateListener(){
        /**
         * up = 38
         * down = 40
         * right = 39
         * left = 37
         * space = 32
         */

        // bullet firing event
        window.addEventListener('keypress', (e) => {
            // Space
            e.preventDefault();
            if(e.keyCode == 32){
                console.log("firing");
                this.cannon.fireBullet();
                socket.emit('firing-bullets',{
                    id: this.id
                })
            }
        });
        // -----------------------------

        window.addEventListener('keydown', (e) => {
            // console.log(e.which);
            // FOR ROTATION OF THE VEHICLE
            // Right
            if(e.keyCode == 39){
                e.preventDefault();
                // this.isRotating = true;
                // this.turningRight = true;
                socket.emit('turning-right',{
                    id: this.id,
                    position: {
                        x: this.x,
                        y: this.y
                    },
                    angle: this.angle
                });
            }
            // Left
            if(e.keyCode == 37){
                e.preventDefault();
                // this.isRotating = true;
                // this.turningLeft = true;
                socket.emit('turning-left',{
                    id: this.id,
                    position: {
                        x: this.x,
                        y: this.y
                    },
                    angle: this.angle
                });
            }
            // ---------------------------

            // FOR MOVEMENT OF THE VEHICLE
            // Up
            if(e.keyCode == 38){
                e.preventDefault();
                // this.isMoving = true;
                // this.movingForwards = true;
                socket.emit('moving-forwards',{
                    id: this.id,
                    position: {
                        x: this.x,
                        y: this.y
                    },
                    angle: this.angle
                });
            }
            // Down
            if(e.keyCode == 40){
                e.preventDefault();
                // this.isMoving = true;
                // this.movingBackwards = true;
                socket.emit('moving-backwards',{
                    id: this.id,
                    position: {
                        x: this.x,
                        y: this.y
                    },
                    angle: this.angle
                });
            }
            // -----------------------------

        });

        window.addEventListener('keyup', (e) => {
            // Right
            if(e.keyCode == 39){
                // this.isRotating = false;
                // this.turningLeft = false;
                // this.turningRight = false;
                socket.emit('stopped-turning-right', {
                    id: this.id,
                    position: {
                        x: this.x,
                        y: this.y
                    },
                    angle: this.angle
                });
            }
            // left
            if(e.keyCode == 37){
                // this.isRotating = false;
                // this.turningLeft = false;
                // this.turningRight = false;
                socket.emit('stopped-turning-left', {
                    id: this.id,
                    position: {
                        x: this.x,
                        y: this.y
                    },
                    angle: this.angle
                });
            }
            // up
            if(e.keyCode == 38){
                // this.isMoving = false;
                // this.movingForwards = false;
                // this.movingBackwards = false;
                socket.emit('stopped-moving-forwards', {
                    id: this.id,
                    position: {
                        x: this.x,
                        y: this.y
                    },
                    angle: this.angle
                });
            }
            // down
            if(e.keyCode == 40){
                // this.isMoving = false;
                // this.movingForwards = false;
                // this.movingBackwards = false;
                socket.emit('stopped-moving-backwards', {
                    id: this.id,
                    position: {
                        x: this.x,
                        y: this.y
                    },
                    angle: this.angle
                });
            }
        });

        
    }

    // UPDATING CANNONS COORDINATES
    updateCannonAngle(){
        this.cannon.angle = this.angle;
        this.cannon.bulletVelocity.x = this.cannon.bulletSpeed*Math.cos(this.cannon.angle);
        this.cannon.bulletVelocity.y = this.cannon.bulletSpeed*Math.sin(this.cannon.angle);
        this.updateCannonPosition();
    }

    updateCannonPosition(){
        this.cannon.x = this.x+this.noseLength*Math.cos(this.angle)
        this.cannon.y = this.y+this.noseLength*Math.sin(this.angle)
    }
    // ----------------------------

    update(){
        if(this.isRotating && this.turningLeft){
            this.angle -= this.angularVelocity;
            // changing the direction of velocity to the direction of nose
            this.velocity.x = this.speed*Math.cos(this.angle);
            this.velocity.y = this.speed*Math.sin(this.angle);
            this.updateCannonAngle(); 
            
        }
        if(this.isRotating && this.turningRight){
            this.angle += this.angularVelocity;
            // changing the direction of velocity to the direction of nose
            this.velocity.x = this.speed*Math.cos(this.angle);
            this.velocity.y = this.speed*Math.sin(this.angle);
            this.updateCannonAngle();
        }

        if(this.isMoving && this.movingForwards){
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.updateCannonPosition();
        }
        if(this.isMoving && this.movingBackwards){
            this.x -= this.velocity.x;
            this.y -= this.velocity.y;
            this.updateCannonPosition();
        }
        this.cannon.update();
    }

    // Draw the vehicle
    draw(){
        ctx.beginPath();
        ctx.moveTo(this.x+this.noseLength*Math.cos(this.angle), 
                   this.y+this.noseLength*Math.sin(this.angle));

        ctx.lineTo(this.x+this.noseLength*Math.cos(2*Math.PI/3 + this.angle)/3,
                   this.y+this.noseLength*Math.sin(2*Math.PI/3 + this.angle)/3);

        ctx.lineTo(this.x, this.y);

        ctx.lineTo(this.x+this.noseLength*Math.cos(4*Math.PI/3 + this.angle)/3,
                   this.y+this.noseLength*Math.sin(4*Math.PI/3 + this.angle)/3);

        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        
    }
}

export {Vehicle};