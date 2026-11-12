const btnUsuario = document.getElementById("btnCanUsuario");
const menuUsuario = document.getElementById("menuusuario");

const usuarios = document.querySelectorAll(".usuario");

const btnVer = document.getElementById("btnVer");
const btnEditar = document.getElementById("btnEditar");
const btnEliminar = document.getElementById("btnEliminar");


btnUsuario.addEventListener("click", function() {

    if (menuUsuario.style.display === "none") {
        menuUsuario.style.display = "grid";
    } else {
        menuUsuario.style.display = "none";
    }

});

// Seleccionar usuario
usuarios.forEach(usuario => {

    usuario.addEventListener("click", function() {

        const nombre = usuario.querySelector(".nomUsuario").textContent;
        const rol = usuario.querySelector(".rolUsuario").textContent;

        // Actualizar encabezado
        btnUsuario.querySelector("h3").textContent = nombre;
        btnUsuario.querySelector("p").textContent = rol;

        // Ocultar todos los botones
        btnVer.hidden = true;
        btnEditar.hidden = true;
        btnEliminar.hidden = true;

        // Comprobar permisos
        switch (rol.trim()) {

            case "Administrador":
                btnVer.hidden = false;
                btnEditar.hidden = false;
                btnEliminar.hidden = false;
                break;

            case "Editor":
                btnVer.hidden = false;
                btnEditar.hidden = false;
                break;

            case "Consulta":
                btnVer.hidden = false;
                break;

        }

        // Cerrar menu
        menuUsuario.style.display = "none";

        // Guardar rol
        sessionStorage.setItem("rol", rol.trim());

    });

});