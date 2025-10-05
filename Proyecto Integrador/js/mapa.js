/**
 * Esta función es llamada por la API de Google Maps cuando termina de cargar.
 * Crea un mapa oscuro centrado en el restaurante y le pone un marcador.
 */
function initMap() {

    // 1. ESTILO DEL MODO OSCURO (obtenido de Snazzy Maps)
    const darkStyle = [
        { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
        { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
        { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#d59563" }]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#d59563" }]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{ "color": "#263c3f" }]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#6b9a76" }]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{ "color": "#38414e" }]
        },
        {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#212a37" }]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#9ca5b3" }]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{ "color": "#746855" }]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#1f2835" }]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#f3d19c" }]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{ "color": "#2f3948" }]
        },
        {
            "featureType": "transit.station",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#d59563" }]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#17263c" }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#515c6d" }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#17263c" }]
        }
    ];

    // 2. Coordenadas de tu restaurante "Pollo Express"
    const ubicacionRestaurante = { lat: 25.5650118, lng: -108.4610085 };

    // 3. Crea el mapa
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        center: ubicacionRestaurante,
        mapTypeControl: false,
        streetViewControl: false,
        styles: darkStyle // <-- AQUÍ APLICAMOS EL ESTILO OSCURO
    });

    // 4. Añade un marcador en la ubicación del restaurante
    new google.maps.Marker({
        position: ubicacionRestaurante,
        map: map,
        title: "Pollo Express",
        icon: {
            url: "https://i.ibb.co/C06j9sY/restaurant-pin.png", // Ícono de restaurante
            scaledSize: new google.maps.Size(50, 50)
        }
    });
}