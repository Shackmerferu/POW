
console.log("¡El archivo app.js está enchufado!");

const pantallaLogin = document.getElementById('pantalla-login');
const pantallaSistema = document.getElementById('pantalla-sistema');





document.getElementById('btn-ingresar').addEventListener('click', () => {


    let user = document.getElementById('usuario').value;
    let pass = document.getElementById('clave').value;
    
    if (!user || !pass) {
   

        alert("Completá los campos por favor");
        

        return; 
       
    }

    fetch(`api/login.php?user=${user}&pass=${pass}`)
    

    .then(res => res.json())
    

    .then(datos => {
   
        if (datos.status === 200) {
       

            sessionStorage.setItem('miTokenVIP', datos.token);
            
            pantallaLogin.classList.add('d-none');
            
            pantallaSistema.classList.remove('d-none');
            
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });
});


document.getElementById('btn-ver-termos').addEventListener('click', () => {

    let tokenGuardado = sessionStorage.getItem('miTokenVIP');
   

    fetch('api/login.php?action=listar', {
    

        headers: {
        
            'Authorization': tokenGuardado
            
        }
    })
    .then(res => res.json())
    .then(datos => {
        if (datos.status === 200) {
            
            document.getElementById('resultados').innerHTML = "¡Exito!";
          
        } else {
            alert("No tenés permiso.");
        }
    });
});

document.getElementById('btn-salir').addEventListener('click', () => {

    sessionStorage.removeItem('miTokenVIP');
    

    document.getElementById('usuario').value = "";
    document.getElementById('clave').value = "";
    

    document.getElementById('resultados').innerHTML = ""; 
    

    pantallaSistema.classList.add('d-none');
    pantallaLogin.classList.remove('d-none');
    
});