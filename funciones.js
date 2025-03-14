let datosTodasLasOperaciones = leerLocalStorage("operaciones") || [];

function leerLocalStorage(key) {
  const datos = JSON.parse(localStorage.getItem(key))
  return datos;  
}

function guardarLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
}

function agregarOperacion(objetoNuevaOperacion) {
  datosTodasLasOperaciones.push(objetoNuevaOperacion);
  guardarLocalStorage("operaciones", datosTodasLasOperaciones);
  return datosTodasLasOperaciones; 
}

function eliminarOperacion(id) {
  datosTodasLasOperaciones = datosTodasLasOperaciones.filter(op => op.id !== id);
  guardarLocalStorage("operaciones", datosTodasLasOperaciones);
  return datosTodasLasOperaciones; 
}

function editarOperacion(id, nuevaData) {
  const index = datosTodasLasOperaciones.findIndex(op => op.id === id);
  if (index !== -1) {
    datosTodasLasOperaciones[index] = { ...datosTodasLasOperaciones[index], ...nuevaData };
    guardarLocalStorage("operaciones", datosTodasLasOperaciones);
  }
  return datosTodasLasOperaciones; 
}

export default {
    leerLocalStorage,
    guardarLocalStorage,
    agregarOperacion,
    eliminarOperacion,
    editarOperacion
}