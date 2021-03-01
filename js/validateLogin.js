function validarLogin(){
  if(!sessionStorage.getItem('numeroDocumento')){
    window.location.href = `http://${_LOCAL_DOMAIN}/`;
  }
}

validarLogin();