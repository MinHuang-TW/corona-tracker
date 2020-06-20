import React, { useState, useCallback } from 'react';
import { List } from '../../common';
import { useKey, useWindowWidth } from '../../Hook';
import { uuid } from 'uuidv4';
import { Chip, Avatar } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PublicIcon from '@material-ui/icons/Public';
import styles from './CountryPicker.module.css';

const MAX_ITEM = 5;

const Selector = ({ country, setCountry, data, setData }) => {
  const windowWidth = useWindowWidth();
  const setButton = country.length < MAX_ITEM 
    ? styles.selector_add : styles.selector_remove;

  const handleDelete = useCallback((countryName) => (event) => {
    const filteredCountry = country.filter(({ name }) => name !== countryName);
    const filteredData = data.filter(({ name }) => name !== countryName);
    setCountry(filteredCountry);
    setData(filteredData);
    localStorage.setItem('SelectedCountry', JSON.stringify(filteredCountry));
  }, [country, setCountry, data, setData]);

  const handleClear = useCallback(() => {
    if (country.length === MAX_ITEM) {
      setCountry([]);
      setData([]);
      localStorage.removeItem('SelectedCountry');
    }
  }, [country, setCountry, setData]);
  return (
    <>
      <div>
        {/* {country.length ? ( */}
          {country.map(({ name, flag }) => (
          <Chip
            key={uuid()}
            label={name}
            className={styles.selector_chip}
            size={windowWidth < 960 ? 'small' : null}
            onDelete={handleDelete(name)}
            avatar={name === 'Worldwide' 
              ? <PublicIcon /> 
              : <Avatar src={flag} alt={name} />
            }
          />))}
      </div>
      <span className={setButton} onClick={handleClear}>
        <AddIcon />
      </span>
    </>
  )
};

const Picker = ({ open, country }) => (
  <ol>
    <List main 
      icon={country && country.flag} 
      text={country ? country.name : 'Loading...'} 
      open={open}
    />
  </ol>
);

const CountryPicker = ({
  countries,
  handleCountry,
  country,
  setCountry,
  data,
  setData,
  setPopupOpen,
  selector,
  radius = 0,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [key, setKey] = useKey(setPickerOpen);

  const filterList = (text) => {
    const condition = selector 
      ? country.find(({ name }) => text === name)
      : country && text === country.name;
    if (condition) return;
    if (key) return text.startsWith(key);
    return text;
  };

  const handleSelect = useCallback((countryInfo) => (event) => {
    const isGlobal = countryInfo.name === 'Worldwide';
    if (selector) {
      const newCountry = [...country, countryInfo];
      setCountry(newCountry);
      handleCountry(isGlobal ? '' : countryInfo.name);
      localStorage.setItem('SelectedCountry', JSON.stringify(newCountry));
    } else {
      const globalInfo = {
        name: 'Worldwide',
        flag: null,
        lat: 20,
        long: 15,
      };
      handleCountry(isGlobal ? null : countryInfo.name);
      setCountry(isGlobal ? globalInfo : countryInfo);
      setPopupOpen(true);
    }
    setPickerOpen(false);
  }, [country, handleCountry]); // eslint-disable-line

  const handleClose = useCallback(() => setPickerOpen(false), []);

  const handleOpen = useCallback(() => {
    if (country.length >= MAX_ITEM) return;
    setPickerOpen(!pickerOpen);
    setKey(null);
  }, [pickerOpen, country]); // eslint-disable-line

  return (
    <div className={styles.container} onBlur={handleClose} tabIndex={0}>
      {pickerOpen &&  (<div className={styles.backdrop} onClick={handleClose} />)}
      <div 
        className={selector ? styles.selector : styles.picker} 
        onClick={handleOpen}
      >
        {selector 
          ? (<Selector country={country} setCountry={setCountry} data={data} setData={setData} />) 
          : (<Picker open={pickerOpen} country={country} />)}
      </div>

      {pickerOpen ? (
        <ul   
          className={styles.menu_active}
          style={{ 
            borderRadius: `0 0 ${radius}px ${radius}px`,
            borderColor: selector && 'rgba(255, 255, 255, 0.6)',
          }}
        >
          {countries
            .filter(({ name }) => filterList(name))
            .map((country) => (
              <List
                key={uuid()}
                icon={country.flag}
                text={country.name}
                onClick={handleSelect(country)}
              />
            ))}
        </ul>
      ) : (
        <div className={styles.menu} />
      )}
    </div>
  );
};

export default CountryPicker;