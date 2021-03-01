$(document).ready(function(){
  jQuery.ajax({
    url: `http://${_DOMAIN_SERVICES}/autodiagnostico-rest-services/questionservice/getquestion/${_PSICOLOGIA}`
  })
  .done(function(data){
    if(data.response == 200){
      console.log(data);
      let form = $('#form-psicologia');
      data.data.forEach(question => {
        let opts= '<option class="bg-dark" value=""></option>';
        question.opciones.forEach(answerOp => {
          opts = opts + `<option class="bg-dark" value="${answerOp.idOption}">${answerOp.optionDesc}</option>`;
        });
        let input = `<div class="form-group"> 
          <select id="${question.idpreguntas}" class="form-control form-control_underline bg-transparent text-white shadow-none" required>
            ${opts}
          </select>
          <label for="${question.idpreguntas}" class="form-label_animate">${question.pregunta}</label>
          </div>`;
        form.append(input);
          // <input type="text" id="${question.idpreguntas}" class="form-control form-control_underline bg-transparent text-white shadow-none" required>
      });
      let button = '<button type="submit" class="btn btn-primary btn-block">Enviar</button>';
      form.append(button);
    }
  });

  // Enviar las respuestas
  $('#form-psicologia').on("submit", function(e){
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
    .then(getFormstate)
    .then(validateFormState)
    .then(addExamAnswers)
    .then(checkAnswersSaved)
    .then(setFormState)
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
        idUser: sessionStorage.getItem('idUsuario')
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
      idField: _PSICOLOGIA
    }
  };
  return json;
}

// Obtener el estado del formulario, si existe
function getFormstate(){
  let idUser = sessionStorage.getItem('idUsuario');
  return jQuery.ajax({
    url: `http://${_DOMAIN_SERVICES}/autodiagnostico-rest-services/formstservice/getformstfield/${idUser}/${_PSICOLOGIA}`,
    contentType: "application/json",
    method: "GET",
    crossOrigin: true
  });
}

// Validar el estado del formulario, solo se puede llenar una vez
function validateFormState(response){
  if (response.data.estado !== 'SIN_ESTADO'){
    throw new Error('El formulario ha sido realizado previamente. Solo se puede realizar una vez.');
  }
  return 'OK';
}

// Agregar las respuestas del examen
function addExamAnswers(){
  let questions = $('#form-optometria select');
  let body = bodyRequestAnswers(questions);
  // console.log(JSON.stringify(body));
  return jQuery.ajax({
    url: `http://${_DOMAIN_SERVICES}/autodiagnostico-rest-services/answersservice/addexam`,
    contentType: "application/json",
    method: "POST",
    crossOrigin: true,
    data: JSON.stringify(body)
  });
}

// Valida que las respuestas se hayan almacenado correctamente
function checkAnswersSaved(response){
  // console.log(response);
  response.data.forEach(function(resAnswer){
    if(resAnswer.response == 500){
      throw new Error('Ocurrio un error al agregar las respuestas.');
    }
  });
  return validateAnswers();
}


// Evalua la respuesta de las preguntas para determinar si aprueba o no el examen
function validateAnswers(){
  if ($('#5').val() !== '8' && $('#6').val() == '7' && $('#7').val() == '9'){
    return 'NO_APROBADO';
  }
  if ($('#6').val() == '8' && $('#7').val() == '10' && $('#9').val() == '15'){
    return 'APROBADO';
  }
  return 'PENDIENTE_CITA';

}

// Funcion que realiza la peticion para crear el estado del formulario
function setFormState(estado){
  let body = bodyRequestFormState(estado);
  console.log(JSON.stringify(body));
  jQuery.ajax({
    url: `http://${_DOMAIN_SERVICES}/autodiagnostico-rest-services/formstservice/setstate`,
    contentType: "application/json",
    method: "POST",
    crossOrigin: true,
    data: JSON.stringify(body)
  });
  return estado;
}

// Imprime en pantalla el resultado del examen
function result(estado){
  if (estado === 'NO_APROBADO'){
    notApprovedModal();
  }
  if (estado === 'APROBADO'){
    approvedModal();
  }
  if (estado === 'PENDIENTE_CITA'){
    appointmentModal();
  }
  
}

// Modal no aprobado
function notApprovedModal(){
  swal({
    title: 'No has aprobado el examen.',
    text: 'Contacta a tu empresa para más información.',
    icon: 'warning',
    button: 'Aceptar'
  })
  .then(function(){
    window.location.href = `http://${_LOCAL_DOMAIN}/modulo-examenes.html`;
  })
}

// Modal aprobado
function approvedModal(){
  swal({
    title: '¡Has aprobado el examen!',
    text: 'Descarga ahora tu certificado.',
    icon: 'success',
    button: 'Descargar certificado'
  })
  .then(function(){
    downloadPDF();
    window.location.href = `http://${_LOCAL_DOMAIN}/modulo-examenes.html`;
  })
}

// Modal cita médica
function appointmentModal(){
  swal({
    title: 'Debes agendar una cita médica.',
    text: 'Es necesario una valoración adicional. Solicita una cita médica al numero 555-1234',
    icon: 'info',
    button: 'Aceptar'
  })
  .then(function(){
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

// Descargar certificado
function downloadPDF(){
  window.open(`http://${_DOMAIN_SERVICES}/autodiagnostico-rest-services/certificateservice/getPdf/${sessionStorage.getItem('numeroDocumento')}/${_PSICOLOGIA}`, '_blank');
}