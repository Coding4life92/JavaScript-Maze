let maze = document.querySelector('.maze');
let ctx = maze.getContext('2d');

let current;

class Maze {
    constructor(size, rows, columns) {
        this.size = size;
        this.rows = rows;
        this.columns = columns;
        this.grid = [];
        this.stack = [];
    }

    setup() {
        for (let r = 0; r < this.rows; r++) {
            let rows = [];
            for (let c = 0; c < this.columns; c++) {
                let cell = new Cell(r, c, this.grid, this.size);
                rows.push(cell);
            }
            this.grid.push(rows);
        }
        current = this.grid[0][0];
    }

    draw() {
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = 'black';
        current.visited = true;

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                let grid = this.grid;
                grid[r][c].show(this.size, this.rows, this.columns);
            }
        }
        let next = current.checkNeighbors();

        if (next) {
            next.visited = true;

            this.stack.push(current);

            current.highlight(this.columns);

            current.removeWalls(current, next);

            current = next;
        } else if (this.stack.length > 0) {
            let cell = this.stack.pop();
            current = cell;
            current.highlight(this.columns);
        }

        if (this.stack.length == 0) {
            return;
        }

        window.requestAnimationFrame(() => {
            this.draw();
        })
    }
}

class Cell {
    constructor(rowNum, colNum, parentGrid, parentSize) {
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.parentGrid = parentGrid;
        this.parentSize = parentSize;
        this.visited = false;
        this.walls = {
            topWall: true,
            rightWall: true,
            bottomWall: true,
            leftWall: true
        };
    }

    checkNeighbors() {
        let grid = this.parentGrid;
        let row = this.rowNum;
        let col = this.colNum;
        let neighbors = [];

        let top = row !== 0 ? grid[row - 1][col] : undefined;
        let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
        let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
        let left = col !== 0 ? grid[row][col - 1] : undefined;

        if (top && !top.visited) neighbors.push(top);
        if (right && !right.visited) neighbors.push(right);
        if (bottom && !bottom.visited) neighbors.push(bottom);
        if (left && !left.visited) neighbors.push(left);

        if (neighbors.length !== 0) {
            let random = Math.floor(Math.random() * neighbors.length);
            return neighbors[random];
        } else {
            return undefined;
        }
    }

    drawTopWall(x, y, size, columns, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size / columns, y);
        ctx.stroke();
    }

    drawRightWall(x, y, size, columns, rows) {
        ctx.beginPath();
        ctx.moveTo(x + size / columns, y );
        ctx.lineTo(x + size / columns, y + size / rows);
        ctx.stroke();
    }

    drawBottomWall(x, y, size, columns, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y + size / rows);
        ctx.lineTo(x + size / columns, y + size / rows);
        ctx.stroke();
    }

    drawLeftWall(x, y, size, columns, rows) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + size / rows);
        ctx.stroke();
    }

    highlight(columns) {
        let x = (this.colNum * this.parentSize) / columns + 1;
        let y = (this.rowNum * this.parentSize) / columns + 1;

        ctx.fillStyle = 'purple';
        ctx.fillRect(x, y, this.parentSize / columns - 3, this.parentSize / columns - 3);
    }

    removeWalls(cell1, cell2) {
        let x = (cell1.colNum - cell2.colNum);
        
        if (x == 1) {
            cell1.walls.leftWall = false;
            cell2.walls.rightWall = false;
        } else if (x == -1) {
            cell1.walls.rightWall = false;
            cell2.walls.leftWall = false;
        }

        let y = cell1.rowNum - cell2.rowNum;

        if (y == 1) {
            cell1.walls.topWall = false;
            cell2.walls.bottomWall = false;
        } else if (y == -1) {
            cell1.walls.bottomWall = false;
            cell2.walls.topWall = false;
        }
    }

    show(size, rows, columns) {
        let x = (this.colNum * size) / columns;
        let y = (this.rowNum * size) / rows;

        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'black';
        ctx.lineWidth = 2;

        if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows);
        if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);
        if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows);
        if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows);
        if (this.visited) {
            ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
        }
    }
}

let newMaze = new Maze(500, 25, 25);
newMaze.setup();
newMaze.draw();