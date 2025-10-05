// js/verificar-codigo.js

// 1. Importamos las funciones necesarias, incluyendo PhoneAuthProvider
import { 
    PhoneAuthProvider,
    signInWithCredential
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
// Asegúrate de que las rutas a tus archivos de config sean correctas
import { auth } from './firebase-config.js'; 
import { manageUserProfile } from './user-service.js';

const form = document.getElementById('formVerificar');
const inputs = document.querySelectorAll('.code-input');

// 2. Listener del formulario para verificar el código
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitamos que la página se recargue

    // Juntamos el código de los 6 inputs
    let codigo = '';
    inputs.forEach(input => {
        codigo += input.value;
    });

    if (codigo.length !== 6) {
        alert("Por favor, ingresa los 6 dígitos del código.");
        return;
    }

    // ✅ SOLUCIÓN: Recuperamos el ID de verificación que guardamos
    const verificationId = sessionStorage.getItem('verificationId');

    if (!verificationId) {
        alert("Error de sesión. Por favor, vuelve a la página anterior e intenta de nuevo.");
        return;
    }

    // Creamos la credencial con el ID y el código del usuario
    const credential = PhoneAuthProvider.credential(verificationId, codigo);

    try {
        // Autenticamos al usuario con la credencial
        const result = await signInWithCredential(auth, credential);
        const user = result.user;

        console.log("Usuario autenticado con teléfono:", user.phoneNumber);

        // Usamos tu función para gestionar el perfil
        await manageUserProfile(user);

        alert(`¡Bienvenido!`);
        window.location.href = '../PaginaWeb.html'; // Lo redirigimos a la página principal

    } catch (error) {
        console.error("Error al verificar el código:", error);
        alert("El código no es válido o ha expirado. Intenta de nuevo.");
    }
});

// Lógica para auto-focus entre los inputs (la misma de antes)
inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' && input.value.length === 0 && index > 0) {
            inputs[index - 1].focus();
        }
    });
});