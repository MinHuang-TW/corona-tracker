import React, { useCallback } from 'react';
import { Popup } from 'react-map-gl';
import CloseIcon from '@material-ui/icons/Close';
import styles from './PopupContent.module.css';

const PopupContent = ({
  country,
  onClick,
  setPopupOpen,
  data: { cases, recovered, deaths },
}) => {
  const popupLists = [
    { type: 'Confirmed', amount: cases },
    // { type: 'Recovered', amount: recovered },
    // { type: 'Deaths', amount: deaths },
  ];

  const handleClosePopup = useCallback(() => {
    setPopupOpen(false);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {country && (
        <Popup
          latitude={country.lat}
          longitude={country.long}
          onClick={onClick}
          closeButton={false}
          tipSize={6}
        >
          <div className={styles.popup}>
            <img src={country.flag} alt={country.name} />
            <span className={styles.popup_title}>{country.name}</span>

            <CloseIcon
              onClick={handleClosePopup}
              className={styles.close}
              fontSize='small'
            />

            {popupLists.map(({ type, amount }) => (
              <div key={country.name + type} className={styles.popup_text}>
                <p>{type}</p>
                <strong>{amount.toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </Popup>
      )}
    </>
  );
};

export default PopupContent;