$(document).ready(function(){  
  getUser() // Buscar idUsuario
    .then(saveUser) // Cargar el id del usuario
    .then(getFormState) // Buscar estado de los formularios
    .then(validateExams); // Deshabilitar formularios realizados
});


function getUser(){
  return jQuery.ajax({
    url: `http://${_DOMAIN_SERVICES}/autodiagnostico-rest-services/users/getuser/${sessionStorage.getItem('numeroDocumento')}`,
    crossDomain: true,
    method: 'GET'
  });
}

function saveUser(data){
  sessionStorage.setItem('idUsuario', data.data[0].iduser);
  sessionStorage.setItem('nombre', data.data[0].nombre);
  return true;
}

function getFormState(){
  return jQuery.ajax({
    url: `http://${_DOMAIN_SERVICES}/autodiagnostico-rest-services/formstservice/getformst/${sessionStorage.getItem('idUsuario')}`,
    crossDomain: true,
    method: 'GET'
  });
}

function validateExams(data){
  console.log(data);
  data.data.forEach(function(examen){
    if(examen.estado === "PENDIENTE_CERTIFICADO"){
      $(`#especialidad_${examen.idespecialidad}`).addClass('disabled');
    }
  });
}
