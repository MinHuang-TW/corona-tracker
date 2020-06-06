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
  country, setCountry,
  countries, handleCountry,
  popupInfo, setPopupInfo,
  setIcon,
  data,
}) => {
  const popupLists = [
    { type: 'Confirmed', amount: data.cases },
    { type: 'Recovered', amount: data.recovered },
    { type: 'Deaths', amount: data.deaths },
  ];

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
    if (!country) return;
    if (country === 'Worldwide')
      return setViewport({ ...viewport, ...initial_viewport });
    const { lat, long } = countries.find((c) => c.name === country);
    setViewport({
      ...viewport,
      zoom: 6,
      latitude: lat,
      longitude: long,
    });
    // eslint-disable-next-line
  }, [country]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') setPopupInfo(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
    // eslint-disable-next-line
  }, []);

  const allCases = countries && countries.map((country) => country.cases);
  const max = allCases.length && Math.max(...allCases);
  const interval = max && max / 200;

  const setSize = (number) => {
    if (number === max) return 100;
    if (number) return 10 + Math.ceil(Number(number) / interval);
  };

  const handleClick = useCallback((country) => (event) => {
    const { name, flag } = country;
    handleCountry(name);
    setCountry(name);
    setIcon(flag);
    setPopupInfo(country);
    // eslint-disable-next-line
  }, [country]);

  const handleClosePopup = useCallback(() => {
    setPopupInfo(null);
    // eslint-disable-next-line
  }, []);

  return (
    <MapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      mapStyle='mapbox://styles/min-huang/ckb2wh38l00aw1iph6kncjlx0'
      maxZoom={9}
      minZoom={1}
      onViewportChange={(viewport) =>
        setViewport({ ...viewport, ...animation })
      }
    >
      {countries &&
        countries.map((countryInfo) => (
          <Marker 
            key={countryInfo.name} 
            latitude={countryInfo.lat} 
            longitude={countryInfo.long}
          >
            <div
              className={
                (country !== 'Worldwide') & (country === countryInfo.name)
                  ? styles.active
                  : styles.marker
              }
              style={{
                width: setSize(countryInfo.cases),
                height: setSize(countryInfo.cases),
              }}
              onClick={handleClick(countryInfo)}
            />
          </Marker>
        ))}

      {popupInfo && (
        <Popup
          className={styles.popup}
          latitude={popupInfo.lat}
          longitude={popupInfo.long}
          closeButton={false}
        >
          <img src={popupInfo.flag} alt={popupInfo.name} />
          <span className={styles.popup_title}>{popupInfo.name}</span>

          <CloseIcon
            className={styles.close}
            fontSize='small'
            onClick={handleClosePopup}
          />

          {popupLists.map((list) => (
            <PopupContent key={popupInfo.name + list.type} {...list} />
          ))}
        </Popup>
      )}
    </MapGL>
  );
};

export default Map;