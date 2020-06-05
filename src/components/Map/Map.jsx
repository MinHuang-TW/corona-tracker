import React, { useState, useEffect, useCallback } from 'react';
import MapGL, { Marker, FlyToInterpolator } from 'react-map-gl';
import styles from './Map.module.css';

const Map = ({ selected_Country, handleCountry, countries, data }) => {
  const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
  const initial_viewport = { 
    zoom: 1.3, 
    latitude: 20,
    longitude: 15,
  };

  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '50vh',
    transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
    transitionDuration: 'auto',
    ...initial_viewport,
  });

  useEffect(() => {
    if (selected_Country) {
      if (selected_Country === 'Worldwide') {
        setViewport({ 
          ...viewport, 
          ...initial_viewport,
        });
      } else {
        const { lat, long } = countries.find(
          (country) => country.name === selected_Country
        );
        setViewport({
          ...viewport,
          zoom: 6,
          latitude: lat,
          longitude: long,
        });
      }
    }
    // eslint-disable-next-line
  }, [selected_Country]);

  const allCases = countries && countries.map(country => country.cases);
  const max = allCases.length && Math.max(...allCases);
  const interval = max && max / 350;

  const setSize = (number) => { 
    if (number === max) return 150;
    if (number) return 15 + Math.ceil(Number(number) / interval);
  };

  const handleClick = useCallback(name => event => {
    handleCountry(name);
  }, [handleCountry])

  return (
    <MapGL
      {...viewport}
      mapboxApiAccessToken={TOKEN}
      mapStyle='mapbox://styles/mapbox/dark-v10'
      // mapStyle='mapbox://styles/mapbox/light-v9'
      maxZoom={6}
      minZoom={1}
      onViewportChange={(viewport) => setViewport(viewport)}
    >
      {countries &&
        countries.map(({ name, lat, long, cases }) => (
          <Marker key={name} latitude={lat} longitude={long}>
            <div 
              className={styles.marker}
              style={{ 
                width: setSize(cases), 
                height: setSize(cases), 
                borderRadius: setSize(cases) / 2,
              }}
              onClick={handleClick(name)}
            >
              {/* <img src={flag} alt={name} width='20' /> */}
            </div>
          </Marker>
        ))}
    </MapGL>
  );
};

export default Map;
