import {ctx, gameBoardDimentions} from './gameSettings';
import {Vehicle} from './vehicle';
import {socket} from './socket';

const vehicles = [];
let myVehicle;
// Handeling socket stuff ------------
socket.on('connect',() => {
    console.log('connected to the server');
});

socket.on('init', (data) => {

    if(vehicles.length == 0){
        let newVehicle = new Vehicle(data.newVehicle.position, 
                                     data.newVehicle.color,
                                     data.newVehicle.angle, 
                                     data.newVehicle.id
                                    );
        console.log("initialized myself");
        myVehicle = newVehicle;
        vehicles.push(myVehicle);
        myVehicle.activateListener();
        data.oldVehicles.forEach((v,index) => {
            vehicles.push(new Vehicle(v.position, v.color, v.angle, v.id));
        });
    }
    else{
        vehicles.push(new Vehicle(data.newVehicle.position,
                                  data.newVehicle.color,
                                  data.newVehicle.angle, 
                                  data.newVehicle.id
                                 )
                      );
        console.log('added new player');
    }
    console.log(vehicles)
})

// HANDELING MOVEMENT EVENTS
// -------------------------------------

socket.on('turn-left', (data) => {
    vehicles.forEach((vehicle,index) => {
        if(vehicle.id == data.id){
            vehicle.isRotating = true;
            vehicle.turningLeft = true;
        }
    });
});

socket.on('turn-right', (data) => {
    vehicles.forEach((vehicle,index) => {
        if(vehicle.id == data.id){
            vehicle.isRotating = true;
            vehicle.turningRight = true;
        }
    });
});

socket.on('move-backwards', (data) => {
    vehicles.forEach((vehicle,index) => {
        if(vehicle.id == data.id){
            vehicle.isMoving = true;
            vehicle.movingBackwards = true;
        }
    });
});

socket.on('move-forwards', (data) => {
    vehicles.forEach((vehicle,index) => {
        if(vehicle.id == data.id){
            vehicle.isMoving = true;
            vehicle.movingForwards = true;
        }
    });
});

socket.on('stop-turning-right', (data) => {
    vehicles.forEach((vehicle,index) => {
        if(vehicle.id == data.id){
            vehicle.isRotating = false;
            vehicle.turningLeft = false;
            vehicle.turningRight = false;
        }
    });
});

socket.on('stop-turning-left', (data) => {
    vehicles.forEach((vehicle,index) => {
        if(vehicle.id == data.id){
            vehicle.isRotating = false;
            vehicle.turningLeft = false;
            vehicle.turningRight = false;
        }
    });
});

socket.on('stop-moving-forwards', (data) => {
    vehicles.forEach((vehicle,index) => {
        if(vehicle.id == data.id){
            vehicle.isMoving = false;
            vehicle.movingForwards = false;
            vehicle.movingBackwards = false;
        }
    });
});

socket.on('stop-moving-backwards', (data) => {
    vehicles.forEach((vehicle,index) => {
        if(vehicle.id == data.id){
            vehicle.isMoving = false;
            vehicle.movingForwards = false;
            vehicle.movingBackwards = false;
        }
    });
});

socket.on('fire-bullets', (data) => {
    vehicles.forEach((vehicle,index) => {
        if(vehicle.id == data.id){
            vehicle.cannon.fireBullet();
        }
    });
})

// -------------------------------------

socket.on('bye', (data) => {
    // console.log(data.message);
    for(let i=0;i<vehicles.length;i++){
        if(vehicles[i].id == data.id){
            vehicles.splice(i,1);
        }
    }
});
// ------------------------------

const gameLoop = () => {
    ctx.clearRect(0, 0, gameBoardDimentions.width, gameBoardDimentions.height);

    vehicles.forEach((vehicle, index) => {
        vehicle.update();
        vehicle.draw();
    });

    requestAnimationFrame(gameLoop);
};
gameLoop();