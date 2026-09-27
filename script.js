// guarda la lista completa de nombres 
let listaCompletaPokemon = [];

// guardar cada pokemon elegido por cada jugador
let pokemonJugador1 = null;
let pokemonJugador2 = null;

// variables globales (referencia elementos HTML)
const inputBusqueda1 = document.getElementById("busqueda-1");
const inputBusqueda2 = document.getElementById("busqueda-2");
const sugerencias1 = document.getElementById("mensaje-error-1");
const sugerencias2 = document.getElementById("mensaje-error-2");
const infoJugador1 = document.getElementById("pokemon-info-1");
const infoJugador2 = document.getElementById("pokemon-info-2");
const botonEmpezarBatalla = document.getElementById("iniciar-batalla-btn");

// intercambiar entre pantallas
const pickerScreen = document.getElementById("pantalla-1");
const pantallaBatalla = document.getElementById("pantalla-batalla");

// elementos de la pantalla de batalla, peleador 1 y 2
const batallaNombre1 = document.getElementById("batalla-nombre-1");
const batallaSprite1 = document.getElementById("batalla-sprite-1");
const batallaHpBarra1 = document.getElementById("batalla-hp-barra-1");
const batallaHpTexto1 = document.getElementById("batalla-hp-texto-1");
const batallaMovimientos1 = document.getElementById("batalla-movimientos-1");
 
const batallaNombre2 = document.getElementById("batalla-nombre-2");
const batallaSprite2 = document.getElementById("batalla-sprite-2");
const batallaHpBarra2 = document.getElementById("batalla-hp-barra-2");
const batallaHpTexto2 = document.getElementById("batalla-hp-texto-2");
const batallaMovimientos2 = document.getElementById("batalla-movimientos-2");

// mensaje de resultado ganador + boton de reiniciar
const resultadoBatalla = document.getElementById("resultado-batalla"); 

// elementos agrupados de cada jugador en un respectivo objeto
const elementosBatalla1 = {
  nombre: batallaNombre1,
  sprite: batallaSprite1,
  hpBarra: batallaHpBarra1,
  hpTexto: batallaHpTexto1,
  movimientos: batallaMovimientos1,
};
 
const elementosBatalla2 = {
  nombre: batallaNombre2,
  sprite: batallaSprite2,
  hpBarra: batallaHpBarra2,
  hpTexto: batallaHpTexto2,
  movimientos: batallaMovimientos2,
};


// llama la lista completa de nombres
async function cargarListaDeNombres() {
  try {
    const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
    const datos = await respuesta.json();

    listaCompletaPokemon = datos.results.map((pokemon) => pokemon.name);
  } catch (error) {
    console.error("No se pudo cargar la lista de Pokémon:", error);
  }
}

// busca coincidencias con los nombres ya guardados en cargarListaDeNombres >> listaCompletaPokemon
function buscarCoincidencias(texto) {
  const textoBuscado = texto.toLowerCase().trim();

  if (textoBuscado === "") {
    return [];
  }

  return listaCompletaPokemon
    .filter((nombre) => nombre.includes(textoBuscado))
    .slice(0, 8); // solo muestra las primeras 8 coincidencias
}

// detalle completo de un pokemon (sprite, hp, movimientos)
async function obtenerDetallePokemon(nombre) {
  const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
 
  if (!respuesta.ok) {
    // si el pokemon no existe, la API responde con error
    throw new Error("Pokémon no encontrado");
  }
 
  const datos = await respuesta.json();
 
  const statHP = datos.stats.find((stat) => stat.stat.name === "hp").base_stat;
 
  const primerosCuatroMovimientos = datos.moves
    .slice(0, 4)
    .map((movimiento) => movimiento.move.name);
 
  return {
    nombre: datos.name,
    sprite: datos.sprites.front_default,
    hpMaximo: statHP,
    hpActual: statHP,
    movimientos: primerosCuatroMovimientos,
  };
}

// RENDERS

// renderiza la lista en li´s
function mostrarSugerencias(nombres, elementoLista, inputElemento, numeroJugador) {
  elementoLista.innerHTML = ""; // limpia si habia algo antes

  nombres.forEach((nombre) => {
    const item = document.createElement("li");
    item.className = "list-group-item"; // clase para bootstrap
    item.textContent = nombre;

    // de la sugerencia al input
    item.addEventListener("click", () => {
      inputElemento.value = nombre;
      elementoLista.innerHTML = "";
      seleccionarPokemon(nombre, numeroJugador);
    });

    elementoLista.appendChild(item);
  });
}

// renderiza el sprite, el hp y los botones de movimientos
function mostrarInfoPokemon(pokemon, contenedor) {
  contenedor.innerHTML = `
    <img src="${pokemon.sprite}" alt="${pokemon.nombre}" class="pokemon-sprite" />
    <p class="text-capitalize"><strong>${pokemon.nombre}</strong></p>
    <p>HP: ${pokemon.hpActual} / ${pokemon.hpMaximo}</p>
 
    <div class="d-grid gap-2"> 
      ${pokemon.movimientos
        .map((movimiento) => `<button class="btn btn-outline-primary btn-sm text-capitalize">${movimiento}</button>`)
        .join("")}
    </div>
  `;
}

// mensaje de "cargando" mientras la API responde
function mostrarCargando(contenedor) {
  contenedor.innerHTML = `<p class="text-muted">Cargando...</p>`;
}
 
// mensaje de error simple
function mostrarError(contenedor, mensaje) {
  contenedor.innerHTML = `<p class="text-danger">${mensaje}</p>`;
}

// actualiza solo el texto y la barra de hp
function actualizarHP(pokemon, elementos) {
  elementos.hpTexto.textContent = `HP: ${pokemon.hpActual} / ${pokemon.hpMaximo}`;
 
  // el porcentaje de la barra de hp nunca es menos de 0
  const porcentajeHP = Math.max(0, (pokemon.hpActual / pokemon.hpMaximo) * 100);
  elementos.hpBarra.style.width = `${porcentajeHP}%`;
}


// renderizar jugador completo en batalla
function mostrarPeleador(pokemon, elementos, numeroJugador) {
    elementos.nombre.textContent = pokemon.nombre;
    elementos.sprite.src = pokemon.sprite;
    elementos.sprite.alt = pokemon.nombre;
    
    actualizarHP(pokemon, elementos);
    
    elementos.movimientos.innerHTML = "";
    
    pokemon.movimientos.forEach((movimiento) => {
        const boton = document.createElement("button");
        boton.className = "btn btn-outline-danger text-capitalize";
        boton.textContent = movimiento;
        boton.addEventListener("click", () => atacar(numeroJugador));
        elementos.movimientos.appendChild(boton);
    });

}

// ejecutar con cualquier ataque
function atacar(numeroAtacante) {
  const pokemonObjetivo = numeroAtacante === 1 ? pokemonJugador2 : pokemonJugador1;
  const elementosObjetivo = numeroAtacante === 1 ? elementosBatalla2 : elementosBatalla1;
 
  // daño random entre 5 y 20
  const dano = Math.floor(Math.random() * 16) + 5;
 
  // el hp nunca baja de 0
  pokemonObjetivo.hpActual = Math.max(0, pokemonObjetivo.hpActual - dano);
 
  actualizarHP(pokemonObjetivo, elementosObjetivo);

  mostrarGolpe(elementosObjetivo.sprite);

  // si el rival llegó a 0, se termina la batalla
  if (pokemonObjetivo.hpActual === 0) {
    const pokemonGanador = numeroAtacante === 1 ? pokemonJugador1 : pokemonJugador2;
    terminarBatalla(pokemonGanador);
  }
}

// parpadeo al golpear al rival
function mostrarGolpe(elementoSprite) {
  elementoSprite.classList.remove("atacado");
  void elementoSprite.offsetWidth;
  elementoSprite.classList.add("atacado");
}


// Se ejecuta al hacer clic en "iniciar batalla".
function empezarBatalla() {
  // cambia de pantalla 1 a 2
  pickerScreen.classList.add("d-none"); 
  pantallaBatalla.classList.remove("d-none");

  mostrarPeleador(pokemonJugador1, elementosBatalla1, 1);
  mostrarPeleador(pokemonJugador2, elementosBatalla2, 2);
}

botonEmpezarBatalla.addEventListener("click", empezarBatalla);


// habilitar boton si ya se seleccionaron ambos pokemones
function actualizarBotonEmpezarBatalla() {
  if (pokemonJugador1 && pokemonJugador2) {
    botonEmpezarBatalla.disabled = false;
  } else {
    botonEmpezarBatalla.disabled = true;
  }
}

// funcion para crear un tiempo de espera para que salgan las sugerencias en el input
// https://www.freecodecamp.org/news/javascript-debounce-example/
function debounce(callback, esperaMs) {
  let temporizador;

  return function (...argumentos) {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      callback(...argumentos);
    }, esperaMs);
  };
}

// accion para el input 1
function manejarBusqueda1() {
  const coincidencias = buscarCoincidencias(inputBusqueda1.value);
  mostrarSugerencias(coincidencias, sugerencias1, inputBusqueda1, 1);
}

// accion para el input 2
function manejarBusqueda2() {
  const coincidencias = buscarCoincidencias(inputBusqueda2.value);
  mostrarSugerencias(coincidencias, sugerencias2, inputBusqueda2, 2);
}

// accion del debounce en cada input
inputBusqueda1.addEventListener("input", debounce(manejarBusqueda1, 400));
inputBusqueda2.addEventListener("input", debounce(manejarBusqueda2, 400));

// al elegir una sugerencia
async function seleccionarPokemon(nombre, numeroJugador) {
  const contenedor = numeroJugador === 1 ? infoJugador1 : infoJugador2;
 
  mostrarCargando(contenedor);
 
  try {
    const pokemon = await obtenerDetallePokemon(nombre);
 
    // se guarda el resultado en la variable correspondiente
    if (numeroJugador === 1) {
      pokemonJugador1 = pokemon;
    } else {
      pokemonJugador2 = pokemon;
    }
 
    mostrarInfoPokemon(pokemon, contenedor);
  } catch (error) {
    // si hubo error, ese jugador se queda SIN Pokémon válido,
    // aunque antes ya tuviera uno cargado (por eso lo ponemos en null)
    if (numeroJugador === 1) {
      pokemonJugador1 = null;
    } else {
      pokemonJugador2 = null;
    }
 
    // distinguimos el tipo de error para dar un mensaje más útil
    if (error.message === "Pokémon no encontrado") {
      mostrarError(contenedor, "No se encontró ese Pokémon. Intenta con otro nombre.");
    } else {
      mostrarError(contenedor, "Error de conexión. Revisa tu internet e intenta de nuevo.");
    }
  }
 
  actualizarBotonEmpezarBatalla();
}

// deshabilitar botones de ataque cuando hay un ganador
function deshabilitarBotonesDeAtaque() {
  const todosLosBotones = document.querySelectorAll(
    "#batalla-movimientos-1 button, #batalla-movimientos-2 button"
  );
 
  todosLosBotones.forEach((boton) => {
    boton.disabled = true;
  });
}
 
// terminar batalla, resultado del ganador
function terminarBatalla(pokemonGanador) {
  deshabilitarBotonesDeAtaque();
 
  resultadoBatalla.innerHTML = `
    <h3 class="text-capitalize">¡${pokemonGanador.nombre} ganó la batalla!</h3>
    <button id="reiniciar-btn" class="btn btn-primary mt-2">Jugar de nuevo</button>
  `;
 
  document.getElementById("reiniciar-btn").addEventListener("click", reiniciarJuego);
}
 
// limpia datos y lleva a la pantalla principal para reiniciar el juego
function reiniciarJuego() {
  pokemonJugador1 = null;
  pokemonJugador2 = null;
 
  inputBusqueda1.value = "";
  inputBusqueda2.value = "";
  sugerencias1.innerHTML = "";
  sugerencias2.innerHTML = "";
  infoJugador1.innerHTML = "";
  infoJugador2.innerHTML = "";
 
  resultadoBatalla.innerHTML = "";
 
  actualizarBotonEmpezarBatalla();
 
  pantallaBatalla.classList.add("d-none");
  pickerScreen.classList.remove("d-none");
}

cargarListaDeNombres();