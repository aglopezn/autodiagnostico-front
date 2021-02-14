$(document).ready(function(){
  // Cargar el id del usuario
  jQuery.ajax({
    url: `http://192.168.1.124:8080/autodiagnostico-rest-services/users/getuser/${sessionStorage.getItem('numeroDocumento')}`,
    crossDomain: true,
    method: 'GET'
  })
  .done(function(data){
    sessionStorage.setItem('idUsuario', data.data[0].iduser);
    sessionStorage.setItem('nombre', data.data[0].nombre);
  });

  // Determinar el estado de los examenes
  jQuery.ajax({
    url: `http://192.168.1.124:8080/autodiagnostico-rest-services/formstservice/getformst/${sessionStorage.getItem('idUsuario')}`,
    crossDomain: true,
    method: 'GET'
  })
  .done(function(data){
    console.log(data);
    data.data.forEach(function(examen){
      if(examen.estado === "PENDIENTE_CERTIFICADO"){
        $(`#especialidad_${examen.idespecialidad}`).addClass('disabled');
      }
    });
  });
});
