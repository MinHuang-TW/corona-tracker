import React, { useState, useEffect, useCallback, useRef } from 'react';
import MapGL, { FlyToInterpolator, Source, Layer } from 'react-map-gl';
import { color } from '../common/Chart/chartConfig';
import PopupContent from '../PopupContent/PopupContent';
import { useWindowWidth } from '../Hook';
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
  const windowWidth = useWindowWidth();

  const initial_viewport = {
    zoom: windowWidth < 450 ? 0 : 1.2,
    latitude: windowWidth < 450 ? 0 : 20,
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
    height: windowWidth < 600 ? '50vh' : '60vh',
    ...initial_viewport,
    ...animation,
  });

  const clusterLayer = {
    id: 'cluster-circle',
    paint: {
      'circle-color': color.confirmed,
      'circle-opacity': cluster.opacity,
      'circle-radius': clusterRadius,
      'circle-stroke-color': color.confirmed,
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
      ...animation,
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
      mapStyle='mapbox://styles/mapbox/dark-v10?optimize=true'
      interactiveLayerIds={[clusterLayer.id]}
      maxZoom={8}
      minZoom={windowWidth < 450 ? 0 : 1}
      onClick={handleClick}
      onViewportChange={(newViewport) => setViewport(newViewport)}
      style={{ zIndex: 3 }}
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