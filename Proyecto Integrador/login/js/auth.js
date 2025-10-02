// js/auth.js

import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
// Importa el servicio de autenticación desde tu archivo de configuración
import { auth } from './firebase-config.js';
// Importa la función para gestionar perfiles desde el servicio de usuario
import { manageUserProfile } from './user-service.js';

/**
 * Inicia el proceso de login con la ventana emergente de Google.
 * @returns {Promise<object>} El objeto del usuario si el login es exitoso.
 */
async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("Error en signInWithGoogle:", error);
        throw new Error("No se pudo iniciar sesión con Google.");
    }
}

// Lógica Principal (Event Listener)
document.addEventListener('DOMContentLoaded', () => {
    const googleButton = document.getElementById('btnGoogleLogin');

    if (googleButton) {
        googleButton.addEventListener('click', async () => {
            try {
                // 1. Autentica al usuario
                const user = await signInWithGoogle();
                console.log("¡Usuario autenticado!", user.displayName);

                // 2. Llama a la función externa para guardar sus datos
                await manageUserProfile(user);

                alert(`¡Bienvenido, ${user.displayName}!`);
                // Redirigir al usuario si es necesario
                 window.location.href = '../PaginaWeb.html';

            } catch (error) {
                alert(error.message);
            }
        });
    }
});