const letanias = [
    "Santa María", "Santa Madre de Dios", "Santa Virgen de las Vírgenes",
    "Madre de Cristo", "Madre de la Iglesia", "Madre de la divina gracia"
    // ... aquí añadirías las 52 o más
];

const contenedor = document.getElementById('tabla-contenedor');
const input = document.getElementById('input-letania');
const contadorText = document.getElementById('contador');
let aciertos = 0;

// Crear la tabla inicialmente
letanias.forEach((texto, index) => {
    const div = document.createElement('div');
    div.classList.add('celda');
    div.id = `letania-${index}`;
    div.innerText = texto;
    contenedor.appendChild(div);
});

// Escuchar lo que el usuario escribe
input.addEventListener('input', () => {
    const valor = input.value.trim().toLowerCase();
    
    letanias.forEach((letania, index) => {
        const celda = document.getElementById(`letania-${index}`);
        
        // Si coincide y no ha sido descubierta ya
        if (letania.toLowerCase() === valor && !celda.classList.contains('descubierta')) {
            celda.classList.add('descubierta');
            input.value = ''; // Limpiar el cuadro
            aciertos++;
            contadorText.innerText = `Aciertos: ${aciertos} / ${letanias.length}`;
        }
    });
});