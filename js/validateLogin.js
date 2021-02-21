function validarLogin(){
  if(!sessionStorage.getItem('numeroDocumento')){
    window.location.href = `http://${_LOCAL_DOMAIN}:8081/`;
  }
}

validarLogin();