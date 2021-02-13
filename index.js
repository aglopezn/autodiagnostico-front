$(document).ready(function(){

  // Consultar los tipos de documento
  jQuery.ajax({
    url: "http://192.168.1.124:8080/autodiagnostico-rest-services/documentservice/getdocuments"
  })
  .done(function(data){
    let tipoDocumentoSelect = $("#tipo-documento");
    let response = data[0].response;
    if(response==200){
      let tiposDocumento = data[1];
      tiposDocumento.forEach(function(documento){
        let option = "<option value="+documento.id+" class=\"bg-dark\">"+documento.value+"</option>";
        tipoDocumentoSelect.append(option); 
        // console.log("<option value="+documento.id+" class=\"bg-dark\">"+documento.value+"</option>");
      }); 
    }
  });

  // Almacenar informacion de sesion
  $("#form-ingresar").on("submit", function(event){
    //
    let documentNumber = $('#numero-documento').val();
    if(!existUser(documentNumber)){
      console.log("User does not exist. It'll be added.");
    }
    // agregar las variables de sesion
    sessionStorage.setItem('tipoDocumento', $('#tipo-documento').val());
    sessionStorage.setItem('numeroDocumento', $('#numero-documento').val());
    sessionStorage.setItem('nombre', $('#nombre').val());
    // continuar con el submit
    return true;
  });
});

// Funcion que verifica que el usuario ingresado exista
function existUser(documentNumber){
  let endpoint = `http://192.168.1.124:8080/autodiagnostico-rest-services/users/existuser/${documentNumber}`;
  let exist = false;
  jQuery.ajax({
    url: endpoint
  })
  .done(function(data){
    console.log(data);
    let response = data.response;
    if(response==200){
      exist = data.exist;
    }
  });
  return exist;
}
