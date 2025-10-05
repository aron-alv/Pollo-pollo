// js/telefono-login.js
import { 
    RecaptchaVerifier, 
    signInWithPhoneNumber 
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { auth } from './firebase-config.js';
import { manageUserProfile } from './user-service.js';

let confirmationResult;

// Inicializar el reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    size: 'normal',
}, auth);

// Enviar el código SMS
document.getElementById('btnEnviarCodigo').addEventListener('click', async () => {
    const phoneNumber = document.getElementById('phoneNumber').value;

    if (!phoneNumber.startsWith('+')) {
        alert('Por favor ingresa tu número en formato internacional. Ejemplo: +52 1234567890');
        return;
    }

    try {
        confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
        alert('Código enviado. Revisa tu SMS.');
        document.getElementById('codigo-container').style.display = 'block';
    } catch (error) {
        console.error("Error al enviar código:", error);
        alert("No se pudo enviar el código. Verifica el número o el reCAPTCHA.");
    }
});

// Verificar el código
document.getElementById('btnVerificarCodigo').addEventListener('click', async () => {
    const codigo = document.getElementById('codigoVerificacion').value;
    try {
        const result = await confirmationResult.confirm(codigo);
        const user = result.user;
        await manageUserProfile(user);
        alert(`¡Bienvenido, ${user.phoneNumber}!`);
        window.location.href = '../PaginaWeb.html';
    } catch (error) {
        console.error("Error al verificar código:", error);
        alert("El código no es válido o ha expirado.");
    }
});
