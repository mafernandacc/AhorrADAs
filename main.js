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

//Botones vistas
const $buttonViewBalance = $("#button-view-balance")
const $buttonViewCategorias = $("#button-view-categorias")
const $buttonViewReportes = $("#button-view-reportes")
const $buttonNuevaOperacion = $("#button-nueva-operacion")


//VISTAS
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

//NUEVA OPERACIÓN 
$viewFormularioNuevaOperacion.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nuevaOperacion = {
        id: crypto.randomUUID(),
        description: evento.target[0].value,
        amount: Number(evento.target[1].value),
        type: evento.target[2].value,
        category: evento.target[3].value,
        date: dayjs(evento.target[4].value).format("DD-MM-YYYY")
    }

    funciones.agregarOperacion(nuevaOperacion)
})




//FUNCIONES AUXILIARES 
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