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