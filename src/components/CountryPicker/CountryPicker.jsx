import React, { useState, useEffect, useCallback } from 'react';
import { List } from '../common';
import styles from './CountryPicker.module.css';

const CountryPicker = ({
  countries,
  handleCountry,
  country,
  setCountry,
  pickerOpen,
  setPickerOpen,
  setPopupOpen,
}) => {
  const [key, setKey] = useState(null);

  const filterList = (text) => {
    if (country && text === country.name) return;
    if (key) return text.startsWith(key);
    return text;
  };

  const handleOpen = useCallback(() => {
    setPickerOpen(!pickerOpen);
    setKey(null);
    // eslint-disable-next-line
  }, [pickerOpen]);

  const handleSelect = useCallback((country) => (event) => {
    handleCountry(country && country.name);
    setCountry(country);
    setPickerOpen(false);
    setPopupOpen(true);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleKeyDown = ({ key, keyCode }) => {
      if (key === 'Escape') setPickerOpen(false);
      if ((keyCode >= 65) & (keyCode <= 90)) setKey(key.toUpperCase());
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.selector} onClick={handleOpen}>
        <List main 
          icon={country && country.flag} 
          text={country && country.name} 
          isOpen={pickerOpen}
        />

        {pickerOpen && country && (
          <List text='Worldwide' onClick={handleSelect()} />
        )}

        {pickerOpen && countries
          .filter(({ name }) => filterList(name))
          .map((country) => (
            <List
              key={country.name}
              icon={country.flag}
              text={country.name}
              onClick={handleSelect(country)}
            />
          ))}
      </div>
    </div>
  );
};

export default CountryPicker;