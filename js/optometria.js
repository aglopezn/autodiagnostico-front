$(document).ready(function(){
  // Consultar las preguntas de optometria
  jQuery.ajax({
    url: 'http://192.168.1.124:8080/autodiagnostico-rest-services/questionservice/getquestion/1'
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
    e.preventDefault();
    let questions = $('#form-optometria input');
    let data = [];
    
    // Llenar el array data
    for(let i=0; i<questions.length; i++){
      let jsonTemp = {
        user: {
          idUser: 1
        },
        question: {
          idQuestion: parseInt(questions[i].id,10)
        },
        answerDesc: questions[i].value
      }
      data[i] = jsonTemp;
    }

    console.log(JSON.stringify(data));
    jQuery.ajax({
      url: "http://192.168.1.124:8080/autodiagnostico-rest-services/answersservice/addexam",
      contentType: "application/json",
      method: "POST",
      crossOrigin: true,
      data: JSON.stringify(data)
    })
    .done(function(response){
      console.log(response);
    })

    return false;
  });

});