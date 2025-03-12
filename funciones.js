let datosTodasLasOperaciones = []

function leerLocalStorage(key) {
  const datos = JSON.parse(localStorage.getItem(key))
  return datos;  
}

function guardarLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
}

function agregarOperacion(objetoNuevaOperacion) {
  datosTodasLasOperaciones.push(objetoNuevaOperacion)
  guardarLocalStorage("operaciones", datosTodasLasOperaciones)

}

export default {
    leerLocalStorage,
    guardarLocalStorage,
    agregarOperacion
}