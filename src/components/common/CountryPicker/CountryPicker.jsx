import React, { useState, useEffect, useCallback } from 'react';
import { List } from '../../common';
import { Chip, Avatar, Backdrop } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PublicIcon from '@material-ui/icons/Public';
import cx from 'classnames';
import styles from './CountryPicker.module.css';

const MAX_ITEM = 5;

const Selector = ({ country, setCountry }) => {
  const setButton = country.length < MAX_ITEM 
    ? styles.selector_add : styles.selector_remove;

  const handleDelete = useCallback((countryName) => (event) => {
    setCountry(country.filter(({ name }) => name !== countryName));
  }, [country, setCountry]);

  const handleClear = useCallback(() => {
    if (country.length === MAX_ITEM) setCountry([]);
  }, [country, setCountry]);

  return (
    <>
      <div>
        {country.length ? (country.map(({ name, flag }) => (
          <Chip
            key={name}
            label={name}
            className={styles.selector_chip}
            onDelete={handleDelete(name)}
            avatar={name === 'Worldwide' 
              ? <PublicIcon /> 
              : <Avatar src={flag} alt={name} />
            }
          />))
        ) : (
          <div className={styles.selector_text}>
            Select countries to compare
          </div>
        )}
      </div>
      <span className={setButton} onClick={handleClear}>
        <AddIcon />
      </span>
    </>
  )
};

const Picker = ({ open, country }) => (
  <List main 
    icon={country && country.flag} 
    text={country ? country.name : 'Loading...'} 
    open={open}
  />
);

const CountryPicker = ({
  countries,
  handleCountry,
  country,
  setCountry,
  setPopupOpen,
  selector,
  radius,
}) => {
  const [key, setKey] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const filterList = (text) => {
    const condition = selector 
      ? country.find(({ name }) => text === name)
      : country && text === country.name;
    if (condition) return;
    if (key) return text.startsWith(key);
    return text;
  };

  const handleSelect = useCallback((countryInfo) => (event) => {
    if (selector) {
      setCountry([...country, countryInfo]);
    } else {
      if (countryInfo.name === 'Worldwide') {
        handleCountry();
        setCountry({
          name: 'Worldwide',
          flag: null,
          lat: 20,
          long: 15,
        });
      } else {
        handleCountry(countryInfo.name);
        setCountry(countryInfo);
      }
      setPopupOpen(true);
    }
    setPickerOpen(false);
    // eslint-disable-next-line
  }, [country]);

  const handleClose = useCallback(() => {
    setPickerOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    if (country.length >= MAX_ITEM) return;
    setPickerOpen(!pickerOpen);
    setKey(null);
  }, [pickerOpen, country]);

  useEffect(() => {
    const handleKeyDown = ({ key, keyCode }) => {
      if (key === 'Escape') setPickerOpen(false);
      if ((keyCode >= 65) & (keyCode <= 90)) setKey(key.toUpperCase());
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.container} onBlur={handleClose} tabIndex={0}>
      {pickerOpen ? <Backdrop open={pickerOpen} /> : null}
      <div 
        className={selector ? styles.selector : styles.picker} 
        style={{ borderRadius: pickerOpen ? `${radius}px ${radius}px 0 0` : `${radius}px` }}
        onClick={handleOpen}
      >
        {selector 
          ? (<Selector country={country} setCountry={setCountry} />) 
          : (<Picker open={pickerOpen} country={country} />)}
      </div>

      {pickerOpen && (
        <div   
          className={pickerOpen 
            ? cx(styles.picker_menu, styles.picker_menu_active) 
            : styles.picker_menu
          }
          style={{ borderRadius: `0 0 ${radius}px ${radius}px` }}
        >
          {countries
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
      )}
    </div>
  );
};

export default CountryPicker;