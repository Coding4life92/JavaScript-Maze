const canvas = document.querySelector('.maze');
const ctx = canvas.getContext('2d');

class Maze {
    constructor(size, rows, columns) {
        this.size = size;
        this.rows = rows;
        this.columns = columns;
        this.grid = [];
        this.stack = [];
        //this.canvas = document.querySelector('.maze');
        //this.context = this.canvas.getContext('2d');
        this.currentCell;
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
        this.currentCell = this.grid[0][0];
    }

    draw() {
        canvas.width = this.size;
        canvas.height = this.size;
        canvas.style.background = 'black';
        this.currentCell.visited = true;

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                let cell = this.grid[r][c];
                cell.show(this.size, this.rows, this.columns);
            }
        }

        let nextCell = this.currentCell.checkNeighbors();

        if (nextCell) {
            nextCell.visited = true;
            this.stack.push(this.currentCell);
            this.currentCell.highlight(this.columns);
            this.currentCell.removeWalls(this.currentCell, nextCell);
            this.currentCell = nextCell;
        } else if (this.stack.length > 0) {
            let cell = this.stack.pop();
            this.currentCell = cell;
            this.currentCell.highlight(this.columns);
        }

        if (this.stack.length > 0) {
            window.requestAnimationFrame(() => {
                this.draw();
            });
        }
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
            top: true,
            right: true,
            bottom: true,
            left: true
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

    drawWall(x1, y1, x2, y2) {
        //let ctx = this.parentGrid.context;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    highlight(columns) {
        let x = (this.colNum * this.parentSize) / columns + 1;
        let y = (this.rowNum * this.parentSize) / columns + 1;
        ctx.fillStyle = 'purple';
        ctx.fillRect(x, y, this.parentSize / columns - 3, this.parentSize / columns - 3);
    }

    removeWalls(cell1, cell2) {
        let x = cell1.colNum - cell2.colNum;
        let y = cell1.rowNum - cell2.rowNum;
        
        if (x == 1) {
            cell1.walls.left = false;
            cell2.walls.right = false;
        } else if (x == -1) {
            cell1.walls.right = false;
            cell2.walls.left = false;
        }

        if (y == 1) {
            cell1.walls.top = false;
            cell2.walls.bottom = false;
        } else if (y == -1) {
            cell1.walls.bottom = false;
            cell2.walls.top = false;
        }
    }

    show(size, rows, columns) {
        let x = (this.colNum * size) / columns;
        let y = (this.rowNum * size) / rows;
        //let ctx = this.parentGrid.context;

        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'black';
        ctx.lineWidth = 2;

        if (this.walls.top) this.drawWall(x, y, x + size / columns, y);
        if (this.walls.right) this.drawWall(x + size / columns, y, x + size / columns, y + size / rows);
        if (this.walls.bottom) this.drawWall(x, y + size / rows, x + size / columns, y + size / rows);
        if (this.walls.left) this.drawWall(x, y, x, y + size / rows);
        if (this.visited) {
            ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
        }
    }
}

let newMaze = new Maze(500, 25, 25);
newMaze.setup();
newMaze.draw();