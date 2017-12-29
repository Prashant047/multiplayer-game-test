export const mario = {
    indexPosition: {
        x: 100,
        y: 100
    },
    pixelSize: 10,
    pixelMap: [
        [0,0,0,1,1,1,1,1,1,0,0,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,0],
        [0,0,2,2,2,3,3,3,4,2,0,0,0],
        [0,2,3,2,3,3,3,3,4,3,3,3,0],
        [0,2,3,2,2,3,3,3,3,4,3,3,3],
        [0,2,2,3,3,3,3,3,4,4,4,4,0],
        [0,0,0,3,3,3,3,3,3,3,3,0,0],
        [0,0,1,1,5,1,1,1,1,0,0,0,0],
        [0,1,1,1,5,1,1,5,1,1,1,0,0],
        [1,1,1,1,5,5,5,5,1,1,1,1,0],
        [3,3,1,5,6,5,5,6,5,1,3,3,0],
        [3,3,3,5,5,5,5,5,5,3,3,3,0],
        [3,3,5,5,5,5,5,5,5,5,3,3,0],
        [0,0,5,5,5,0,0,5,5,5,0,0,0],
        [0,2,2,2,0,0,0,0,2,2,2,0,0],
        [2,2,2,2,0,0,0,0,2,2,2,2,0]
    ],
    colorMap: ['#FC0D1B','#964815','#F9C093','#000000','#1072BD','#FFFD38'],

    draw(ctx){
        let x = this.indexPosition.x-this.pixelSize;
        let y = this.indexPosition.y-this.pixelSize;

        this.pixelMap.forEach((row) => {
            y += this.pixelSize;

            row.forEach((col) => {
                x += this.pixelSize;
                if(col != 0){
                    ctx.fillStyle = this.colorMap[col-1];
                    ctx.fillRect(x,y,this.pixelSize,this.pixelSize);
                }
            });

            x = this.indexPosition.x-this.pixelSize;
        });
    }

};