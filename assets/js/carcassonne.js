const ROAD = "road";
const CITY = "city";
const GRASS = "grass";
const NORTH = "north";


class Tile {
    //          up
    //          ^
    //          |
    // left <- Tile -> right
    //          |
    //         down
    constructor(up, down, left, right, image) {
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;

        this.image = image;
    }

    rotate(degree = 90) {

        let newUp;
        let newDown;
        let newLeft;
        let newRight;

        degree = degree % 360;

        if (degree == 90) {

            newUp = this.left;
            newDown = this.right;
            newLeft = this.down;
            newRight = this.up;

        } else if (degree == 180) {

            newUp = this.down;
            newDown = this.up;
            newLeft = this.right;
            newRight = this.left;

        } else if (degree == 270) {

            newUp = this.right;
            newDown = this.left;
            newLeft = this.up;
            newRight = this.down;

        } else if (degree == 0) {

            newUp = this.up;
            newDown = this.down;
            newLeft = this.left;
            newRight = this.right;

        }

        return new Tile(newUp, newDown, newLeft, newRight, this.image);
    }
}

class CarcassonneMap {
    constructor() {
        this.tiles = new Map();
    }

    _getKey(x, y) {
        return `(${x},${y})`;
    }

    add(tile, x, y) {
        let isInInitialPosition = x == 0 && y == 0
        let isInMap = this.tiles.has(this._getKey(x, y));
        if (!isInMap && isInInitialPosition) {
            this.tiles.set(this._getKey(x, y), tile);
            return true;
        }

        let isValid = false;

        let positions = [
            this._getKey(x, y + 1), //up
            this._getKey(x, y - 1), //down
            this._getKey(x - 1, y), //left
            this._getKey(x + 1, y), //right
        ];

        const UP = 0;
        const DOWN = 1;
        const LEFT = 2;
        const RIGHT = 3;

        let counter = 0;
        let validCounter = 0;

        positions.forEach((position, index) => {
            if (this.tiles.has(position)) {
                counter++;
                let neighbourTile = this.tiles.get(position);

                if (index == UP && tile.up == neighbourTile.down) {
                    isValid = true;
                    validCounter++;
                }

                if (index == DOWN && tile.down == neighbourTile.up) {
                    isValid = true;
                    validCounter++;
                }

                if (index == LEFT && tile.left == neighbourTile.right) {
                    isValid = true;
                    validCounter++;
                }

                if (index == RIGHT && tile.right == neighbourTile.left) {
                    isValid = true;
                    validCounter++;
                }
            }
        });

        if (counter != 0 && validCounter == counter) {
            this.tiles.set(this._getKey(x, y), tile);
            return true;
        }

        return false;
    }

    size() {
        return this.tiles.size;
    }

    get(x, y) {
        return this.tiles.get(this._getKey(x, y));
    }

    _getXYFromString(position) {
        position = position.split(',');
        return position.map((value) => parseInt(value.replace('(', '').replace(')', '').trim()));
    };

    getFrontier() {
        let frontier = new Set();
        let directions = [[-1,0],[1,0],[0,1],[0,-1]]; 
        // (1, 1), (-1, 1)
        let keys = this.tiles.keys();

        keys.forEach(key => {
            let xy = this._getXYFromString(key);
            directions.forEach(direction => {
                // si direction[0] + x, direction[1] + y en Set no se agrega de lo contrario se agrega
                let _key = this._getKey(direction[0] + xy[0], direction[1] + xy[1]);
                if (!this.tiles.has(_key)) {
                    frontier.add(_key);
                }
                // createGrid(direction[0] + x, direction[1] + y);
            });
        })

        return frontier;
    }
}

var GameApp = GameApp || {}
GameApp.settings = {
    INITIAL_TILE : new Tile(CITY, GRASS, ROAD, ROAD, 'assets/img/loseta-0.jpeg'),
    TILE_IMG: document.getElementById("tile-img"),
    BTN_ROTATE_TILE: document.getElementById("rotate-tile"),
    BTN_PLACE_TILE: document.getElementById('place-tile'),
    GRID_CONTAINER: document.getElementById("grid-container"),
}
GameApp.buildDynamicGrid = function() {
    GameApp.createGrid(0, 0);
};

GameApp.createGrid = function(x, y) {
    console.log("Lamando x,y", x, y);
    const grid = document.createElement('div');
        
    grid.dataset.x = x;
    grid.dataset.y = y;
    grid.setAttribute("id", `place_${x}x${y}y`);
    
    grid.classList.add('grid-item');
    grid.style.left = `${200 * x}px`;
    grid.style.top = `${-200 * y}px`;

    if (x == 0 && y == 0) {
        // <div class="grid-item block-item" id="place_0x0y" data-x="0" data-y="0"><img src="assets/img/loseta-0.jpeg" alt=""></div>
        grid.classList.add("block-item");
        const img = document.createElement('img');
        img.src = GameApp.deck[0].image;
        grid.appendChild(img);
    }
    
    // grid.innerHTML = `(${x},${y})`;
    GameApp.settings.GRID_CONTAINER.appendChild(grid);
}

GameApp.createDeck = function() {
    let tile0 = new Tile(CITY, GRASS, ROAD, ROAD, 'assets/img/loseta-0.jpeg');
    let tile1 = new Tile(GRASS, GRASS, ROAD, ROAD, 'assets/img/loseta-1.jpeg');
    let tile2 = new Tile(ROAD, CITY, ROAD, CITY, 'assets/img/loseta-2.jpeg');
    let tile3 = new Tile(GRASS, ROAD, ROAD, ROAD, 'assets/img/loseta-3.jpeg');
    let tile4 = new Tile(ROAD, CITY, CITY, ROAD, 'assets/img/loseta-4.jpeg');

    let tiles = [
        tile1,
        tile2,
        tile3,
        tile4,
        tile1,
        tile2,
        tile3,
        tile4,
        tile0,
    ]

    tiles = _.shuffle(tiles)

    return [tile0].concat(tiles)
}

GameApp.bindEvents = function() {
    GameApp.settings.BTN_ROTATE_TILE.addEventListener(
        "click", function() {
        GameApp.rotateTile();
    });

    GameApp.settings.GRID_CONTAINER.addEventListener("click", function(e) {

        let gridItems = document.querySelectorAll(".grid-item:not(.block-item)");
        // let tileInPlace = document.querySelectorAll(".current");

        if (e.target.classList.contains("grid-item")) {
            gridItems.forEach(element => {
                // Limpiando el tile
                element.style.backgroundColor = '#ccc';
                element.innerHTML = '';
            })
    
            // console.log(e.target);
            const img = document.createElement('img');
            img.src = GameApp.settings.TILE_IMG.src;
            let rotation = GameApp.settings.TILE_IMG.dataset.rotation;
            img.style.transform = `rotate(${rotation}deg)`;
            img.classList.add("current");
            e.target.appendChild(img);
            // console.log("Posicion x, y",e.target.dataset.x, e.target.dataset.y)
            GameApp.currentPositionX = e.target.dataset.x;
            GameApp.currentPositionY = e.target.dataset.y;
        }

        if (e.target.classList.contains("current")) {
            console.log("clickeando current");
            GameApp.rotateTile();
            let currentRotation = GameApp.ui.getCurrentTileRotation();
            GameApp.ui.rotateImg(e.target, currentRotation);
        }

    });

    GameApp.settings.BTN_PLACE_TILE.addEventListener(
        "click", function() {
        // console.log("colocar");
        // console.log('**************************');
        // console.log(GameApp.tileIndex);
        // console.log(GameApp.deck[GameApp.tileIndex]);
        // console.log(GameApp.map);
        // console.log(GameApp.currentPositionX);
        // console.log(GameApp.currentPositionY);
        // console.log('**************************');

        let isPositionSet = GameApp.currentPositionX !== null && GameApp.currentPositionY !== null
    
        if (!isPositionSet) {
            alert("No hay posicion");
            return;
        }
        // console.log("===========Agregar Mapa==============");
        // console.log(map.add(tileDeck[tileIndex], parseInt(currentTilePositionX),parseInt(currentTilePositionY)))
        // console.log("===========Agregar Mapa=========");
        // tileDeck[tileIndex].printTile();
        // console.log(map.graph);
    
        let isValid = GameApp.map.add(
            GameApp.deck[GameApp.tileIndex], 
            parseInt(GameApp.currentPositionX),
            parseInt(GameApp.currentPositionY)
        );
    
        if (isValid) {
            const place = document.getElementById(`place_${GameApp.currentPositionX}x${GameApp.currentPositionY}y`);
            place.classList.add("block-item");
            const img = document.createElement('img');
            img.src = GameApp.deck[GameApp.tileIndex].image;
            let currentRotation = GameApp.ui.getCurrentTileRotation();
            GameApp.ui.rotateImg(img, currentRotation);
            place.innerHTML = '';
            place.append(img);
            GameApp.tileIndex++;
            // console.log("Place", place);
            // console.log("Inidice:", tileIndex);
            // console.log("Deck length:", tileDeck.length);
        } else {
            // console.log(GameApp.deck[GameApp.tileIndex]);
            alert("No se puede poner la loseta en esta posicion");
            return;
        }
    
        // TODO: Quitar el boton cuando no haya mas losetas
        if (GameApp.tileIndex < GameApp.deck.length) {
            GameApp.settings.TILE_IMG.src = GameApp.deck[GameApp.tileIndex].image;
            GameApp.settings.TILE_IMG.style.transform = '';
            GameApp.settings.TILE_IMG.dataset.rotation = '';
            // TODO: Calcular frontera
            let frontier = GameApp.map.getFrontier();
            // console.log('Frontier:', frontier);
            frontier.forEach(position => {
                // let gridExists = document.getElementById(`place_${position[0]}x${position[1]}y`) != null;
                // console.log(gridExists); 
                // TODO: No se deberia recrear el grid cuando esta creado
                let isInSet = GameApp.gridItemsSet.has(`(${position[0]}, ${position[1]})`);
                if (!isInSet) {
                    GameApp.createGrid(position[0], position[1]);
                    GameApp.gridItemsSet.add(`(${position[0]}, ${position[1]})`);
                }
            })
        } else {
            alert("No hay mas loseta");
        }
        
    });
};

GameApp.rotateTile = function() {
    console.log("Antes de rotar", GameApp.deck[GameApp.tileIndex]);
    GameApp.deck[GameApp.tileIndex] = GameApp.deck[GameApp.tileIndex].rotate();
    console.log("despues de rotar", GameApp.deck[GameApp.tileIndex]);

    let currentRotation = GameApp.ui.getCurrentTileRotation();
    currentRotation += 90;

    GameApp.ui.rotateImg(GameApp.settings.TILE_IMG, currentRotation);
};

GameApp.ui = {};

GameApp.ui.rotateImg = function(domElement, rotation) {
    if (rotation != undefined) {
        domElement.style.transform = `rotate(${rotation}deg)`;
        domElement.dataset.rotation = rotation;
    }
}

GameApp.ui.getCurrentTileRotation = function() {
    let currentRotation = GameApp.settings.TILE_IMG.dataset.rotation;

    if (currentRotation == undefined || currentRotation == '') {
        currentRotation = 0;
    }

    currentRotation = parseInt(currentRotation);

     return currentRotation;
};

GameApp.init = function() {
    GameApp.tileIndex = 0;
    GameApp.currentPositionX = null;
    GameApp.currentPositionY = null;

    GameApp.map = new CarcassonneMap();
    GameApp.gridItemsSet = new Set();
    GameApp.deck = GameApp.createDeck();

    GameApp.map.add(GameApp.deck[GameApp.tileIndex], 0, 0);
    GameApp.gridItemsSet.add('(0, 0)');
    let frontier = GameApp.map.getFrontier();
    // console.log(frontier);
    frontier.forEach(position => {
        GameApp.createGrid(position[0], position[1])
        GameApp.gridItemsSet.add(`(${position[0]}, ${position[1]})`);
    })
    GameApp.tileIndex++;
    GameApp.settings.TILE_IMG.src = GameApp.deck[GameApp.tileIndex].image;

    GameApp.buildDynamicGrid();
    GameApp.bindEvents();
}

GameApp.init();