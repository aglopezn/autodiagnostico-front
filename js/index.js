$(document).ready(function(){

  // Consultar los tipos de documento
  jQuery.ajax({
    url: "http://192.168.1.124:8080/autodiagnostico-rest-services/documentservice/getdocuments",
    crossDomain: true
  })
  .done(function(data){
    let tipoDocumentoSelect = $("#tipo-documento");
    let response = data.response;
    if(response==200){
      let tiposDocumento = data.data;
      tiposDocumento.forEach(function(documento){
        let option = "<option value="+documento.id+" class=\"bg-dark\">"+documento.value+"</option>";
        tipoDocumentoSelect.append(option); 
        // console.log("<option value="+documento.id+" class=\"bg-dark\">"+documento.value+"</option>");
      }); 
    }
  });

  // Almacenar informacion de sesion y guardar usuario
  $("#form-ingresar").on("submit", function(event){
    // Consultar si existe el usuario
    let docType = $('#tipo-documento').val();
    let documentNumber = $('#numero-documento').val();
    let name = $('#nombre').val();
    let existUserURL = `http://192.168.1.124:8080/autodiagnostico-rest-services/users/existuser/${documentNumber}`;
    let addUserURL = 'http://192.168.1.124:8080/autodiagnostico-rest-services/users/adduser';
    // Validar si el usuario existe
    jQuery.ajax({
      url: existUserURL,
    })
    .done(function(data){
      if(data.response==200){
        if(!data.exist){
          console.log(data);
          // Agregar usuario
          jQuery.ajax({
            url: addUserURL,
            contentType: "application/json",
            method: "POST",
            crossOrigin: true,
            data: JSON.stringify({
              "name": name,
              "documentNumber": documentNumber,
              "document": {
                "idDocument": parseInt(docType,10)
              },
              "userType": {
                "idUserType": 2
              }
            })
          })
          .done(function(data) {
            console.log(data);
          });
        } else {
          console.log("User already exists!")
          console.log(data);
        }

      }
    });

    // agregar las variables de sesion
    sessionStorage.setItem('tipoDocumento', docType);
    sessionStorage.setItem('numeroDocumento', documentNumber);
    sessionStorage.setItem('nombre', name);
    // continuar con el submit
    return true;
  });
});

// Funcion que verifica que el usuario ingresado exista
function existUser(documentNumber){
  let endpoint = `http://192.168.1.124:8080/autodiagnostico-rest-services/users/existuser/${documentNumber}`;
  let exist = false;
  jQuery.ajax({
    url: endpoint,
  })
  .done(function(data){
    if(data.response==200){
      return data.exist;
    }
  });
}

// Funcion que agrega un usuario
function addUser() {
  let idTipoDoc = $('#tipo-documento').val();
  let numDoc = $('#numero-documento').val();
  let nombre = $('#nombre').val();
  console.log(parseInt(idTipoDoc, 10));
  jQuery.ajax({
    url: "http://192.168.1.124:8080/autodiagnostico-rest-services/users/adduser",
    contentType: "application/json",
    method: "POST",
    data: {
      "name": nombre,
      "documentNumber": numDoc,
      "document": {
        "idDocument": parseInt(idTipoDoc, 10)
      },
      "userType": {
        "idUserType": 2
      }
    }
  })
  .done(function(data) {
    console.log(data);
  });
}
