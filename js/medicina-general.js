$(document).ready(function(){
  jQuery.ajax({
    url: `http://${_DOMAIN_SERVICES}/autodiagnostico-rest-services/questionservice/getquestion/${_MEDICINA_GENERAL}`
  })
  .done(function(data){
    if(data.response == 200){
      console.log(data);
      let form = $('#form-medicina-general');
      data.data.forEach(question => {
        let input = `<div class="form-group"> 
          <input type="text" id="${question.idpreguntas}" class="form-control form-control_underline bg-transparent text-white shadow-none" required>
          <label for="${question.idpreguntas}" class="form-label_animate">${question.pregunta}</label>
          </div>`;
        form.append(input);
      });
      let button = '<button type="submit" class="btn btn-primary btn-block">Enviar</button>';
      form.append(button);
    }
  });

  // Enviar las respuestas
  $('#form-medicina-general').on("submit", function(e){
    e.preventDefault();
    swal({
      title: 'Vamos a validar tu informacion.',
      text: '',
      icon: 'info',
      button:  {
        text: "Aceptar",
        closeModal: false,
      },
    })
    .then(addExamAnswers)
    .then(validateAnswers)
    .then(setFormState)
    .then(validateUpdate)
    .then(updateFormState)
    .then(result)
    .catch(serviceError);
  });

});

// Funcion para armar el json array con las respuestas del formulario
function bodyRequestAnswers(inputQuestions){
  let jsonArray = [];
  for(let i=0; i<inputQuestions.length; i++){
    let jsonTemp = {
      user: {
        idUser: 1
      },
      question: {
        idQuestion: parseInt(inputQuestions[i].id,10)
      },
      answerDesc: inputQuestions[i].value
    }
    jsonArray[i] = jsonTemp;
  }
  return jsonArray
}

// Funcion para crear el json con el estado del formulario
function bodyRequestFormState(estado){
  let json = {
    state: estado,
    user: {
      idUser: sessionStorage.getItem('idUsuario')
    },
    field: {
      idField: _MEDICINA_GENERAL
    }
  };
  return json;
}

// Agregar las respuestas del examen
function addExamAnswers(){
  let questions = $('#form-medicina-general input');
  let body = bodyRequestAnswers(questions);
  console.log(JSON.stringify(body));
  return jQuery.ajax({
    url: `http://${_DOMAIN_SERVICES}/autodiagnostico-rest-services/answersservice/addexam`,
    contentType: "application/json",
    method: "POST",
    crossOrigin: true,
    data: JSON.stringify(body)
  })
}

// Valida que las respuestas se hayan almacenado correctamente
function validateAnswers(response){
    console.log(response);
    response.data.forEach(function(resAnswer){
      if(resAnswer.response == 500){
        throw new Error('Ocurrio un error al agregar las respuestas.');
      }
    });
    return 'PENDIENTE_CERTIFICADO';
}

// Funcion que realiza la peticion para crear el estado del formulario
function setFormState(estado){
  let body = bodyRequestFormState(estado);
  console.log(JSON.stringify(body));
  return jQuery.ajax({
    url: `http://${_DOMAIN_SERVICES}/autodiagnostico-rest-services/formstservice/setstate`,
    contentType: "application/json",
    method: "POST",
    crossOrigin: true,
    data: JSON.stringify(body)
  })
}

// Funcion para validar si se debe actualizar el estado del formulario
function validateUpdate(response){
  console.log(response);
  if(response.response == 400){
    return 'PENDIENTE_CERTIFICADO';
  } 
  if(response.response == 200){
    return '200';
  }

}
// Funcion que realiza la peticion para actualizar el estado del formulario
function updateFormState(estado){
  console.log(estado);
  if(estado == '200'){
    return 'Completado con exito';
  }
  return jQuery.ajax({
    url: `http://${_DOMAIN_SERVICES}/autodiagnostico-rest-services/formstservice/updatestate/${sessionStorage.getItem('idUsuario')}/${estado}/${_MEDICINA_GENERAL}`,
    contentType: "application/json",
    method: "PUT",
    crossOrigin: true,
  })
}

// Imprime en pantalla un mensaje de exito
function result(data){
  console.log(data);
  swal({
    title: 'Informacion almacenada con exito.',
    icon: 'success',
    button: 'Descargar certificado'
    //buttons: false,
    //timer: 2000
  })
  .then(function(){
    downloadPDF();
    window.location.href = `http://${_LOCAL_DOMAIN}/modulo-examenes.html`;
  })
}

// En caso de error imprime un error
function serviceError(data, textStatus, jqXHR){
  swal({
    title: 'Ocurrio un error con los servicios.',
    text: 'Intente de nuevo mas tarde.',
    icon: 'error',
    button: 'Aceptar'
  })
  .then(function(){
    window.location.href = `http://${_LOCAL_DOMAIN}/modulo-examenes.html`;
  })
}

function downloadPDF(){
  window.open(`http://${_DOMAIN_SERVICES}/autodiagnostico-rest-services/certificateservice/getPdf/${sessionStorage.getItem('numeroDocumento')}/${_MEDICINA_GENERAL}`, '_blank');
}