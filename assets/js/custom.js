const ROAD = "road";
const CITY = "city";
const GRASS = "grass";
const NORTH = "north";

class Tile {
    //          n
    //          ^
    //          |
    // w <-   Tile   -> e
    //          |
    //          s
    constructor(west, east, north, south, image, turn = 0) {
        this.west = west;
        this.east = east;
        this.north = north;
        this.south = south;
        this.image = image;
        // Turn significa el numero de rotaciones de la loseta
        this.turn = turn;
    }

    // The rotation is to the right
    rotate() {
        const temp = this.west;

        let west = this.south;
        let south = this.east;
        let east = this.north;
        let north = temp;

        return new Tile(west, east, north, south, this.image, this.turn + 1);
    }


    toString() {
        return JSON.stringify({
            west: this.west,
            east: this.east,
            north: this.north,
            south: this.south
        });
    }
}

class Map {
    constructor() {
        this.graph = {}
    }

    add(tile, x, y) {

        let position = `(${x}, ${y})`;
        console.log(`insertando el title en la posicion ${position}`);

        // Tile inicial
        if (x == 0 && y == 0) {
            this.graph[position] = tile;
            return;
        }

        console.log(this.graph);

        let left = `(${x-1}, ${y})`;
        let right = `(${x+1}, ${y})`;
        let up = `(${x}, ${y + 1})`;
        let down = `(${x}, ${y - 1})`;

        let keys = Object.keys(this.graph);
        console.log(keys);

        if(keys.includes(left)){
            console.log("existe a la izquierda");

            let neighbourTile = this.graph[left];
            console.log(neighbourTile);
            console.log(tile);

            if (tile.east == neighbourTile.west) {
                this.graph[position] = tile;
                console.log(`Agregando tile en la posicion ${position}`);
            } else {
                console.log(`No se pudo agregar el tile en la posicion ${position}`);
            }

            console.log(tile.south, neighbourTile.north);
        }

        if(keys.includes(right)){
            console.log("existe a la derecha");

            let neighbourTile = this.graph[right];
            console.log(neighbourTile);
            console.log(tile);

            if (tile.east == neighbourTile.west) {
                this.graph[position] = tile;
                console.log(`Agregando tile en la posicion ${position}`);
            } else {
                console.log(`No se pudo agregar el tile en la posicion ${position}`);
            }

            console.log(tile.south, neighbourTile.north);
        }

        if(keys.includes(up)){
            console.log("existe a la arriba");

            let neighbourTile = this.graph[up];
            console.log("Vecino", neighbourTile);
            console.log("Tile", tile);

            if (tile.north == neighbourTile.south) {
                this.graph[position] = tile;
                console.log(`Agregando tile en la posicion ${position}`);
            } else {
                console.log(`No se pudo agregar el tile en la posicion ${position}`);
            }

            console.log(tile.south, neighbourTile.north);
        }

        if(keys.includes(down)){
            console.log("existe a la abajo");
            let neighbourTile = this.graph[down];
            console.log(neighbourTile);
            console.log(tile);

            if (tile.south == neighbourTile.north) {
                this.graph[position] = tile;
                console.log(`Agregando tile en la posicion ${position}`);
            } else {
                console.log(`No se pudo agregar el tile en la posicion ${position}`);
            }

            console.log(tile.south, neighbourTile.north);
        }

        
        // this.graph[position] = tile;
        
    }
}

const d = new Tile(ROAD, ROAD, CITY, GRASS, null);
const k = new Tile(ROAD, GRASS, CITY, ROAD, null);
const x = new Tile(ROAD, ROAD, GRASS, GRASS, null);
console.log(k.toString());

kRotated = k.rotate();
console.log("Después de la rotación:");
console.log(kRotated.toString());

map = new Map();
map.add(d, 0,0);
// map.add(x, 0,1);
// map.add(x, 1,0);
// map.add(x, -1,0);
// map.add(x, -1,0);
map.add(x, 0,-1);



const btnRotateTile = document.getElementById("rotate-tile");
const titleImg = document.getElementById("tile-img");
let rotation = 0;

function rotateTile() {
    rotation += 90;
    titleImg.style.transform = `rotate(${rotation}deg)`;
    console.log("entro");
}

btnRotateTile.addEventListener("clicd", function() {
    rotateTile();
});

