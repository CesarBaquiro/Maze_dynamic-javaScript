/**
 *Realizado con base en las instrucciones de Maze Generator en wikipedia
 */

let width = 5; //Ancho del laberinto
let height = 5; //Altura del laberinto
let zoom = 60; //Tamano de las celdas

// let num = prompt("Ingrese un numero");
// let numero = parseInt(num);
// console.log(typeof numero);

let canvas = document.createElement("canvas");
canvas.setAttribute("width", width * zoom); //Ancho del laberinto
canvas.setAttribute("height", height * zoom); //Alto del laberinto
canvas.style.border = "1px dashed black";
document.body.appendChild(canvas);
let ctx = canvas.getContext("2d");

/*-----------------Funcion para pintar lineas en el canvas------------------ */
function paintLine(x1, y1, x2, y2) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

let c = zoom; // c = Cell
let columns = canvas.width / c;
let rows = canvas.height / c;

function index(x, y) {
  if (x < 0 || y < 0 || x > columns - 1 || y > rows - 1) {
    return -1;
  }
  return x * rows + y;
}

function index(x, y) {
  if (x < 0 || y < 0 || x > columns - 1 || y > rows - 1) {
    return -1;
  }
  return x * rows + y;
}

/*-----------------Classe celda la cual construye y dibuja las celdas------------------ */

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.corners = [
      { x: x * c, y: y * c }, //Esquina superior izquierda
      { x: x * c + c, y: y * c }, //Esquina superior derecha
      { x: x * c + c, y: y * c + c }, //Esquina inferior derecha
      { x: x * c, y: y * c + c }, //Esquina inferior izquierda
      { x: x * c, y: y * c }, //Punto inicial del cuadrado
    ];
    //Walls order = top, right, bottom, left
    this.walls = [true, true, true, true]; //Variable para saber si la pared se va a dibujar
    this.visited = false; //Aca marcamos las celdas como visitadas
  }
  render() {
    for (let i = 0; i < 3; i++) {
      if (this.walls[i]) {
        paintLine(
          //Aca definimos el origen
          this.corners[i].x,
          this.corners[i].y,
          //Aca definimos el destino
          this.corners[i + 1].x,
          this.corners[i + 1].y
        );
      }
    }

    /**Con esta parte podemos ver las celdas visitadas*/
    // if (this.visited) {
    //   ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
    //   ctx.fillRect(this.x * c, this.y * c, c, c);
    // }
  }

  /*-----------------Funcion para visitar un vecino------------------ */
  checkNeighbors() {
    //Aca vamos a comprobar si la celda vecina fue visitada
    let x = this.x;
    let y = this.y;
    let posNeighbors = [
      { x: x, y: y - 1 },
      { x: x + 1, y: y },
      { x: x, y: y + 1 },
      { x: x - 1, y: y },
    ];
    let neighbors = [];
    for (let i = 0; i < 4; i++) {
      let neighborUnderTest =
        cells[index(posNeighbors[i].x, posNeighbors[i].y)]; //Variable para comprobar la pocision
      if (
        neighborUnderTest && //Si la posicion existe
        !neighborUnderTest.visited //Y si la posicion NO a sido visitada
      ) {
        neighbors.push(neighborUnderTest); //Aca almacenamos a nuestros vecinos
      }
    }
    if (neighbors.length > 0) {
      let r = Math.floor(Math.random() * neighbors.length); //Aca seleccionamos un vecino aleatoriamente
      return neighbors[r];
    }
    return undefined;
  }

  /*----------Con esta parte podemos visualizar el recorrido-------- */
  // ligtht() {
  //   //Coloreamos la celda actual
  //   ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
  //   ctx.fillRect(this.x * c, this.y * c, c, c);
  // }
}

/*-----------------Funcion para remover las paredes------------------ */

function removeWall(currentCell, chosenCell) {
  // lr = left and right
  let lr = currentCell.x - chosenCell.x;
  if (lr === -1) {
    //Linea derecha
    currentCell.walls[1] = false; //Removemos la linea derecha de la actual
    chosenCell.walls[3] = false; //Removemos la linea izquierda de la escogida
  } else if (lr === 1) {
    //Linea izquierda
    currentCell.walls[3] = false; //Removemos la linea izquierda de la actual
    chosenCell.walls[1] = false; //Removemos la linea derecha de la escogida
  }
  // tb = top and bottom
  let tb = currentCell.y - chosenCell.y;
  if (tb === -1) {
    //Linea inferior
    currentCell.walls[2] = false; //Removemos la linea inferior de la actual
    chosenCell.walls[0] = false; //Removemos la linea superior de la escogida
  } else if (tb === 1) {
    //Linea superior
    currentCell.walls[0] = false; //Removemos la linea superior de la actual
    chosenCell.walls[2] = false; //Removemos la linea inferior de la escogida
  }
}

let cells = []; //Arreglo de celdas

for (let i = 0; i < columns; i++) {
  for (let j = 0; j < rows; j++) {
    let cell = new Cell(i, j); //Creamos una celda
    cells.push(cell);
  }
}

let current = cells[0];
let stack = [];
current.visited = true;
stack.push(current);

/*-------------Funcion para recorrer sobre todo el canvas---------------- */

function maze() {
  if (stack.length > 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    current = stack.pop();
    newCurrent = current.checkNeighbors();
    if (newCurrent) {
      //newCurrent.ligtht(); //Pintamos la celda en la que estamos actualmente -Solo para comprobar visualmente-
      stack.push(current); //Anadir la celda actual al stack
      removeWall(current, newCurrent); //Remover pared
      newCurrent.visited = true; //Se marca la celda escogida como visitada
      stack.push(newCurrent); //Y se anade la celda al stack
    }
  } else {
    //current.ligtht(); //Solo se usa para visualizar
  }

  for (let i = 0; i < cells.length; i++) {
    cells[i].render(); //Aca renderizamos todas nuestras celdas
  }
}

setInterval(maze, 50);
