import React, { useState, useEffect, useCallback, useRef } from 'react';
import MapGL, { FlyToInterpolator, Popup, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CloseIcon from '@material-ui/icons/Close';
import styles from './Map.module.css';

const PopupContent = ({ type, amount }) => (
  <div className={styles.popup_text}>
    <p>{type}</p>
    <strong>{amount.toLocaleString()}</strong>
  </div>
);

const Map = ({
  country,
  setCountry,
  countries,
  handleCountry,
  popupOpen,
  setPopupOpen,
  data,
}) => {
  const [clusterData, setClusterData] = useState(null);
  const sourceRef = useRef();

  const initial_viewport = {
    zoom: 1.3,
    latitude: 20,
    longitude: 15,
    bearing: 0,
    pitch: 0,
  };

  const animation = {
    transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
    transitionDuration: 'auto',
  };

  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '50vh',
    ...initial_viewport,
    ...animation,
  });

  const handleViewportChange = (updatedViewport) =>
    setViewport({ ...updatedViewport, ...animation });

  useEffect(() => {
    if (!country) setViewport({ ...viewport, ...initial_viewport });
    else setViewport({
      ...viewport,
      zoom: 5,
      latitude: country.lat,
      longitude: country.long,
    });
  }, [country]); // eslint-disable-line

  useEffect(() => {
    const features = countries && countries.map((country) => ({
      geometry: {
        coordinates: [country.long, country.lat],
        type: 'Point',
      },
      properties: country,
      type: 'Feature',
    }));
    setClusterData({
      features,
      type: 'FeatureCollection',
    });
  }, [countries])
  
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') setPopupOpen(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
    // eslint-disable-next-line
  }, []);

  const popupLists = [
    { type: 'Confirmed', amount: data.cases },
    { type: 'Recovered', amount: data.recovered },
    { type: 'Deaths', amount: data.deaths },
  ];

  let clusterOpacity = 0,
      clusterStrokeOpacity = 0;
  const { zoom } = viewport;
  if (zoom <= 1) clusterOpacity = 0.175;
  else if (zoom > 1 && zoom <= 2) {
    clusterOpacity = 0.3;
    clusterStrokeOpacity = 0.5;
  } else {
    clusterOpacity = 0.6;
    clusterStrokeOpacity = 1;
  }

  const clusterLayer = {
    id: 'cluster-circle',
    paint: {
      'circle-color': 'rgb(139, 0, 0)',
      'circle-opacity': clusterOpacity,
      'circle-radius': [
        'step',
        ['get', 'cases'],
        2.5,
        50,
        5,
        100,
        7.5,
        500,
        10,
        1000,
        12.5,
        2500,
        15,
        5000,
        16,
        10000,
        18,
        25000,
        20,
        50000,
        22,
        75000,
        24,
        100000,
        26,
        150000,
        28,
        200000,
        30,
        250000,
        32,
        300000,
        34,
        350000,
        36,
      ],
      'circle-stroke-color': 'rgb(139, 0, 0)',
      'circle-stroke-opacity': clusterStrokeOpacity,
      'circle-stroke-width': 1,
    },
    source: 'cluster-circle',
    type: 'circle',
  };

  // const setActiveStyle = (markerName) => (
  //   country && country.name === markerName ? styles.active : styles.marker
  // );

  const handleClick = useCallback((event) => {
    const unMarkedArea = !(event.hasOwnProperty('features') && event.features[0]);
    if (unMarkedArea) return;
    const { properties } = event.features[0];
    handleCountry(properties.name);
    setCountry(properties);
    setPopupOpen(true);
  }, []); // eslint-disable-line

  const handleClosePopup = useCallback(() => {
    setPopupOpen(false);
  }, []); // eslint-disable-line

  return (
    <MapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      mapStyle='mapbox://styles/min-huang/ckb2wh38l00aw1iph6kncjlx0'
      interactiveLayerIds={[clusterLayer.id]}
      maxZoom={8}
      minZoom={1}
      onClick={handleClick}
      onViewportChange={handleViewportChange}
    >
      <Source data={clusterData} ref={sourceRef} type='geojson'>
        <Layer {...clusterLayer} />
      </Source>

      {popupOpen && country && viewport.zoom > 4.5 && (
        <Popup
          className={styles.popup}
          latitude={country.lat}
          longitude={country.long}
          closeButton={false}
          onClick={handleClick}
          tipSize={6}
        >
          <div className={styles.popup_content}>            
            <img src={country.flag} alt={country.name} />
            <span className={styles.popup_title}>{country.name}</span>

            <CloseIcon
              className={styles.close}
              fontSize='small'
              onClick={handleClosePopup}
            />

            {popupLists.map((list) => (
              <PopupContent key={country.name + list.type} {...list} />
            ))}
          </div>
        </Popup>
      )}
    </MapGL>
  );
};

export default Map;