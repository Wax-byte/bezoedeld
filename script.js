//kaart wordt 50 x 50 pt

world = Array()

class Tile { // Tegel
    constructor(arr) { // array [0,1,2,0] is NW niets, NE muur, SE deur, SW niets
        this.arr = arr;
        this.rotation = 0;
    }

    drawSegment(ctx, x, y, px, py) {
        ctx.beginPath();
        ctx.moveTo(x * 50 + 25, y * 50 + 25);
        ctx.lineTo(x * 50 + 25 + px, y * 50 + 25 + py);
        ctx.stroke();
    }

    getSegment(i) {
        return this.arr[(i + this.rotation) % 4];
    }

    draw(ctx, x, y) {
        let rotated = rotateLeft(this.arr, this.rotation);

        if (rotated[0] >= 1) {
            this.drawSegment(ctx, x, y, -25, -25);
        }
        if (rotated[0] == 2) {
            ctx.beginPath();
            ctx.arc(x * 50 + 10, y * 50 + 10, 10, 0, 2 * Math.PI);
            ctx.stroke();
        }
        if (rotated[1] >= 1) {
            this.drawSegment(ctx, x, y, 25, -25);
        }
        if (rotated[1] == 2) {
            ctx.beginPath();
            ctx.arc(x * 50 + 40, y * 50 + 10, 10, 0, 2 * Math.PI);
            ctx.stroke();
        }
        if (rotated[2] >= 1) {
            this.drawSegment(ctx, x, y, 25, 25);
        }
        if (rotated[2] == 2) {
            ctx.beginPath();
            ctx.arc(x * 50 + 40, y * 50 + 40, 10, 0, 2 * Math.PI);
            ctx.stroke();
        }
        if (rotated[3] >= 1) {
            this.drawSegment(ctx, x, y, -25, 25);
        }
        if (rotated[3] == 2) {
            ctx.beginPath();
            ctx.arc(x * 50 + 10, y * 50 + 40, 10, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
}

var mult = 300;
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

function rotateLeft(array, positions) {
  return array.slice(positions).concat(array.slice(0, positions));
}

function rotateLeftInPlace(array, positions) {
    let length = array.length;
    positions = positions % length; // Handle cases where positions > length
    let removed = array.splice(0, positions);
    array.push(...removed);
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

    getTile(x, y) {
        return this.arr[x + y*this.width];
    }
    setTile(x, y, tile) {
        this.arr[x + y*this.width] = tile;
    }

    upperLeftCount(x, y) {
        let count = 0;

        if (this.getTile(x-1, y-1).getSegment(2) >= 1) ++count;
        if (this.getTile(x, y-1).getSegment(3) >= 1) ++count;
        if (this.getTile(x-1, y).getSegment(1) >= 1) ++count;

        return count;        
    }

    // for upper left
    fitScoreNW(x, y, tile) {
        let score = 0;

        if (x > 0 && y > 0) {
            let upperLeftCount= this.upperLeftCount(x, y)

            if (upperLeftCount == 1 && tile.getSegment(0) == 0) return -3; // so guaranteed below 0
            if (upperLeftCount == 0 && tile.getSegment(0) == 1) return -3; // so guaranteed below 0
        }

        if (tile.getSegment(0) >= 1) {
            if (x > 0 && y > 0 && this.getTile(x-1, y-1).getSegment(2) >= 1) ++score;
            else if (y > 0 && this.getTile(x, y-1).getSegment(3) >= 1) ++score;
            else if (x > 0 && this.getTile(x-1, y).getSegment(1) >= 1) ++score;
        }
        return score;
    }

    fitScoreNE(x, y, tile) {
        let score = 0;

        if (tile.getSegment(1) >= 1) {
            if (y > 0 && this.getTile(x, y-1).getSegment(2) >= 1) ++score;
            else if (x < this.width-1 && y > 0 && this.getTile(x+1, y-1).getSegment(2) >= 1) ++score;
        }
        return score;
    }

    fitScoreSW(x, y, tile) {
        let score = 0;

        if (tile.getSegment(3) >= 1) {
            if (x > 0 && this.getTile(x-1, y).getSegment(2) >= 1) ++score;
        }
        return score;
    }

    fitScoreTotal(x, y, tile) {
        return this.fitScoreNW(x, y, tile) + this.fitScoreNE(x, y, tile) + this.fitScoreSW(x, y, tile);
    }

    create() {
        for (let y = 0 ; y < this.height; ++y) {
            for (let x = 0 ; x < this.width; ++x) {        
                shuffle(tiles) // shuffle remaining tiles
                for(let tileIdx = 0; true; ++tileIdx) {
                    let tile = tiles[tileIdx];
                    
                    tile.rotation = getRandomInt(4);

                    let maxScore = -1;
                    let maxRotation = 0;
                    for (let i = 0; i < 4; ++i) {
                        tile.rotation = (tile.rotation + 1) % 4;
                        let score = this.fitScoreTotal(x, y, tile);
                        if (score > maxScore) {
                            maxScore = score;
                            maxRotation = tile.rotation;
                        }
                    }

                    if (maxScore >= 0 || tileIdx == tiles.length-1) {
                        tile.rotation = maxRotation;
                        this.setTile(x, y, tile);
                        tiles.splice(tileIdx, 1);
                        if (tiles.length == 0) return;
                        break;
                    }
                }
            }
        }
    }

    draw(ctx) {
        for (let y = 0 ; y < this.height; ++y) {
            for (let x = 0 ; x < this.width; ++x) {
                let tile = this.getTile(x, y);
                if (tile !== undefined) tile.draw(ctx, x, y);
            }
        }
    }
}

var world = new World(100, 100);
world.create();

//document.getElementById("demo").innerHTML = "Hello JavaScript!";
// Create a Canvas:
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

world.draw(ctx);