$(document).ready(function(){

  // Consultar los tipos de documento
  jQuery.ajax({
    url: `http://${_DOMAIN_SERVICES}/autodiagnostico-rest-services/documentservice/getdocuments`,
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
      }); 
    }
  });

  // Almacenar informacion de sesion y guardar usuario
  $("#form-ingresar").on("submit", function(event){
    event.preventDefault();

    let docType = $('#tipo-documento').val();
    let documentNumber = $('#numero-documento').val();
    let name = $('#nombre').val();
    swal({
      title: 'Validar usuario',
      text: 'Recuerda que para algunas examenes puedes necesitar solicitar un cita.',
      icon: 'info',
      button:  {
        text: "Aceptar",
        closeModal: false,
      }
    })
      .then(existUser)
      .then(addUser)
      .then(result)
      .catch(serviceError);

    // agregar las variables de sesion
    sessionStorage.setItem('tipoDocumento', docType);
    sessionStorage.setItem('numeroDocumento', documentNumber);
    sessionStorage.setItem('nombre', name);
  });
});

// Consulta si el usuario existe
function existUser(){
  console.log('first()');
  let documentNumber = $('#numero-documento').val();
  let existUserURL = `http://${_DOMAIN_SERVICES}/autodiagnostico-rest-services/users/existuser/${documentNumber}`;
  return jQuery.ajax({
    url: existUserURL,
  });
}

// Si el usuario no existe lo crea
function addUser(data, textStatus, jqXHR){
  console.log('second()');
  console.log(data);
  if(data.response == 500){
    throw new Error('Ocurrio un error con los servicios.');
  }
  if(data.exist){
    return 'El usuario ya existe.'
  }
  let docType = $('#tipo-documento').val();
  let documentNumber = $('#numero-documento').val();
  let name = $('#nombre').val();
  let addUserURL = `http://${_DOMAIN_SERVICES}/autodiagnostico-rest-services/users/adduser`;
  let body = bodyRequestAddUser(docType, documentNumber, name);
  // Agregar usuario
  return jQuery.ajax({
    url: addUserURL,
    contentType: "application/json",
    method: "POST",
    crossOrigin: true,
    data: JSON.stringify(body)
  });
}

// Imprime en pantalla un mensaje de exito
function result(data, textStatus, jqXHR){
  console.log('third()');
  console.log(data);
  swal({
    title: 'Informacion almacenada con exito.',
    icon: 'success',
    buttons: false,
    timer: 2000
  })
  .then(function(){
    window.location.href = `http://${_LOCAL_DOMAIN}/modulo-examenes.html`;
  })
}

// En caso de error imprime un error
function serviceError(data, textStatus, jqXHR){
  console.log('fourth');
  console.log('Ocurrio un error con los servicios. Intente de nuevo en unos minutos.');
  swal({
    title: 'Ocurrio un error con los servicios.',
    text: 'Intente de nuevo mas tarde.',
    icon: 'error',
    button: 'Aceptar'
  });
}

// Crear el body para agregar usuario
function bodyRequestAddUser(docType, documentNumber, name){
  let json = {
    name: name,
    documentNumber: documentNumber,
    document: {
      idDocument: parseInt(docType,10)
    },
    userType: {
      idUserType: 2
    }
  };
  return json;
}