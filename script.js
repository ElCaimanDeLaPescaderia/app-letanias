// 1. Nuestra base de datos de respuestas
const letanias = [
    "Santa María", "Santa Madre de Dios", "Santa Virgen de las Vírgenes",
    "Madre de Cristo", "Madre de la Iglesia"
    // (Puedes seguir añadiendo todas las demás aquí)
];

// Esta función toma un texto y lo devuelve "limpio"
const normalizarTexto = (texto) => {
    return texto
        .toLowerCase()            // Pasa todo a minúsculas
        .trim()                   // Quita espacios al inicio y al final
        .normalize("NFD")         // Descompone los acentos (ej: 'á' se vuelve 'a' + '´')
        .replace(/[\u0300-\u036f]/g, ""); // Borra los símbolos de los acentos
};

// 2. Referencias a los elementos del HTML para poder manipularlos
const contenedor = document.getElementById('tabla-contenedor');
const input = document.getElementById('input-letania');
const contadorText = document.getElementById('contador');
const checkTemporizador = document.getElementById('check-temporizador');

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
    //const valorUsuario = input.value.trim().toLowerCase();

    // Normalizamos lo que el usuario escribe
    const valorUsuario = normalizarTexto(input.value);
    
    // Recorremos el array de respuestas para ver si coincide con alguna
    letanias.forEach((letania, index) => {
        const celda = document.getElementById(`letania-${index}`);

        // Normalizamos la letanía de la lista antes de comparar
        const letaniaNormalizada = normalizarTexto(letania);
        
        // Comparamos: si el texto coincide Y la celda no ha sido descubierta aún
        if (letaniaNormalizada === valorUsuario && !celda.classList.contains('descubierta')) {
            
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

let tiempoRestante = 300; // 5 minutos en segundos (5 * 60)
let intervalo;
let juegoIniciado = false; // Para que el tiempo empiece solo cuando el usuario escriba algo

const relojDisplay = document.getElementById('reloj');

// Función para formatear segundos a MM:SS
function actualizarReloj() {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    
    // El paddingStart(2, '0') hace que el 5 se vea como 05
    relojDisplay.innerText = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    
    // Si queda menos de 30 segundos, ponemos el reloj en rojo
    if (tiempoRestante <= 30) {
        relojDisplay.parentElement.classList.add('tiempo-bajo');
    }
}

function iniciarTemporizador() {
    intervalo = setInterval(() => {
        tiempoRestante--;
        actualizarReloj();

        if (tiempoRestante <= 0) {
            clearInterval(intervalo);
            finalizarJuego(false); // Perdió por tiempo
        }
    }, 1000);
}

function finalizarJuego(victoria) {
    input.disabled = true; // Bloqueamos el cuadro de texto
    if (victoria) {
        alert("¡Felicidades! Has completado todas las letanías.");
    } else {
        alert("¡Se acabó el tiempo! Revisa cuáles te faltaron.");
        // Opcional: mostrar las que faltaron en rojo
    }
}

// MODIFICACIÓN: Detectar el primer carácter para iniciar el reloj
input.addEventListener('input', () => {
    if (!juegoIniciado && input.value.length > 0) {
        juegoIniciado = true;

        // BLOQUEO: Una vez que empieza el juego, no dejamos cambiar el modo
        checkTemporizador.disabled = true;

        // SOLO iniciamos el reloj si la casilla está marcada
        if (checkTemporizador.checked) {
            iniciarTemporizador();
        } else {
            relojDisplay.innerText = "Infinito";
        }
    }
    
    // ... aquí va el código de comparación que ya teníamos ...
    // (Dentro del IF donde sumas aciertos, añade esto):
    if (aciertos === letanias.length) {
        clearInterval(intervalo);
        finalizarJuego(true);
    }
});

// MODIFICACIÓN EN EL RESET:
btnReset.addEventListener('click', () => {
    if (confirm("¿Reiniciar?")) {
        clearInterval(intervalo);
        tiempoRestante = 300;
        juegoIniciado = false;
        input.disabled = false;

        // Volvemos a habilitar el checkbox para que el usuario elija modo otra vez
        checkTemporizador.disabled = false;

        // Si estaba en infinito, volvemos a poner el texto de tiempo
        if (checkTemporizador.checked) {
            actualizarReloj();
        } else {
            relojDisplay.innerText = "Infinito";
        }

        relojDisplay.parentElement.classList.remove('tiempo-bajo');
        actualizarReloj();
        // ... resto de tu código de reset ...
    }
});

// Cambiar automáticamente a "Infinito" al desmarcar la casilla de reloj antes de empezar a jugar
checkTemporizador.addEventListener('change', () => {
    if (checkTemporizador.checked) {
        actualizarReloj();
    } else {
        relojDisplay.innerText = "Infinito";
    }
});
