import React, { useState, useEffect, useCallback } from 'react';
import MapGL, { Marker, FlyToInterpolator } from 'react-map-gl';
import styles from './Map.module.css';

const Map = ({ selected_Country, setCountry, handleCountry, countries, setIcon }) => {
  const initial_viewport = { 
    zoom: 1.3, 
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

  const handleClick = useCallback((name, flag) => event => {
    handleCountry(name);
    setCountry(name);
    setIcon(flag);
    // eslint-disable-next-line
  }, [])

  return (
    <MapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      mapStyle='mapbox://styles/min-huang/ckb2wh38l00aw1iph6kncjlx0'
      // maxZoom={6}
      minZoom={1}
      onViewportChange={viewport => setViewport({ ...viewport, ...animation })}
    >
      {countries &&
        countries.map(({ name, lat, long, cases, flag }) => (
          <Marker key={name} latitude={lat} longitude={long}>
            <div 
              className={styles.marker}
              style={{ width: setSize(cases), height: setSize(cases) }}
              onClick={handleClick(name, flag)}
            >
              {/* <img src={flag} alt={name} width='20' /> */}
            </div>
          </Marker>
        ))}
    </MapGL>
  );
};

export default Map;