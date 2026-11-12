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

// Validar formato de direccion IP
function validarIP(ip) {
    let partes = ip.split(".");
    if (partes.length !== 4) {
        return false;
    }

    for (let parte of partes) {
        if (
            parte === "" ||
            !/^\d+$/.test(parte) ||
            Number(parte) > 255
        ) {
            return false;
        }
    }

    return true;
}

// Validar puerto
function validarPuerto(puerto) {
    let numero = Number(puerto);
    return (
        puerto.trim() !== "" &&
        Number.isInteger(numero) &&
        numero >= 1 &&
        numero <= 65535
    );
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
        alert("ERROR: La direccion IP no es valida. Debe contener cuatro bloques numericos entre 0 y 255, separados por puntos.");
        return;
    }

    // Validar puerto
    if (!validarPuerto(nuevoPuerto.value)) {
        alert("ERROR: Introduzca un puerto valido entre 1 y 65535. Ejemplo: 8080");
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
        alert("ERROR: La direccion IP no tiene un formato IPv4 valido. Utilice el formato: 192.168.1.10");
        return;
    }

    // Validar puerto
    if (!validarPuerto(compPuerto.value)) {
        alert("ERROR: Introduzca un puerto valido entre 1 y 65535. Ejemplo: 8080");
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
        alert("ERROR: No existe una regla registrada para esta combinacion exacta de IP y puerto.");
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
