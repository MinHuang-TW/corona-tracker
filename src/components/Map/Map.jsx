import React, { useState, useEffect, useCallback } from 'react';
import MapGL, { Marker, FlyToInterpolator, Popup } from 'react-map-gl';
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

  const handleViewportChange = (updatedViewport) =>
    setViewport({ ...updatedViewport, ...animation });

  useEffect(() => {
    if (!country) return setViewport({ ...viewport, ...initial_viewport });
    setViewport({
      ...viewport,
      zoom: 6,
      latitude: country.lat,
      longitude: country.long,
    });
    // eslint-disable-next-line
  }, [country]);

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

  const allCases = countries && countries.map((country) => country.cases);
  const max = allCases.length && Math.max(...allCases);
  const interval = max && max / 200;

  const setSize = (number) => {
    if (number === max) return 100;
    if (number) return 10 + Math.ceil(Number(number) / interval);
  };

  const setActiveStyle = (markerName) => (
    country && country.name === markerName ? styles.active : styles.marker
  );

  const handleClick = useCallback((countryInfo) => (event) => {
      handleCountry(countryInfo.name);
      setCountry(countryInfo);
      setPopupOpen(true);
      // eslint-disable-next-line
    }, [country]);

  const handleClosePopup = useCallback(() => {
    setPopupOpen(false);
    // eslint-disable-next-line
  }, []);

  return (
    <MapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      mapStyle='mapbox://styles/min-huang/ckb2wh38l00aw1iph6kncjlx0'
      maxZoom={9}
      minZoom={1}
      onViewportChange={handleViewportChange}
    >
      {countries && countries.map((countryInfo) => {
        const { name, lat, long, cases } = countryInfo;
        return (
        <Marker key={name} latitude={lat} longitude={long}>
          <div
            className={setActiveStyle(name)}
            style={{ width: setSize(cases), height: setSize(cases) }}
            onClick={handleClick(countryInfo)}
          />
        </Marker>
      )})}

      {popupOpen && country && (
        <Popup
          className={styles.popup}
          latitude={country.lat}
          longitude={country.long}
          closeButton={false}
        >
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
        </Popup>
      )}
    </MapGL>
  );
};

export default Map;