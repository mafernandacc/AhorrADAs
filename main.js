import funciones from "./funciones.js"; 

//Funciones selectoras de elementos HTML//
const $ = element => document.querySelector(element)
const $$ = element => document.querySelectorAll(element)

//SELECCIÓN DE ELEMENTOS HTML//
//Secciones
const $viewBalance = $("#view-balance")
const $viewCategorias = $("#view-categorias")
const $viewReportes = $("#view-reportes")
const $viewFormularioNuevaOperacion = $("#view-formulario-nueva-operacion")
const $formularioNuevaOperacion = $("#formulario-nueva-operacion")
const $listadoDeOperaciones = $("#list-operaciones")

//Botones 
const $buttonViewBalance = $("#button-view-balance")
const $buttonViewCategorias = $("#button-view-categorias")
const $buttonViewReportes = $("#button-view-reportes")
const $buttonNuevaOperacion = $("#button-nueva-operacion")
const $buttonCancelarOperacion = $("#button-cancelar-operacion");

// Cargar operaciones guardadas
let datosTodasLasOperaciones = funciones.leerLocalStorage("operaciones") || [];

// VISTAS
$buttonViewBalance.addEventListener("click", () => {
    showElement([$viewBalance])
    hideElement([$viewCategorias, $viewReportes])
})

$buttonViewCategorias.addEventListener("click", () => {
    showElement([$viewCategorias])
    hideElement([$viewBalance, $viewReportes])
})

$buttonViewReportes.addEventListener("click", () => {
    showElement([$viewReportes])
    hideElement([$viewBalance, $viewCategorias])
})

$buttonNuevaOperacion.addEventListener("click", () => {
    showElement([$viewFormularioNuevaOperacion])
    hideElement([$viewBalance, $viewCategorias, $viewReportes])
})

// Pintar datos en la tabla
function pintarDatos(array) {
    const tbody = document.querySelector("#list-operaciones tbody");
    tbody.innerHTML = ""; 

    array.forEach(operacion => {
        const fila = tbody.insertRow();

        fila.innerHTML = `
            <td>${operacion.description}</td>
            <td>${operacion.category}</td>
            <td>${operacion.type}</td>
            <td>${operacion.date}</td>
            <td>${operacion.amount}</td>
            <td>
                <button class="editar" data-id="${operacion.id}">Editar</button>
                <button class="eliminar" data-id="${operacion.id}">Eliminar</button>
            </td>
        `;
    });
}

// Pintar los datos al cargar la página
pintarDatos(datosTodasLasOperaciones);

//Formulario Nueva Operación 
$formularioNuevaOperacion.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nuevaOperacion = {
        id: crypto.randomUUID(),
        description: evento.target[0].value,
        amount: Number(evento.target[1].value),
        type: evento.target[2].value,
        category: evento.target[3].value,
        date: dayjs(evento.target[4].value).format("DD-MM-YYYY")
    }

    datosTodasLasOperaciones = funciones.agregarOperacion(nuevaOperacion);

    pintarDatos(datosTodasLasOperaciones);
  
    hideElement([$viewFormularioNuevaOperacion]);
    showElement([$viewBalance]);

    $formularioNuevaOperacion.reset();
})

// Cancelar Nueva Operación
$buttonCancelarOperacion.addEventListener("click", (evento) => {
    evento.preventDefault(); 

    showElement([$viewBalance]);
    hideElement([$viewFormularioNuevaOperacion]);

    $formularioNuevaOperacion.reset();
});


// FUNCIONES AUXILIARES 
const showElement = (selectors) => {
    for (const selector of selectors) {
        selector.classList.remove("hidden");
    }
}

const hideElement = (selectors) => {
    for (const selector of selectors) {
        selector.classList.add("hidden");
    }
}
