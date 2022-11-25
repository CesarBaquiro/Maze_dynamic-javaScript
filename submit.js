const container_form = document.getElementById("container-form");

container_form.innerHTML = ` <div class="container-form">
        <form action="" name="form" id="form-sizes" method="get">
            <h2>Ingrese el alto</h2>
            <input type="number" id="heigth-maze" required>
            <h2>Ingrese el ancho</h2>
            <input type="number" id="width-maze" required>
            <button type="submit" id="btn">Calcular</button>
    </div>
`;

var heigthMaze = document.getElementById("heigth-maze");
console.log(heigthMaze);

var formulario = document.form.elements,
    altura = document.form.elements[0].value,
    ancho = document.form.elements[1].value,
    btnEnviar = document.form.elements[2].value;
console.log(form);
console.log(altura);
console.log(ancho);
console.log(btnEnviar);
