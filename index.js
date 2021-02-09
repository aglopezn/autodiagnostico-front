$(document).ready(function(){

    // Almacenar informacion de sesion
    $("#form-ingresar").on("submit", function(event){
        // agregar las variables de sesion
        sessionStorage.setItem('tipoDocumento', $('#tipo-documento').val());
        sessionStorage.setItem('numeroDocumento', $('#numero-documento').val());
        sessionStorage.setItem('nombre', $('#nombre').val());
        // continuar con el submit
        return true;
    });
});

// FUNCTIONS
