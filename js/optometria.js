$(document).ready(function(){
  jQuery.ajax({
    url: `http://${_DOMAIN_SERVICES}/autodiagnostico-rest-services/questionservice/getquestion/1`
  })
  .done(function(data){
    if(data.response == 200){
      console.log(data);
      let form = $('#form-optometria');
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
  $('#form-optometria').on("submit", function(e){
    let questions = $('#form-optometria input');
    let body = bodyRequestAnswers(questions);
    console.log(JSON.stringify(body));
    // Hacer la peticion ajax
    jQuery.ajax({
      url: `http://${_DOMAIN_SERVICES}/autodiagnostico-rest-services/answersservice/addexam`,
      contentType: "application/json",
      method: "POST",
      crossOrigin: true,
      data: JSON.stringify(body)
    })
    .done(function(response){
      console.log(response);
      let error = false;
      response.data.forEach(function(resAnswer){
        if(resAnswer.response == 500){
          error = true;
        }
      });
      if(!error){
        setFormState('PENDIENTE_CERTIFICADO');
      }
    })

    return false;
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
      idField: 1
    }
  };
  return json;
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
  })
  .done(function(response){
    console.log(response);
    if(response.response == 400){
      updateFormState(estado);
    }
  });
}
// Funcion que realiza la peticion para actualizar el estado del formulario

function updateFormState(estado){
  jQuery.ajax({
    url: `http://${_DOMAIN_SERVICES}/autodiagnostico-rest-services/formstservice/updatestate/${sessionStorage.getItem('idUsuario')}/${estado}/1`,
    contentType: "application/json",
    method: "PUT",
    crossOrigin: true,
  })
  .done(function(response){
    console.log(response);
  });
}