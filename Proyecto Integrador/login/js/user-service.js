// js/user-service.js

import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
// Importa la conexión a la base de datos desde tu archivo de configuración
import { db } from './firebase-config.js';

/**
 * Guarda o actualiza la información de un usuario en la colección 'usuarios' de Firestore.
 * @param {object} user - El objeto de usuario de Firebase Auth.
 */
export async function manageUserProfile(user) {
    const userRef = doc(db, "usuarios", user.uid);
    try {
        await setDoc(userRef, {
            nombre: user.displayName,
            correo: user.email,
            rol: "cliente"
        }, { merge: true });
      
    } catch (error) {
        console.error("Error al gestionar perfil de usuario en Firestore:", error);
    }
}