function leerLocalStorage(key) {
  const datos = JSON.parse(localStorage.getItem(key))
  return datos;  
}

function guardarLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
}

export default {
    leerLocalStorage,
    guardarLocalStorage
}