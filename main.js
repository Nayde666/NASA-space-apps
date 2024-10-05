import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { GeoJSON } from 'ol/format';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

const firebaseConfig = {
  apiKey: "AIzaSyCvasWpI3ygCdzLFqll1ArzhTYj959FJMc",
  authDomain: "rig---space-apps.firebaseapp.com",
  databaseURL: "https://rig---space-apps-default-rtdb.firebaseio.com/",
  projectId: "rig---space-apps",
  storageBucket: "rig---space-apps.appspot.com",
  messagingSenderId: "561752433139",
  appId: "1:561752433139:web:f30ec85f56bedfdcd3b286"
};

// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// Crear el mapa
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    new VectorLayer({
      source: new VectorSource({
        url: 'gto.geojson',
        format: new GeoJSON(),
      }),
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.5)', //relleno
        }),
        stroke: new Stroke({
          color: '#ffcc33', //borde
          width: 2,
        }),
      }),
    }),
  ],
  view: new View({
    center: fromLonLat([-101.2529, 21.019]),
    zoom: 8.5,
  }),
});

// click en el mapa
map.on('singleclick', function (evt) {
  const coordinates = evt.coordinate;
  const lonLat = fromLonLat(coordinates);
  document.getElementById('coordinatesText').innerText = `Coordenadas: ${lonLat[0].toFixed(6)}, ${lonLat[1].toFixed(6)}`;
  
  // Mostrar el modal
  $('#coordModal').modal('show');
});

document.getElementById('saveCoordinatesBtn').addEventListener('click', () => {
  // obtener coordenadas desde el texto mostrado en el modal
  const coordinatesText = document.getElementById('coordinatesText').innerText;
  const description = document.getElementById('problemDescription').value;

  // procesar
  const coords = coordinatesText.match(/(-?\d+\.\d+)/g); // eextraer los números
  const latitude = coords ? parseFloat(coords[1]) : null;
  const longitude = coords ? parseFloat(coords[0]) : null;

  // guarda
  set(ref(db, 'reports/' + Date.now()), {
    latitude: latitude,
    longitude: longitude,
    description: description,
  }).then(() => {
    console.log('Datos guardados exitosamente');
    $('#coordModal').modal('hide');
    document.getElementById('problemDescription').value = '';
  }).catch((error) => {
    console.error('Error al guardar los datos: ', error);
  });
});
