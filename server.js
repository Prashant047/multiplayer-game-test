import express from 'express';
import chalk from 'chalk';
// import {gameBoardDimentions} from './src/gameSettings';
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = 3001;

app.use(express.static(__dirname+'/build')); // Serving the html file

const clients = []
const getColor = () => {
    let colors = [
        '#4ECDC4',
        '#F7FFF7',
        '#FF6B6B',
        '#FFE66D'
    ];
    return colors[Math.floor(Math.random()*colors.length)];
};

// Handeling socket connections
// ------------------------------
io.on('connection',(client) => {
    console.log("Client connected--"+chalk.green("["+client.id+"]"));
    let oldVehicles = [...clients];

    // New client's vehicles settings
    let color = getColor();
    let position = {
        x: Math.random()*800,
        y: Math.random()*600
    };
    let angle = Math.random()*Math.PI*2;

    let newVehicle = {
        color,
        position,
        angle,
        id: client.id
    }
    // -------------------------------
    clients.push(newVehicle);

    console.log("No. Of clients connected--"+chalk.blue("["+clients.length+"]"));

    io.emit('init',{
        newVehicle,
        oldVehicles
    });
    


    // io.emit('init',{
    //     color,
    //     position,
    //     angle,
    //     id: client.id
    // });


    // HANDELING MOVEMENT EVENTS
    // -------------------------------------

    client.on('turning-left', (data) => {
        clients.forEach((c,index) => {
            if(c.id == data.id){
                c.position = data.position,
                c.angle = data.angle
            }
        });
        io.emit('turn-left',{
            id: data.id
        });
    })
    client.on('turning-right', (data) => {
        clients.forEach((c,index) => {
            if(c.id == data.id){
                c.position = data.position,
                c.angle = data.angle
            }
        });
        io.emit('turn-right',{
            id: data.id
        });
    })
    client.on('moving-backwards', (data) => {
        clients.forEach((c,index) => {
            if(c.id == data.id){
                c.position = data.position,
                c.angle = data.angle
            }
        });
        io.emit('move-backwards',{
            id: data.id
        });
    })
    client.on('moving-forwards', (data) => {
        clients.forEach((c,index) => {
            if(c.id == data.id){
                c.position = data.position,
                c.angle = data.angle
            }
        });
        io.emit('move-forwards',{
            id: data.id
        });
    })

    client.on('stopped-turning-right', (data) => {
        clients.forEach((c,index) => {
            if(c.id == data.id){
                c.position = data.position,
                c.angle = data.angle
            }
        });
        io.emit('stop-turning-right',{
            id: data.id
        });
    });
    client.on('stopped-turning-left', (data) => {
        clients.forEach((c,index) => {
            if(c.id == data.id){
                c.position = data.position,
                c.angle = data.angle
            }
        });
        io.emit('stop-turning-left',{
            id: data.id
        });
    });
    client.on('stopped-moving-forwards', (data) => {
        clients.forEach((c,index) => {
            if(c.id == data.id){
                c.position = data.position,
                c.angle = data.angle
            }
        });
        io.emit('stop-moving-forwards',{
            id: data.id
        });
    });
    client.on('stopped-moving-backwards', (data) => {
        clients.forEach((c,index) => {
            if(c.id == data.id){
                c.position = data.position,
                c.angle = data.angle
            }
        });
        io.emit('stop-moving-backwards',{
            id: data.id
        });
    });

    client.on('firing-bullets', (data) => {
        io.emit('fire-bullets',{
            id: data.id
        });
    });

    // -------------------------------------


    client.on('disconnect', () => {
        console.log("Client--"+chalk.red("["+client.id+"]")+"--disconected");

        io.emit('bye',{
            message: 'you are gone man',
            id: client.id
        });

        for(let i=0;i<clients.length;i++){
            if(clients[i].id == client.id){
                clients.splice(i,1);
            }
        }
        console.log("No. Of clients connected--"+chalk.blue("["+clients.length+"]"));
    });
});
// ---------------------------


// STARTING THE SEVER
// -----------------------------------
server.listen(PORT,(error) => {
    if(error){
        console.log(error.message);
    }
    else{
        console.log("Server running on"+chalk.blue(" http://localhost:"+PORT));
    }
}); // -------------------------------