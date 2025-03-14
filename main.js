import funciones from "./funciones.js"; 

//Funciones selectoras de elementos HTML//
const $ = element => document.querySelector(element)
const $$ = element => document.querySelectorAll(element)

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

//SELECCIÓN DE ELEMENTOS HTML//
//Secciones
const $viewBalance = $("#view-balance")
const $viewCategorias = $("#view-categorias")
const $viewReportes = $("#view-reportes")
const $viewFormularioNuevaOperacion = $("#view-formulario-nueva-operacion")
const $formularioNuevaOperacion = $("#formulario-nueva-operacion")
const $listadoDeOperaciones = $("#list-operaciones")
const $viewEditarNuevaOperacion = $("#view-editar-nueva-operacion")
const $formularioEditarOperacion = $("#formulario-editar-operacion")
const $containerOperacionesSinResultados = $("#container-operaciones-sin-resultados")
const $containerOperacionesConResultados = $("#container-operaciones-con-resultados")
const $formNuevaCategoria = $("#agregar-nueva-categoria");
const $containerFormularioFiltros = $("#container-formulario-filtros");
const $containerReportes = $("#container-reportes")

//Botones 
const $buttonViewBalance = $("#button-view-balance")
const $buttonViewCategorias = $("#button-view-categorias")
const $buttonViewReportes = $("#button-view-reportes")
const $buttonNuevaOperacion = $("#button-nueva-operacion")
const $buttonCancelarOperacion = $("#button-cancelar-operacion")
const $buttonCancelarEdicion = $("#button-cancelar-edicion");
const $ocultarMostrarFiltros = $("#ocultar-mostrar-filtros");

//Inputs filtros
const $selectFiltrarPorTipo = $("#select-filtrar-por-tipo")
const $selectFiltrarPorCategoria = $("#select-filtrar-por-categoria")
const $inputFiltrarPorFecha = $("#input-filtrar-por-fecha")
const $selectOrdenarPor = $("#select-ordenar-por")

//Tablas reportes
const $tablaReportesResumen = $("#tabla-reportes-resumen")
const $tablaReportesTotalesCategoria = $("#tabla-reportes-totales-categoria")
const $tablaReportesTotalesMes = $("#tabla-reportes-totales-mes")

// Cargar datos iniciales
let datosTodasLasOperaciones = funciones.leerLocalStorage("operaciones") || [];

// Vistas internas de las secciones de operaciones
function actualizarVistaOperaciones() {
    if (datosTodasLasOperaciones.length === 0) {
        
        showElement([$containerOperacionesSinResultados]);
        hideElement([$containerOperacionesConResultados]);
    } else {
       
        showElement([$containerOperacionesConResultados]);
        hideElement([$containerOperacionesSinResultados]);
    }
}

actualizarVistaOperaciones();
actualizarBalance();

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
            <td class="text-center">${operacion.description}</td>
            <td class="text-center">${operacion.category}</td>
            <td class="text-center">${operacion.type}</td>
            <td class="text-center">${operacion.date}</td>
            <td class="text-center">${operacion.amount}</td>
            <td class="text-center">
                <button class="editar text-sky-600" data-id="${operacion.id}">Editar</button>
                <button class="eliminar text-sky-600" data-id="${operacion.id}">Eliminar</button>
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
    actualizarVistaOperaciones();
    actualizarBalance();
  
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

// Eliminar una operación
$listadoDeOperaciones.addEventListener("click", (evento) => {
    if (evento.target.classList.contains("eliminar")) {
        const idOperacion = evento.target.dataset.id;
       
        datosTodasLasOperaciones = funciones.eliminarOperacion(idOperacion);

        pintarDatos(datosTodasLasOperaciones);
        actualizarVistaOperaciones();
        actualizarBalance();
    }
});

// Editar operación
$listadoDeOperaciones.addEventListener("click", (evento) => {
    if (evento.target.classList.contains("editar")) {
        const idOperacion = evento.target.dataset.id;
        const operacion = datosTodasLasOperaciones.find(op => op.id === idOperacion);

        if (operacion) {
        
            document.querySelector("#editar-descripcion").value = operacion.description;
            document.querySelector("#editar-monto").value = operacion.amount;
            document.querySelector("#editar-tipo").value = operacion.type;
            document.querySelector("#editar-categoria").value = operacion.category;
            document.querySelector("#editar-fecha").value = dayjs(operacion.date, "DD-MM-YYYY").format("YYYY-MM-DD");

            document.querySelector("#formulario-editar-operacion").dataset.id = idOperacion;

            showElement([$viewEditarNuevaOperacion]);
            hideElement([$viewBalance, $viewCategorias, $viewReportes, $viewFormularioNuevaOperacion]);
        }
    }
});

$formularioEditarOperacion.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const idOperacion = evento.target.dataset.id;

    if (!idOperacion) {
        return; 
    }

    const operacionActualizada = {
        description: evento.target[0].value,
        amount: Number(evento.target[1].value),
        type: evento.target[2].value,
        category: evento.target[3].value,
        date: dayjs(evento.target[4].value).format("DD-MM-YYYY")
    };

    datosTodasLasOperaciones = funciones.editarOperacion(idOperacion, operacionActualizada);

    pintarDatos(datosTodasLasOperaciones);
    actualizarVistaOperaciones();
    actualizarBalance();

    hideElement([$viewEditarNuevaOperacion]);
    showElement([$viewBalance]);
});

$buttonCancelarEdicion.addEventListener("click", (evento) => {
    evento.preventDefault(); 

    showElement([$viewBalance]);
    hideElement([$viewEditarNuevaOperacion]);
});


//CATEGORIAS
let categorias = funciones.leerLocalStorage("categorias") || [];

// Actualizar las categorías en los selectores
function actualizarCategoriasEnSelectores() {
    const selectores = ["#create-category", "#editar-categoria", "#select-filtrar-por-categoria"];
    
    
    selectores.forEach(selector => {
      const select = $(selector);
      select.innerHTML = "<option value='Todos'>Todas</option>"; ; 
  
    
      categorias.forEach(categoria => {
        const option = document.createElement("option");
        option.value = categoria;
        option.textContent = categoria;
        select.appendChild(option);
      });
    });
  }
  
  // Pintar las categorías en la tabla
  function pintarCategorias(array) {
    const tbody = document.querySelector("#tabla-listado-categorias tbody");
    tbody.innerHTML = ""; 
  
    array.forEach(categoria => {
      const fila = tbody.insertRow();
      fila.innerHTML = `
        <td>${categoria}</td>
        <td>
          <button class="editar-categoria" data-categoria="${categoria}">Editar</button>
          <button class="eliminar-categoria" data-categoria="${categoria}">Eliminar</button>
        </td>
      `;
    });
  
    actualizarCategoriasEnSelectores();
  }
  
  // Agregar nueva categoría
  $formNuevaCategoria.addEventListener("submit", (evento) => {
    evento.preventDefault(); 
    
    const nuevaCategoria = evento.target[0].value.trim();
    
    if (nuevaCategoria && !categorias.includes(nuevaCategoria)) {
      
      categorias = funciones.agregarCategoria(nuevaCategoria);
      
      pintarCategorias(categorias);
    
      evento.target.reset();
    }
  });
  
  // Eliminar categoría
  $("#tabla-listado-categorias").addEventListener("click", (evento) => {
    if (evento.target.classList.contains("eliminar-categoria")) {
      const categoria = evento.target.dataset.categoria;
      
      categorias = funciones.eliminarCategoria(categoria);
      
      pintarCategorias(categorias);
    }
  });
  
  // Editar categoría
  $("#tabla-listado-categorias").addEventListener("click", (evento) => {
    if (evento.target.classList.contains("editar-categoria")) {
      const categoriaAntigua = evento.target.dataset.categoria;
      
      const nuevaCategoria = prompt("Edita la categoría", categoriaAntigua);
      
      if (nuevaCategoria && nuevaCategoria !== categoriaAntigua) {
        
        categorias = funciones.editarCategoria(categoriaAntigua, nuevaCategoria);
        
        pintarCategorias(categorias);
      }
    }
  });
  
  //Categorías al iniciar la paágina
  actualizarCategoriasEnSelectores();
  
  pintarCategorias(categorias);
  

//FILTROS
function aplicarFiltros(operaciones) {
    let operacionesFiltradas = [...operaciones]; 

    // Filtrar por tipo
    const tipoSeleccionado = $selectFiltrarPorTipo.value;
    if (tipoSeleccionado !== "Todos") {
        operacionesFiltradas = operacionesFiltradas.filter(elem => elem.type === tipoSeleccionado);
    }

    // Filtrar por categoría
    const categoriaSeleccionada = $selectFiltrarPorCategoria.value;
    if (categoriaSeleccionada !== "Todos") {
        operacionesFiltradas = operacionesFiltradas.filter(elem => elem.category === categoriaSeleccionada);
    }

    // Filtrar por fecha
    const fechaSeleccionada = $inputFiltrarPorFecha.value.trim();
    if (fechaSeleccionada) {
        const fechaFiltrada = dayjs(fechaSeleccionada, "DD-MM-YYYY").toDate(); 
        operacionesFiltradas = operacionesFiltradas.filter(operacion => {
            const fechaOperacion = convertirFecha(operacion.date);  
        });
    }

    return operacionesFiltradas;
}

//Convertir fecha a formato Date para omparar
function convertirFecha(fecha) {
    const [dia, mes, anio] = fecha.split("-");
    return new Date(`${anio}-${mes}-${dia}`); 
}

// Ordenar operaciones
function aplicarOrden(operacionesFiltradas, ordenSeleccionado) {
    switch (ordenSeleccionado) {
        case "Más reciente":
            return operacionesFiltradas.sort((a, b) => convertirFecha(b.date) - convertirFecha(a.date)); 
        case "Menos reciente":
            return operacionesFiltradas.sort((a, b) => convertirFecha(a.date) - convertirFecha(b.date)); 
        case "Mayor monto":
            return operacionesFiltradas.sort((a, b) => b.amount - a.amount);
        case "Menor monto":
            return operacionesFiltradas.sort((a, b) => a.amount - b.amount);
        case "A/Z":
            return operacionesFiltradas.sort((a, b) => (a.description || "").toUpperCase().localeCompare((b.description || "").toUpperCase()));
        case "Z/A":
            return operacionesFiltradas.sort((a, b) => (b.description || "").toUpperCase().localeCompare((a.description || "").toUpperCase()));
        default:
            return operacionesFiltradas;
    }
}

// Filtrar y ordenar 
$ocultarMostrarFiltros.addEventListener("click", () => {
    $containerFormularioFiltros.classList.toggle("hidden");
    const texto = $containerFormularioFiltros.classList.contains("hidden") ? "Mostrar filtros" : "Ocultar filtros";
    $ocultarMostrarFiltros.textContent = texto;
});

$selectFiltrarPorTipo.addEventListener("input", actualizarDatos);
$selectFiltrarPorCategoria.addEventListener("input", actualizarDatos);
$inputFiltrarPorFecha.addEventListener("input", actualizarDatos);
$selectOrdenarPor.addEventListener("change", actualizarDatos);

function actualizarDatos() {
    let operacionesFiltradas = aplicarFiltros(datosTodasLasOperaciones);

    const valorSeleccionado = $selectOrdenarPor.value;
    operacionesFiltradas = aplicarOrden(operacionesFiltradas, valorSeleccionado);

    pintarDatos(operacionesFiltradas);
}

//BALANCE
function calcularBalance(operaciones) {
    let ganancias = 0;
    let gastos = 0;

    operaciones.forEach(operacion => {
        if (operacion.type === "Ganancia") {
            ganancias += operacion.amount;
        } else if (operacion.type === "Gasto") {
            gastos += operacion.amount;
        }
    });
        return {
            ganancias,
            gastos,
            total: ganancias - gastos
        };
}

function actualizarBalance() {
    let operacionesFiltradas = aplicarFiltros(datosTodasLasOperaciones);

    const balance = calcularBalance(operacionesFiltradas);

    $("#tabla-balance").querySelectorAll("tbody tr")[0].cells[1].textContent = `+$${balance.ganancias}`;
    $("#tabla-balance").querySelectorAll("tbody tr")[1].cells[1].textContent = `-$${balance.gastos}`;
    $("#tabla-balance").querySelectorAll("tbody tr")[2].cells[1].textContent = `$${balance.total}`;
}

// Actualizar balance al cambiar los filtros
$selectFiltrarPorTipo.addEventListener("change", actualizarBalance);
$selectFiltrarPorCategoria.addEventListener("change", actualizarBalance);
$inputFiltrarPorFecha.addEventListener("change", actualizarBalance);
$selectOrdenarPor.addEventListener("change", actualizarBalance);

document.addEventListener("DOMContentLoaded", function() {
    actualizarBalance();
});