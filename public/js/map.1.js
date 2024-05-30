
    let maptoken=maptoken;
    console.log(maptoken);
    mapboxgl.accessToken=maptoken;
//	mapboxgl.accessToken = 'pk.eyJ1IjoiYXNoaXNoc3R1ZGVudCIsImEiOiJjbHdmYmVqcHIxbDl4MmtwYWhzNjhscGtmIn0.Jmk4coe0lV7e1acuBbSN-A';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: [77.209,28.6139], // starting position [lng, lat]
        zoom: 9 // starting zoom
    });
