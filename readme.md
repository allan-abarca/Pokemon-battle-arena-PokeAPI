# Pokémon Battle Arena

Aplicación web donde se eligen dos Pokémon (buscándolos por nombre) y se enfrentan en una batalla simple: cada botón de movimiento le quita una cantidad random de HP al rival, hasta que uno de los dos llega a 0.

Hecho con HTML, CSS y JavaScript puro (sin frameworks), usando la [PokéAPI](https://pokeapi.co) para los datos de los Pokémon.

## Cómo correrlo

No necesita instalación ni servidor. Basta con:

1. Descargar los 3 archivos (`index.html`, `style.css`, `script.js`) en la misma carpeta.
2. Abrir `index.html` en el navegador (doble clic, o clic derecho → "Abrir con" → tu navegador).

Se necesita conexión a internet, porque los datos de los Pokémon (sprites, HP, movimientos) se piden en vivo a la PokéAPI.

## Cómo se usa

1. En cada una de las dos tarjetas, escribe el nombre de un Pokémon (en inglés, como los usa la API — ej. "pikachu", "charizard").
2. Elige uno de la lista de sugerencias que aparece mientras escribes.
3. Cuando ambos jugadores tengan un Pokémon válido cargado, se habilita el botón "Iniciar batalla".
4. En la pantalla de batalla, cualquier botón de movimiento (de cualquiera de los dos lados, las veces que quieras) le resta HP al rival. No hay turnos ni tabla de tipos: es puro daño random.
5. Cuando el HP de alguno llega a 0, se anuncia el ganador y aparece el botón "Jugar de nuevo", que reinicia todo y regresa a la pantalla de selección.

## Estructura de archivos

- `index.html` — estructura de las dos pantallas (selección de Pokémon y batalla).
- `style.css` — estilos propios del proyecto (los estilos de componentes como tarjetas, botones y barras de progreso vienen de Bootstrap, cargado por CDN).
- `script.js` — toda la lógica: búsqueda con debounce, llamadas a la PokéAPI, render de pantallas, lógica de ataque, y fin del juego.

## Notas técnicas

- La lista completa de nombres de Pokémon se carga **una sola vez** al abrir la página, y las búsquedas siguientes filtran esa lista en memoria (no se vuelve a llamar a la API en cada tecla).
- La búsqueda usa **debounce**: espera a que la persona deje de escribir antes de filtrar, para no hacer trabajo de más.
- El código separa las funciones que **piden datos** (fetch a la API) de las que **dibujan cosas en pantalla** (render), para mantenerlo ordenado.
- Se manejan dos tipos de error al buscar un Pokémon: que no exista (404 de la API) y que falle la conexión.
- El estado de la partida (Pokémon elegidos, HP, etc.) se limpia por completo al reiniciar, para que la siguiente partida no arrastre datos de la anterior.

## Link de Github pages

https://allan-abarca.github.io/Pokemon-battle-arena-PokeAPI
