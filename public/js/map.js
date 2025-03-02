// console.log(mapToken);
// console.log(listing.geometry.coordinates);
const coordinates = { lat: listing.geometry.coordinates[1] , lng: listing.geometry.coordinates[0] };

let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  // const { AdvancedMarkerElement } = await google.maps.importLibrary("marker"); //marker

  map = await new Map(document.getElementById("map"), {
    // center: { lat: 28.6139, lng: 77.2088 },
    center: coordinates,
    zoom: 15,
  });

  // const marker = new AdvancedMarkerElement({  // marker element
  //   map,
  //   position: coordinates,
  // });
}
initMap();

