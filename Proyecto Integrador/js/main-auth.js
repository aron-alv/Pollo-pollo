import { auth } from '../login/js/firebase-config.js'; 
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Función para actualizar la interfaz de usuario
const updateAuthUI = (user) => {
    const loginLink = document.getElementById('login-link');
    const userProfileInfo = document.getElementById('user-profile-info');
    const userAvatar = document.getElementById('user-avatar-placeholder');
    
    // Elementos del menú desplegable
    const profileDropdown = document.getElementById('profile-dropdown');
    const dropdownEmail = document.getElementById('dropdown-email');
    const dropdownWelcome = document.getElementById('dropdown-welcome');
    const manageAccountContainer = document.getElementById('manage-account-container'); // <-- NUEVA REFERENCIA
    const logoutBtn = document.getElementById('logout-btn');

    if (user) {
        // --- 1. USUARIO LOGUEADO: Mostrar avatar ---
        if (loginLink) loginLink.style.display = 'none';
        
        // CRÍTICO: Asegura que el contenedor del perfil se hace visible
        if (userProfileInfo) {
            userProfileInfo.style.display = 'flex'; 
        }

        // Rellenar la información del menú desplegable
        if (dropdownEmail) dropdownEmail.textContent = user.email || 'Usuario';
        
        // **Lógica mejorada para obtener y mostrar el nombre**
        let displayName = user.displayName;
        let displayInitial = 'H';
        
        if (user.displayName) {
            // Si hay nombre, usa el primer nombre y la inicial del nombre
            displayName = user.displayName.split(' ')[0];
            displayInitial = user.displayName[0].toUpperCase();
        } else if (user.email) {
            // Si NO hay nombre, usa la parte antes del @ y la inicial del correo
            displayName = user.email.split('@')[0];
            displayInitial = user.email[0].toUpperCase();
        } else {
            // Caso de respaldo total
            displayName = 'Usuario';
            displayInitial = 'H';
        }

        if (dropdownWelcome) dropdownWelcome.textContent = `¡Hola, ${displayName}!`;

        
        // Lógica del Avatar
        if (userAvatar) {
            if (user.photoURL) {
                // Si tiene foto, la mostramos
                userAvatar.innerHTML = `<img src="${user.photoURL}" alt="Perfil" style="width: 100%; height: 100%; border-radius: 50%;">`;
                userAvatar.style.backgroundColor = 'transparent'; 
            } else {
                // Si no tiene foto, usamos la inicial (garantizada por la lógica de arriba)
                userAvatar.innerHTML = displayInitial; // Usamos innerHTML para reemplazar cualquier contenido previo
                userAvatar.style.backgroundColor = '#008080'; // Color teal/verde
                // Opcional: Forzar estilos de texto que se pueden perder si el CSS falla
                userAvatar.style.color = 'white';
                userAvatar.style.fontSize = '18px';
            }

            // Evento para abrir el menú al hacer clic en el avatar
            userProfileInfo.onclick = (e) => {
                e.stopPropagation(); // Evita que el clic se propague al documento
                profileDropdown.classList.toggle('open');
            };
        }
        
        // =========================================================================
        // === NUEVA LÓGICA: Botón Gestionar Cuenta ===
        // =========================================================================
        if (manageAccountContainer) {
            // Limpiamos el contenedor primero (necesario en caso de onAuthStateChanged)
            manageAccountContainer.innerHTML = ''; 
            
            // Verificamos si la cuenta fue creada por Google (providerId: 'google.com')
            const isGoogleUser = user.providerData && user.providerData.some(p => p.providerId === 'google.com');

            if (isGoogleUser) {
                const manageButton = document.createElement('a');
                manageButton.href = "https://myaccount.google.com/"; 
                manageButton.target = "_blank"; // Abrir en nueva pestaña
                manageButton.textContent = "Gestionar cuenta de Google";
                manageButton.classList.add('btn-manage-account'); // Añadir la clase para el estilo
                manageAccountContainer.appendChild(manageButton);
            }
        }
        // =========================================================================


        // Evento para Cerrar Sesión
        if (logoutBtn) {
            logoutBtn.onclick = async () => {
                try {
                    await signOut(auth);
                    window.location.href = 'login/inicodesesion.html'; 
                } catch (error) {
                    console.error("Error al cerrar sesión:", error);
                }
            };
        }

    } else {
        // --- 2. USUARIO NO LOGUEADO: Mostrar botón de Login ---
        if (loginLink) loginLink.style.display = 'block';
        if (userProfileInfo) userProfileInfo.style.display = 'none';
        if (profileDropdown) profileDropdown.classList.remove('open');
        if (manageAccountContainer) manageAccountContainer.innerHTML = '';
    }
};


// 3. Ejecutar el Observador de Firebase y cerrar el menú al hacer clic fuera
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        updateAuthUI(user);
    });

    // Cierra el menú desplegable si se hace clic fuera de él
    document.addEventListener('click', (e) => {
        const profileDropdown = document.getElementById('profile-dropdown');
        const userProfileInfo = document.getElementById('user-profile-info');
        
        // Si el clic no fue dentro del menú ni en el avatar, ciérralo
        if (profileDropdown && !profileDropdown.contains(e.target) && (!userProfileInfo || !userProfileInfo.contains(e.target))) {
            profileDropdown.classList.remove('open');
        }
    });
});