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
const $containerOperaciones = $("#container-operaciones")
const $containerOperacionesSinResultados = $("#container-operaciones-sin-resultados")
const $containerOperacionesConResultados = $("#container-operaciones-con-resultados")
const $formNuevaCategoria = $("#agregar-nueva-categoria");

//Botones 
const $buttonViewBalance = $("#button-view-balance")
const $buttonViewCategorias = $("#button-view-categorias")
const $buttonViewReportes = $("#button-view-reportes")
const $buttonNuevaOperacion = $("#button-nueva-operacion")
const $buttonCancelarOperacion = $("#button-cancelar-operacion")
const $buttonCancelarEdicion = $("#button-cancelar-edicion");

// Cargar operaciones guardadas
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
    actualizarVistaOperaciones();
  
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
    const selectores = ["#create-category", "#editar-categoria", "#filtrar-por-categoria"];
    
    selectores.forEach(selector => {
      const select = $(selector);
      select.innerHTML = "<option value=''>Seleccionar categoría</option>"; // Resetear el contenido del select
  
    
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
  
  