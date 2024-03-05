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
    constructor(west, east, north, south, image, name = '', turn = 0) {
        this.west = west;
        this.east = east;
        this.north = north;
        this.south = south;
        this.image = image;
        this.name = name;
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

    printTile() {
       let template =`
                    ${this.north}
                    ^
                    |
        ${this.west} <-   Tile ${this.name}   -> ${this.east}
                    |
                    ${this.south}
        `;
        console.log(template);
    }

    printBoard(tile2) {
        let template =`
                    ${this.north}                                              ${tile2.north}        
                    ^                                                       ^                                                   
                    |                                                       |                                          
        ${this.west} <-   Tile ${this.name}   -> ${this.east}    ******                ${tile2.west} <-   Tile ${tile2.name}   -> ${tile2.east}                               
                    |                                                         |
                    ${this.south}                                               ${tile2.south}
        `;
        console.log(template);
    }
}

class Map {
    constructor() {
        this.graph = {}
    }

    add(tile, x, y) {
        let isValid = true;
        let position = `(${x}, ${y})`;
        // console.log(`insertando el title en la posicion ${position}`);

        // Tile inicial
        if (x == 0 && y == 0) {
            this.graph[position] = tile;
            return;
        }

        console.log("========================");
        console.log(this.graph);

        let left = `(${x-1}, ${y})`;
        let right = `(${x+1}, ${y})`;
        let up = `(${x}, ${y + 1})`;
        let down = `(${x}, ${y - 1})`;

        let keys = Object.keys(this.graph);
        console.log(keys);

        if (keys.includes(position)) {
            console.log(`Ya existe un tile en esta posicion ${position}`);
            return;
        }

        if(keys.includes(left)){
            console.log("existe a la izquierda");

            let neighbourTile = this.graph[left];
            console.log(neighbourTile);
            console.log(tile);

            if (tile.west == neighbourTile.east) {
                // this.graph[position] = tile;

                console.log(`Agregando tile en la posicion ${position}`);
            } else {
                isValid = false;
                console.log(`No se pudo agregar el tile en la posicion ${position}`);
            }

            console.log(tile.south, neighbourTile.north);
        }

        if(keys.includes(right)){
            console.log("**************************");
            console.log("existe a la derecha");

            let neighbourTile = this.graph[right];
            console.log("Vecino", neighbourTile);
            console.log(neighbourTile.printTile())
            console.log("Tile", tile);
            console.log(tile.printBoard(neighbourTile))

            console.log("Nuevo", tile.east);
            console.log("Vecino", neighbourTile.west);
            if (tile.east == neighbourTile.west) {
                // this.graph[position] = tile;
                console.log(`Agregando tile en la posicion ${position}`);
            } else {
                isValid = false;
                console.log(`No se pudo agregar el tile en la posicion ${position}`);
            }

            console.log(tile.south, neighbourTile.north);
            console.log("**************************");
        }

        if(keys.includes(up)){
            console.log("existe a la arriba");

            let neighbourTile = this.graph[up];
            console.log("Vecino", neighbourTile);
            console.log("Tile", tile);

            if (tile.north == neighbourTile.south) {
                // this.graph[position] = tile;
                console.log(`Agregando tile en la posicion ${position}`);
            } else {
                isValid = false;
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
                // this.graph[position] = tile;
                console.log(`Agregando tile en la posicion ${position}`);
            } else {
                isValid = false;
                console.log(`No se pudo agregar el tile en la posicion ${position}`);
            }

            console.log(tile.south, neighbourTile.north);
        }

        if (isValid) {
            this.graph[position] = tile;
        }
        
    }
}

const w0 = new Tile(ROAD, ROAD, CITY, GRASS, null, "w0");
// const k = new Tile(ROAD, GRASS, CITY, ROAD, null, "w0");
const w1 = new Tile(ROAD, ROAD, GRASS, GRASS, null, "w1");
const w2 = new Tile(ROAD, CITY, ROAD, CITY, null, "w2");
const w3 = new Tile(ROAD, ROAD, GRASS, ROAD, null, "w3");
const w4 = new Tile(CITY, ROAD, ROAD, CITY, null, "w4");
const w5 = new Tile(CITY, GRASS, CITY, GRASS, null, "w5");
// console.log(k.toString());

// kRotated = k.rotate();
// console.log("Después de la rotación:");
// console.log(kRotated.toString());

map = new Map();
map.add(w0, 0,0);
// map.add(x, 0,1);
// map.add(x, 1,0);
// map.add(x, -1,0);
// map.add(x, -1,0);
map.add(w1, 1,0);
// map.add(y, -1,0);
// map.add(y, 0,-1);
// map.add(y, 1,-1);
map.add(w2, 0,1);
map.add(w3, -1,0);
map.add(w4, -2,0)
map.add(w5, 1,1)
// map.add(z, 1,1);
// map.add(z, 2,0);
// map.add(z, 1,-1);

// w0.printTile("d -> 0,0");
// w1.printTile("x -> 1,0");
// w2.printTile();
// w3.printTile("z -> -1,0");
// w4.printTile("z -> -2,0");
// w5.printTile();





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

