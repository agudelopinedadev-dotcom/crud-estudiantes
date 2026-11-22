
let formulario = document.getElementById("formulario");
let nombre = document.getElementById("nombre");
let correo = document.getElementById("correo");
let edad = document.getElementById("edad");
let errorNombre = document.getElementById("errorNombre");
let errorCorreo = document.getElementById("errorCorreo");
let errorEdad = document.getElementById("errorEdad");

let tabla = document.getElementById("tablaEstudiantes");
let btnGuardar = document.getElementById("btnGuardar");

let listaEstudiantes = [];
//--------------------- Variable para controlar la edicion.
let indiceEditar = -1;

////// Validar Nombre
function validarNombre(){
    let nombreEst = nombre.value.trim();

    if (nombreEst === ""){
        errorNombre.textContent = "Escriba el nombre del estudiante.";
        return false;
    }
    else if (nombreEst.length < 3){
        errorNombre.textContent = "El nombre debe tener minimo 3 caracteres.";
        return false;
    }
    else{
        errorNombre.textContent = "";
        return true;
    }
}
nombre.addEventListener("input", validarNombre);

////// Validar el correo
function validarCorreo(){
    let correoEst = correo.value.trim();

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoEst)){
        errorCorreo.textContent = "Escribe un correo valido.";
        return false;
    }
    else{
        errorCorreo.textContent = "";
        return true;
    }
}
correo.addEventListener("input", validarCorreo);

/////// Validar edad
function validarEdad(){
    let edadEst = Number(edad.value);

    if(edad.value.trim() === "" || !Number.isInteger(edadEst) || edadEst <=0){
        errorEdad.textContent = "Escribe una edad entera mayor que cero.";
        return false;
    }
    else{
        errorEdad.textContent = "";
        return true;
    }
}
edad.addEventListener("input", validarEdad);
/// Evento del formulario
formulario.addEventListener("submit", registrarEstudiante);


/// Registrar y actualizar estudiante
function registrarEstudiante(event){
    event.preventDefault();

    //Validar los campos antes de registrar
    let nombreValido = validarNombre();
    let correoValido = validarCorreo();
    let edadValida = validarEdad();

    if (!nombreValido || !correoValido || !edadValida){
        return;
    }

    // Obtener los valores de los campos
    let nombreEst = nombre.value.trim();
    let correoEst = correo.value.trim().toLowerCase();
    let edadEst = Number(edad.value);

    // Crear el objeto del estudiante
    let estudiante = {
        nombre: nombreEst,
        correo: correoEst,
        edad: edadEst
    };

    // Verificar si se esta editando un estudiante
    if(indiceEditar === -1) {
        // Agregar un estudiante al arreglo
        listaEstudiantes.push(estudiante);
    }
    else{
        /// Actualizar el estudiante seleccionado
        listaEstudiantes[indiceEditar] = estudiante;

        indiceEditar = -1;
    }

    // Guardar los datos y actualizar la tabla
    localStorage.setItem("estudiantes", JSON.stringify(listaEstudiantes));

    mostrarEstudiantes();

    formulario.reset();

    errorNombre.textContent = "";
    errorCorreo.textContent = "";
    errorEdad.textContent = "";

    btnGuardar.textContent = "Registrar estudiante";
}


// MOSTRAR ESTUDIANTES EN LA TABLA 
function mostrarEstudiantes(){
    tabla.innerHTML = "";

    for (let i = 0; i < listaEstudiantes.length; i++) {
        // Agregar una fila por cada estudiante
        tabla.innerHTML += `
            <tr>
                <td>${listaEstudiantes[i].nombre}</td>
                <td>${listaEstudiantes[i].correo}</td>
                <td>${listaEstudiantes[i].edad}</td>
                <td>
                    <button onclick="editarEstudiante(${i})">
                        Editar
                    </button>
                    <button onclick="eliminarEstudiante(${i})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    }
}

/// Editar estudiante
function editarEstudiante(indice){
    // cargar los datos del estudiante en los inputs
    nombre.value = listaEstudiantes[indice].nombre;
    correo.value = listaEstudiantes[indice].correo;
    edad.value = listaEstudiantes[indice].edad;

    // Guardar la posicion del estudiante seleccionado 
    indiceEditar = indice;

    // Cambiar el texto del boton
    btnGuardar.textContent = "Actualizar estudiante";
}


// Eliminar estudiante 
function eliminarEstudiante(indice){
    // Eliminar el estudiante del arreglo 
    listaEstudiantes.splice(indice, 1);

    // Guardar los cambios y actualizar la tabla
    localStorage.setItem("estudiantes", JSON.stringify(listaEstudiantes));
    mostrarEstudiantes();

    // Si elimina el estudiante que se estaba editando
    if(indiceEditar === indice){
        indiceEditar = -1;
        formulario.reset();
        btnGuardar.textContent = "Registrar estudiante";

        errorNombre.textContent = "";
        errorCorreo.textContent = "";
        errorEdad.textContent = "";
    }

    /// Si se elimina un registro anterior al que se edita
    else if (indiceEditar > indice) {
        indiceEditar--;
    }
}
/// CARGAR DATOS AL INICIAR

// Consultar los estudiantes guardados 
let datosGuardados = localStorage.getItem("estudiantes");

// verificar si existen datos almacenados
if(datosGuardados !== null){
    listaEstudiantes = JSON.parse(datosGuardados);
}

// Mostrar los estudiantes en la tabla 
mostrarEstudiantes();