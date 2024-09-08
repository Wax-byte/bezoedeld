//kaart wordt 50 x 50 pt

world = Array()

class Tile { // Tegel
    constructor(arr) { // array [0,1,2,0] is NW niets, NE muur, SE deur, SW niets
        this.arr = arr;
    }
    draw(ctx, x, y) {
        shuffle(this.arr);

        if (this.arr[0] >= 1) {
            ctx.beginPath();
            ctx.moveTo(x * 50 + 25, y * 50 + 25);
            ctx.lineTo(x * 50, y * 50);
            ctx.stroke();
        }
        if (this.arr[0] == 2) {
            ctx.beginPath();
            ctx.arc(x * 50 + 10, y * 50 + 10, 10, 0, 2 * Math.PI);
            ctx.stroke();
        }
        if (this.arr[1] >= 1) {
            ctx.beginPath();
            ctx.moveTo(x * 50 + 25, y * 50 + 25);
            ctx.lineTo(x * 50 + 50, y * 50);
            ctx.stroke();
        }
        if (this.arr[1] == 2) {
            ctx.beginPath();
            ctx.arc(x * 50 + 40, y * 50 + 10, 10, 0, 2 * Math.PI);
            ctx.stroke();
        }
        if (this.arr[2] >= 1) {
            ctx.beginPath();
            ctx.moveTo(x * 50 + 25, y * 50 + 25);
            ctx.lineTo(x * 50 + 50, y * 50 + 50);
            ctx.stroke();
        }
        if (this.arr[2] == 2) {
            ctx.beginPath();
            ctx.arc(x * 50 + 40, y * 50 + 40, 10, 0, 2 * Math.PI);
            ctx.stroke();
        }
        if (this.arr[3] >= 1) {
            ctx.beginPath();
            ctx.moveTo(x * 50 + 25, y * 50 + 25);
            ctx.lineTo(x * 50, y * 50 + 50);
            ctx.stroke();
        }
        if (this.arr[3] == 2) {
            ctx.beginPath();
            ctx.arc(x * 50 + 10, y * 50 + 40, 10, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
}

var mult = 3;
var tiles = [];
for (let i = 0; i < 15 * mult; ++i) {
    tiles.push(new Tile([1,0,1,0]));
}
for (let i = 0; i < 7 * mult; ++i) {
    tiles.push(new Tile([0,0,1,1]));
}
for (let i = 0; i < 5 * mult; ++i) {
    tiles.push(new Tile([0,0,0,0]));
}
for (let i = 0; i < 2 * mult; ++i) {
    tiles.push(new Tile([1,0,2,0]));
}
for (let i = 0; i < 2 * mult; ++i) {
    tiles.push(new Tile([0,0,1,2]));
}
for (let i = 0; i < 2 * mult; ++i) {
    tiles.push(new Tile([0,0,2,1]));
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index from 0 to i
        let j = getRandomInt(i + 1);
        
        // Swap elements array[i] and array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.arr = [];
        for (let x = 0 ; x < width; ++x) {
            for (let y = 0 ; y < height; ++y) {
                this.arr.push(undefined)
            }
        }
    }

    create() {
        for (let x = 0 ; x < this.width; ++x) {
            for (let y = 0 ; y < this.height; ++y) {
                let r = getRandomInt(tiles.length);
                let tile = tiles[r];
                this.arr[x + y*this.width] = tile;
                tiles.splice(r, 1);
                if (tiles.length == 0) return;
            }
        }
    }

    draw(ctx) {
        for (let x = 0 ; x < this.width; ++x) {
            for (let y = 0 ; y < this.height; ++y) {
                let tile = this.arr[x + y*this.width];
                if (tile !== undefined) tile.draw(ctx, x, y);
            }
        }
    }
}

var world = new World(10, 10);
world.create();

//document.getElementById("demo").innerHTML = "Hello JavaScript!";
// Create a Canvas:
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

world.draw(ctx);
