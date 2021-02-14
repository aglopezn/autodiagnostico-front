function validarLogin(){
  if(!sessionStorage.getItem('numeroDocumento')){
    window.location.href = 'http://localhost:8081/';
  }
}

validarLogin();