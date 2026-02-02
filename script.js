// 1. Nuestra base de datos de respuestas
const letanias = [
    "Santa María", "Santa Madre de Dios", "Santa Virgen de las Vírgenes",
    "Madre de Cristo", "Madre de la Iglesia"
    // (Puedes seguir añadiendo todas las demás aquí)
];

// 2. Referencias a los elementos del HTML para poder manipularlos
const contenedor = document.getElementById('tabla-contenedor');
const input = document.getElementById('input-letania');
const contadorText = document.getElementById('contador');

let aciertos = 0;

// 3. Función de inicio: Crea visualmente los huecos de la tabla al cargar la página
letanias.forEach((texto, index) => {
    const div = document.createElement('div'); // Crea un <div> nuevo
    div.classList.add('celda');                // Le pone la clase CSS .celda
    div.id = `letania-${index}`;               // Le asigna un ID único (ej: letania-0)
    div.innerText = texto;                     // Le pone el texto (aunque sea invisible)
    contenedor.appendChild(div);               // Lo mete dentro del contenedor gris
});

// 4. El "Escuchador": Se activa cada vez que el usuario pulsa una tecla en el input
input.addEventListener('input', () => {
    // Tomamos lo que escribió el usuario, quitamos espacios y pasamos a minúsculas
    const valorUsuario = input.value.trim().toLowerCase();
    
    // Recorremos el array de respuestas para ver si coincide con alguna
    letanias.forEach((letania, index) => {
        const celda = document.getElementById(`letania-${index}`);
        
        // Comparamos: si el texto coincide Y la celda no ha sido descubierta aún
        if (letania.toLowerCase() === valorUsuario && !celda.classList.contains('descubierta')) {
            
            celda.classList.add('descubierta'); // Hacemos visible el texto mediante CSS
            input.value = '';                  // Borramos el cuadro de texto para la siguiente
            aciertos++;                        // Sumamos un punto
            
            // Actualizamos el contador visual
            contadorText.innerText = `Aciertos: ${aciertos} / ${letanias.length}`;
        }
    });
});


// REINICIAR JUEGO
// 1. Obtenemos la referencia al botón
const btnReset = document.getElementById('btn-reset');

// 2. Escuchamos el "click" en el botón
btnReset.addEventListener('click', () => {
    // A) Preguntar al usuario si está seguro (opcional pero recomendado)
    if (confirm("¿Estás seguro de que quieres reiniciar el progreso?")) {
        
        // B) Resetear la variable de aciertos
        aciertos = 0;
        
        // C) Actualizar el texto del contador
        contadorText.innerText = `Aciertos: 0 / ${letanias.length}`;
        
        // D) Limpiar el cuadro de texto por si había algo escrito
        input.value = '';
        
        // E) Quitar la clase "descubierta" a todas las celdas
        // Usamos querySelectorAll para agarrar todas las celdas a la vez
        const todasLasCeldas = document.querySelectorAll('.celda');
        todasLasCeldas.forEach(celda => {
            celda.classList.remove('descubierta');
        });

        // F) Poner el foco otra vez en el input para seguir jugando
        input.focus();
    }
});
