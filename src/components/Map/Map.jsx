import React, { useState, useEffect, useCallback, useRef } from 'react';
import MapGL, { FlyToInterpolator, Source, Layer } from 'react-map-gl';
import PopupContent from '../PopupContent/PopupContent';
import { clusterRadius, setOpacity } from './clusterStyle';

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
  const [cluster, setCluster] = useState({
    opacity: 0,
    strokeOpacity: 0,
  });
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

  const clusterLayer = {
    id: 'cluster-circle',
    paint: {
      'circle-color': 'rgb(139, 0, 0)',
      'circle-opacity': cluster.opacity,
      'circle-radius': clusterRadius,
      'circle-stroke-color': 'rgb(139, 0, 0)',
      'circle-stroke-opacity': cluster.strokeOpacity,
      'circle-stroke-width': 1,
    },
    source: 'cluster-circle',
    type: 'circle',
  };

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
    setCluster(setOpacity(viewport.zoom));
  }, [viewport.zoom]);

  useEffect(() => {
    if (!country || country.name === 'Worldwide') 
      setViewport({ ...viewport, ...initial_viewport });
    else setViewport({
      ...viewport,
      zoom: 5,
      latitude: country.lat,
      longitude: country.long,
    });
  }, [country]); // eslint-disable-line

  useEffect(() => {
    const features = countries && countries
      .filter(({ name }) => name !== 'Worldwide')
      .map((country) => ({
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
      mapStyle='mapbox://styles/mapbox/dark-v10'
      // mapStyle='mapbox://styles/min-huang/ckb2wh38l00aw1iph6kncjlx0'
      interactiveLayerIds={[clusterLayer.id]}
      maxZoom={8}
      minZoom={1}
      onClick={handleClick}
      onViewportChange={(newViewport) => setViewport({ 
        ...newViewport, 
        ...animation, 
      })}
    >
      <Source ref={sourceRef} data={clusterData} type='geojson'>
        <Layer {...clusterLayer} />
      </Source>

      {popupOpen && country.name !== 'Worldwide' && (
        <PopupContent 
          country={country} 
          data={data} 
          onClick={handleClick}
          setPopupOpen={setPopupOpen} 
        />
      )}
    </MapGL>
  );
};

export default Map;