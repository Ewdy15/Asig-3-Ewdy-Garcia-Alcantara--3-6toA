
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

validadAcceso.addEventListener("click", function(){
    let compIP = compdireccionIP.value.trim();
    let compP = Number(compPuerto.value);

    if (!validarIP(compIP) || compPuerto.value.trim() === "" || !Number.isInteger(compP) || compP < 1 || compP > 65535) {
        alert("ERROR: Complete todos los campos correctamente.");
        return;
    }

    //alert("Dstos:"+compIP + ""+ compP);

    let infoarray = "Datos del Array:\n";
    let encontrado = false;
    let resultado = "Bloqueado";
    let tipo = "Sin regla";
    let idRegla = "-";//id encontrado

    for(let j = 0; j < regla.length; j++){
        if(compIP === regla[j].direccionip && compP === regla[j].puerto){
            infoarray += `ID: ${regla[j].id} | IP: ${regla[j].direccionip} | Puerto: ${regla[j].puerto} | Tipo: ${regla[j].tipo}\n`;

            encontrado = true;
            tipo = regla[j].tipo;
            idRegla = regla[j].id;

            if (regla[j].tipo === "permitir"){
                resultado = "Permitido";
            }
            else{
                resultado = "Bloqueado";
            }

            break;// si se encuentra para
        }
    }

    if(encontrado){// si es true
        alert(infoarray);
    }
    else{
        alert("ERROR:No se encontraron esos datos.");
    }

    //estado de la regla
    if(resultado === "Permitido"){
        tipoacceso.textContent = "Activo";
    }
    else{
        tipoacceso.textContent = "Bloqueado";
    }

    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${idRegla}</td>
        <td>${compIP}</td>
        <td>${compP}</td>
        <td>${resultado}</td>
    `;

    cuerpoTablaHA.appendChild(fila);
});


agreRegla.addEventListener("click", function(){

    let nuevaIP = nuevadireccionIP.value.trim();
    let nuevoP = Number(nuevoPuerto.value);
    let reglaSeleccionada = tipoRegla.value;

    if(!validarIP(nuevaIP) || nuevoPuerto.value.trim() === "" || !Number.isInteger(nuevoP) || nuevoP < 1 || nuevoP > 65535 || reglaSeleccionada === ""){
        alert("ERROR: Complete todos los campos correctamente.");
        return;
    }

    // Accion
    if(reglaSeleccionada !== "permitir" && reglaSeleccionada !== "bloquear"){
        alert("ERROR: Seleccione una acción válida.");
        return;
    }

    for (let i = 0; i < regla.length; i++) {
        if(regla[i].direccionip === nuevaIP && regla[i].puerto === nuevoP){
            alert("ERROR: Esta IP y puerto ya están registrados.");
            return;
        }
    }

    const datos = {
        id: id,
        direccionip: nuevaIP,
        puerto: nuevoP,
        tipo: reglaSeleccionada
    };

    regla.push(datos);
    cuerpoTablaRR.innerHTML = "";

    regla.forEach(function(item){
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

    let infoarray = "Datos del Array:\n";

    regla.forEach(function(item){//el Foreach recorre todo el infoarray hasta quese gaste
        infoarray += `ID: ${item.id} | IP: ${item.direccionip} | Puerto: ${item.puerto} | Tipo: ${item.tipo}\n`;
    });

    alert(infoarray);

    nuevadireccionIP.value = "";
    nuevoPuerto.value = "";
    tipoRegla.value = "";
});
