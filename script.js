// Nuestra base de datos de respuestas
const letanias = [
    "Santa María", "Santa Madre de Dios", "Santa Virgen de las Vírgenes",
    "Madre de Cristo", "Madre de la Iglesia", "Madre de la Divina Gracia",
    "Madre de la Esperanza", "Madre Purísima", "Madre Castísima",
    "Madre Siempre Virgen", "Madre Inmaculada", "Madre Amable",
    "Madre Admirable", "Madre del Buen Consejo", "Madre del Creador",
    "Madre del Salvador", "Virgen Prudentísima", "Virgen Venerable",
    "Virgen Predicable", "Virgen Poderosa", "Virgen Clemente",
    "Virgen Fiel", "Espejo de Justicia", "Trono de la Sabiduría",
    "Causa de Nuestra Alegría", "Vaso Espiritual", "Vaso Precioso de Honor",
    "Vaso Insigne de Devoción", "Rosa Mística", "Torre de David",
    "Torre de Marfil", "Casa de Oro", "Arca de la Alianza",
    "Puerta del Cielo", "Estrella de la Mañana", "Salud de los Enfermos",
    "Refugio de los Pecadores", "Consuelo de los Migrantes", "Consoladora de los Afligidos",
    "Auxilio de los Cristianos", "Reina de los Ángeles", "Reina de los Patriarcas",
    "Reina de los Profetas", "Reina de los Apóstoles", "Reina de los Mártires",
    "Reina de los Confesores", "Reina de las Vírgenes", "Reina de todos los Santos",
    "Reina Concebida sin Pecado Original", "Reina Asunta a los Cielos",
    "Reina del Santísimo Rosario", "Reina de la Familia", "Reina de la Paz"
];

// Variables globales
let aciertos = 0;
let tiempoRestante = 300; // 5 minutos en segundos (5 * 60)
let intervalo;
let juegoIniciado = false; // Para que el tiempo empiece solo cuando el usuario escriba algo

// Referencias a los elementos del HTML para poder manipularlos
const contenedor = document.getElementById('tabla-contenedor');
const input = document.getElementById('input-letania');
const contadorText = document.getElementById('contador');
const relojDisplay = document.getElementById('reloj');
const btnReset = document.getElementById('btn-reset');
const btnRendirse = document.getElementById('btn-rendirse');
const checkTemporizador = document.getElementById('check-temporizador');


// FUNCIONES DE AYUDA

// Esta función toma un texto y lo devuelve "limpio"
const normalizarTexto = (texto) => {
    return texto
        .toLowerCase()            // Pasa todo a minúsculas
        .trim()                   // Quita espacios al inicio y al final
        .normalize("NFD")         // Descompone los acentos (ej: 'á' se vuelve 'a' + '´')
        .replace(/[\u0300-\u036f]/g, ""); // Borra los símbolos de los acentos
};

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
            revelarRespuestasFaltantes();
            finalizarJuego(false); // Perdió por tiempo
        }
    }, 1000);
}

function finalizarJuego(victoria) {
    input.disabled = true; // Bloqueamos el cuadro de texto
    if (victoria) {
        alert("¡Felicidades! Has completado todas las letanías.");
    } else {
        alert("¡Se acabó el tiempo! Aquí tienes las respuestas que te faltaron.");
        // Opcional: mostrar las que faltaron en rojo
    }
}

// Cambiar automáticamente a "Infinito" al desmarcar la casilla de reloj antes de empezar a jugar
checkTemporizador.addEventListener('change', () => {
    if (checkTemporizador.checked) {
        actualizarReloj();
    } else {
        relojDisplay.innerText = "Infinito";
    }
});

function revelarRespuestasFaltantes() {
    // 1. Detenemos el tiempo y bloqueamos el teclado
    clearInterval(intervalo);
    input.disabled = true;

    // 2. Buscamos todas las celdas y revelamos las que no fueron adivinadas
    const todasLasCeldas = document.querySelectorAll('.celda');
    todasLasCeldas.forEach(celda => {
        if (!celda.classList.contains('descubierta')) {
            celda.classList.add('revelada'); // Usamos la clase roja que creamos antes
        }
    });
}


// FUNCIÓN DE INICIO: Crea visualmente los huecos de la tabla al cargar la página
letanias.forEach((texto, index) => {
    const div = document.createElement('div'); // Crea un <div> nuevo
    div.classList.add('celda');                // Le pone la clase CSS .celda
    div.id = `letania-${index}`;               // Le asigna un ID único (ej: letania-0)
    div.innerText = texto;                     // Le pone el texto (aunque sea invisible)
    contenedor.appendChild(div);               // Lo mete dentro del contenedor gris
});


// EVENTOS

// Control del teclado: Se activa cada vez que el usuario pulsa una tecla en el input
input.addEventListener('input', () => {
    // 1. Iniciar el juego y el tiempo en la primera pulsación
    if (!juegoIniciado && input.value.trim().length > 0) {
        juegoIniciado = true;
        checkTemporizador.disabled = true; // Bloqueamos el selector de modo

        if (checkTemporizador.checked) {
            iniciarTemporizador();
        } else {
            relojDisplay.innerText = "Infinito";
        }
    }

    // 2. Normalizar lo que escribe el usuario para comparar justamente
    const valorUsuario = normalizarTexto(input.value);

    // 3. Revisar cada letanía de la lista
    letanias.forEach((letania, index) => {
        const celda = document.getElementById(`letania-${index}`);
        const letaniaNormalizada = normalizarTexto(letania);

        // Si coincide y no estaba ya descubierta
        if (letaniaNormalizada === valorUsuario && !celda.classList.contains('descubierta')) {
            celda.classList.add('descubierta');
            input.value = ''; // Limpiamos el cuadro para la siguiente
            aciertos++;
    
            // Actualizamos contador visual
            contadorText.innerText = `Aciertos: ${aciertos} / ${letanias.length}`;

            // 4. Comprobar si ha ganado (si completó todas)
            if (aciertos === letanias.length) {
                clearInterval(intervalo);
                finalizarJuego(true);
            }
        }
    });
});


// Botón de Reset
btnReset.addEventListener('click', () => {
    // 1. Pedimos confirmación para no borrar por error
    if (confirm("¿Quieres reiniciar el progreso y volver a empezar?")) {

        // 2. Detenemos cualquier cronómetro que esté corriendo
        clearInterval(intervalo);

        // 3. Reseteamos variables lógicas
        aciertos = 0;
        tiempoRestante = 300; // 5 minutos (o el tiempo que prefieras)
        juegoIniciado = false;

        // 4. Limpiamos la interfaz visual
        input.disabled = false;     // Habilitamos el teclado
        input.value = '';           // Limpiamos lo que hubiera escrito
        checkTemporizador.disabled = false; // Dejamos elegir modo otra vez

        // Actualizamos el texto del contador de aciertos
        contadorText.innerText = `Aciertos: 0 / ${letanias.length}`;

        // 5. Devolvemos el reloj a su estado inicial según el checkbox
        if (checkTemporizador.checked) {
            actualizarReloj();
            relojDisplay.parentElement.classList.remove('tiempo-bajo');
        } else {
            relojDisplay.innerText = "Infinito";
        }

        // 6. ¡Lo más importante! Limpiamos todas las cajas de la tabla
        const todasLasCeldas = document.querySelectorAll('.celda');
        todasLasCeldas.forEach(celda => {
            celda.classList.remove('descubierta');
            celda.classList.remove('revelada');
        });

        // 7. Ponemos el cursor listo para escribir
        input.focus();

        console.log("Juego reseteado correctamente.");
    }
});

// Botón de Rendirse
btnRendirse.addEventListener('click', () => {
    // Solo permitimos rendirse si el juego ya ha empezado
    if (juegoIniciado && confirm("¿Quieres rendirte y ver las respuestas?")) {
        revelarRespuestasFaltantes();
    }
});
