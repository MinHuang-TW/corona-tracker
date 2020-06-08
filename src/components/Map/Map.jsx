import React, { useState, useEffect, useCallback, useRef } from 'react';
import MapGL, { FlyToInterpolator, Source, Layer } from 'react-map-gl';
import PopupContent from '../PopupContent/PopupContent';
import { radiusCluster } from './radiusCluster';

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
    zoom: 1.2,
    latitude: 20,
    longitude: 15,
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

  const { zoom } = viewport;
  let clusterOpacity = 0,
      clusterStrokeOpacity = 0;

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
      'circle-radius': radiusCluster,
      'circle-stroke-color': 'rgb(139, 0, 0)',
      'circle-stroke-opacity': clusterStrokeOpacity,
      'circle-stroke-width': 1,
    },
    source: 'cluster-circle',
    type: 'circle',
  };

  const handleViewportChange = (updatedViewport) =>
    setViewport({ ...updatedViewport, ...animation });

  const handleClick = useCallback((event) => {
    const unMarkedArea = !(
      event.hasOwnProperty('features') && event.features[0]
    );
    if (unMarkedArea) return;

    const { properties } = event.features[0];
    handleCountry(properties.name);
    setCountry(properties);
    setPopupOpen(true);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!country) setViewport({ ...viewport, ...initial_viewport });
    else
      setViewport({
        ...viewport,
        zoom: 5,
        latitude: country.lat,
        longitude: country.long,
      });
  }, [country]); // eslint-disable-line

  useEffect(() => {
    const features =
      countries &&
      countries.map((country) => ({
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
  }, [countries]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') setPopupOpen(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
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

      {popupOpen && (
        <PopupContent 
          country={country} 
          data={data} 
          onClick={handleClick}
          popupOpen={popupOpen}
          setPopupOpen={setPopupOpen} 
        />
      )}
    </MapGL>
  );
};

export default Map;