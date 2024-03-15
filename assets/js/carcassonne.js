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

        } else if (degree == 180){

            newUp = this.down;
            newDown = this.up;
            newLeft = this.right;
            newRight = this.left;

        } else if (degree == 270){

            newUp = this.right;
            newDown = this.left;
            newLeft = this.up;
            newRight = this.down;

        } else if (degree == 0){

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

    _getKey(x,y) {
        return `(${x},${y})`;
    }

    add(tile, x, y) {
        let isInInitialPosition = x == 0 && y == 0
        let isInMap = this.tiles.has(this._getKey(x,y));
        if (!isInMap && isInInitialPosition) {
            this.tiles.set(this._getKey(x,y), tile);
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

        positions.forEach((position, index) => {
            if (this.tiles.has(position)) {
                let neighbourTile = this.tiles.get(position);

                if (index == UP && tile.up == neighbourTile.down) {
                    isValid = true;
                }

                if (index == DOWN && tile.down == neighbourTile.up) {
                    isValid = true;
                }

                if (index == LEFT && tile.left == neighbourTile.right) {
                    isValid = true;
                }

                if (index == RIGHT && tile.right == neighbourTile.left) {
                    isValid = true;
                }
            }
        });

        if (isValid) {
            this.tiles.set(this._getKey(x,y), tile);
        }
        return isValid;
    }

    size() {
        return this.tiles.size;
    }

    get(x,y) {
        return this.tiles.get(this._getKey(x,y));
    }
}