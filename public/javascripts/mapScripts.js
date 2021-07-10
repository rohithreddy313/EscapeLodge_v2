mapboxgl.accessToken = 'pk.eyJ1Ijoicm9oaXRocmVkZHkzMTMiLCJhIjoiY2txczNlZTE4MDgwODJvcW1qNmZlOWtuNSJ9.yv7cs_ruif97JvrYRiPF0A';
    const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v11', 
    center: found.geometry.coordinates, 
    zoom: 9 
    });

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');
const marker = new mapboxgl.Marker()
    .setLngLat(found.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${found.title}</h3><p>${found.location}</p>`
            )
    )
    .addTo(map);