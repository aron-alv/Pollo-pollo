// js/auth.js

// 1. IMPORTAMOS solo las funciones que realmente necesitamos de Firebase
import { 
    GoogleAuthProvider, 
    FacebookAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { auth } from '../../../public/login/js/firebase-config.js';
import { manageUserProfile } from '../../../public/login/js/user-service.js';

// Función para detectar si estamos en un dispositivo móvil
function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// Este bloque de código es CRUCIAL. Se ejecuta cada vez que la página carga
// y "atrapa" al usuario cuando regresa de la página de Google o Facebook.
getRedirectResult(auth)
    .then(async (result) => {
        if (result) {
            // Si 'result' existe, significa que el usuario acaba de iniciar sesión.
            const user = result.user;
            console.log("Usuario autenticado por redirección:", user.displayName);
            
            await manageUserProfile(user);
            alert(`¡Bienvenido, ${user.displayName}!`);
            window.location.href = '../PaginaWeb.html'; // Lo redirigimos a la página principal
        }
    }).catch((error) => {
        console.error("Error en getRedirectResult:", error);
        alert("Hubo un problema al procesar el inicio de sesión.");
    });


// --- LÓGICA PRINCIPAL (EVENT LISTENERS) ---
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Botón de Google ---
    const googleButton = document.getElementById('btnGoogleLogin');
    if (googleButton) {
        googleButton.addEventListener('click', async () => {
            const provider = new GoogleAuthProvider();
            if (isMobile()) {
                // En móvil, usamos la redirección
                await signInWithRedirect(auth, provider);
            } else {
                // En computadora, usamos el pop-up
                try {
                    const result = await signInWithPopup(auth, provider);
                    const user = result.user;
                    await manageUserProfile(user);
                    alert(`¡Bienvenido, ${user.displayName}!`);
                    window.location.href = '../PaginaWeb.html';
                } catch (error) {
                    console.error("Error con Google (popup):", error);
                    alert(error.message);
                }
            }
        });
    }

  
    const facebookButton = document.getElementById('btnFacebookLogin');
    if (facebookButton) {
        facebookButton.addEventListener('click', async () => {
            const provider = new FacebookAuthProvider();
            if (isMobile()) {
              
                await signInWithRedirect(auth, provider);
            } else {
                // En computadora, usamos el pop-up
                try {
                    const result = await signInWithPopup(auth, provider);
                    const user = result.user;
                    await manageUserProfile(user);
                    alert(`¡Bienvenido, ${user.displayName}!`);
                    window.location.href = '../PaginaWeb.html';
                } catch (error) {
                    console.error("Error con Facebook (popup):", error);
                    alert("No se pudo iniciar sesión con Facebook. Es posible que hayas cerrado la ventana emergente.");
                }
            }
        });
    }
  
const telefonoButton = document.getElementById('btnTelefonoLogin');
if (telefonoButton) {
    telefonoButton.addEventListener('click', () => {
        window.location.href = './TelefonoLogin.html';
    });
}

});