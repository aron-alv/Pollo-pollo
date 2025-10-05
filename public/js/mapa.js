/**
 * Esta función es llamada por la API de Google Maps cuando termina de cargar.
 * Crea un mapa oscuro centrado en el restaurante y también muestra la ubicación actual del usuario.
 */
function initMap() {

    // 1. Estilo oscuro
    const darkStyle = [
        { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
        { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
        { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
        { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
        { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
        { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] },
        { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
        { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
        { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
        { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
        { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
        { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
        { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
        { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
        { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
        { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] },
        { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
        { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
    ];

    // 2. Ubicación del restaurante
    const ubicacionRestaurante = { lat: 25.5650118, lng: -108.4610085 };

    // 3. Crear el mapa centrado en el restaurante
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: ubicacionRestaurante,
        mapTypeControl: false,
        streetViewControl: false,
        styles: darkStyle
    });

    // 4. Marcador del restaurante
    new google.maps.Marker({
        position: ubicacionRestaurante,
        map: map,
        title: "Pollo Express",
        icon: {
            url: "https://i.ibb.co/C06j9sY/restaurant-pin.png",
            scaledSize: new google.maps.Size(50, 50)
        }
    });

    // 5. Intentar obtener la ubicación actual del usuario
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Agregar marcador azul del usuario
                new google.maps.Marker({
                    position: userPos,
                    map: map,
                    title: "Tu ubicación",
                    icon: {
                        url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    }
                });

                // Centrar mapa en el usuario
                map.setCenter(userPos);
                map.setZoom(17);
            },
            (error) => {
                console.warn("Error al obtener ubicación:", error);
                alert("No se pudo obtener tu ubicación. Asegúrate de permitir el acceso.");
            }
        );
    } else {
        alert("Tu navegador no soporta la geolocalización.");
    }
}
