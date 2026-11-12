
//alert("funciona");

const nuevadireccionIP = document.getElementById("agreDireccionIP");
const nuevoPuerto = document.getElementById("agrePuerto");
const tipoRegla = document.getElementById("permisoRegla");
const agreRegla = document.getElementById("agregarRegla");
const cuerpoTablaRR = document.getElementById("cuerpoTablaRR");
const cuerpoTablaHA = document.getElementById("cuerpoTablaHA");

const compdireccionIP = document.getElementById("compDireccionIP");
const compPuerto = document.getElementById("compPuerto");
const validadAcceso = document.getElementById("validadAcceso");
const tipoacceso = document.getElementById("tipoacceso");

let regla = [];
let id = 1;

// Colocar puntos automaticamente a la IP
function colocarPuntos(ip) {
    const numeros = ip.replace(/\D/g, "").slice(0, 12);
    const bloques = [];

    for (let i = 0; i < numeros.length; i += 3) {
        bloques.push(numeros.slice(i, i + 3));
    }

    return bloques.join(".");
}

// Agregar puntos automaticamente al escribir
nuevadireccionIP.addEventListener("input", function () {
    nuevadireccionIP.value = colocarPuntos(nuevadireccionIP.value);
});

compdireccionIP.addEventListener("input", function () {
    compdireccionIP.value = colocarPuntos(compdireccionIP.value);
});

// Validar formato de direccion IP
function validarIP(ip) {
    let partes = ip.split(".");

    if (partes.length !== 4) {
        return false;
    }

    for (let parte of partes) {
        if (parte === "" || !/^\d+$/.test(parte)) {
            return false;
        }
    }

    return true;
}

// Validar puerto
function validarPuerto(puerto) {
    return /^\d{4}$/.test(puerto.trim());
}

// Validar campos para agregar una regla
agreRegla.addEventListener("click", function () {
    let nuevaIP = nuevadireccionIP.value.trim();
    let nuevoP = Number(nuevoPuerto.value);
    let reglaSeleccionada = tipoRegla.value;

    // Validar IP vacia
    if (nuevaIP === "") {
        alert("ERROR: Introduzca una direccion IP. Ejemplo: 192.168.1.10");
        return;
    }

    // Validar formato de IP
    if (!validarIP(nuevaIP)) {
        alert("ERROR: Escriba cuatro bloques de numeros separados por puntos. Ejemplo: 123.456.632.111.");
        return;
    }

    // Validar puerto
    if (!validarPuerto(nuevoPuerto.value)) {
        alert("ERROR: El puerto debe contener exactamente 4 digitos. Ejemplo: 0443, HTTPS usa el puerto 443.");
        return;
    }

    // Validar accion seleccionada
    if (reglaSeleccionada === "") {
        alert("ERROR: Seleccione una accion para la regla: permitir o bloquear.");
        return;
    }

    if (reglaSeleccionada !== "permitir" && reglaSeleccionada !== "bloquear") {
        alert("ERROR: La accion seleccionada no es valida.");
        return;
    }

    // Evitar reglas duplicadas
    for (let i = 0; i < regla.length; i++) {
        if (
            regla[i].direccionip === nuevaIP &&
            regla[i].puerto === nuevoP
        ) {
            alert("ERROR: Ya existe una regla registrada con esta misma direccion IP y puerto.");
            return;
        }
    }

    // Crear nueva regla
    const datos = {
        id: id,
        direccionip: nuevaIP,
        puerto: nuevoP,
        tipo: reglaSeleccionada
    };

    regla.push(datos);

    // Actualizar tabla de reglas registradas
    cuerpoTablaRR.innerHTML = "";

    regla.forEach(function (item) {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${item.id}</td>
            <td>${item.direccionip}</td>
            <td>${item.puerto}</td>
            <td>${item.tipo}</td>
        `;

        cuerpoTablaRR.appendChild(fila);
    });

    id++;

    // Mostrar datos del Array
    let infoarray = "Datos del Array:\n";

    regla.forEach(function (item) {
        infoarray += `ID: ${item.id} | IP: ${item.direccionip} | Puerto: ${item.puerto} | Tipo: ${item.tipo}\n`;
    });

    alert(infoarray);

    // Limpiar campos
    nuevadireccionIP.value = "";
    nuevoPuerto.value = "";
    tipoRegla.value = "";
});


// Validar acceso
validadAcceso.addEventListener("click", function () {
    let compIP = compdireccionIP.value.trim();
    let compP = Number(compPuerto.value);

    // Validar IP vacia
    if (compIP === "") {
        alert("ERROR: Introduzca una direccion IP. Ejemplo: 192.168.1.10");
        return;
    }

    // Validar formato de IP
    if (!validarIP(compIP)) {
        alert("ERROR: Escriba cuatro bloques de numeros separados por puntos. Ejemplo: 123.456.632.111.");
        return;
    }

    // Validar puerto
    if (!validarPuerto(compPuerto.value)) {
        alert("ERROR: El puerto debe contener exactamente 4 digitos. Ejemplo: 0443, HTTPS usa el puerto 443.");
        return;
    }

    // Buscar coincidencia en el Array
    let infoarray = "Datos del Array:\n";
    let encontrado = false;
    let resultado = "Bloqueado";
    let idRegla = "-";

    for (let j = 0; j < regla.length; j++) {
        if (
            compIP === regla[j].direccionip &&
            compP === regla[j].puerto
        ) {
            infoarray += `ID: ${regla[j].id} | IP: ${regla[j].direccionip} | Puerto: ${regla[j].puerto} | Tipo: ${regla[j].tipo}\n`;

            encontrado = true;
            idRegla = regla[j].id;

            if (regla[j].tipo === "permitir") {
                resultado = "Permitido";
            } else {
                resultado = "Bloqueado";
            }

            break; // si se encuentra para
        }
    }

    // Mostrar resultado de la busqueda
    if (encontrado) {
        alert(infoarray);
    } else {
        alert("No existe una regla registrada para esta combinacion exacta de IP y puerto. El acceso quedara bloqueado.");
    }

    // Estado del acceso
    if (resultado === "Permitido") {
        tipoacceso.textContent = "Activo";
    } else {
        tipoacceso.textContent = "Bloqueado";
    }

    // Registrar historial de acceso
    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${idRegla}</td>
        <td>${compIP}</td>
        <td>${compP}</td>
        <td>${resultado}</td>
    `;

    cuerpoTablaHA.appendChild(fila);
});
