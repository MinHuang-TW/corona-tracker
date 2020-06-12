import React, { useState, useEffect, useCallback } from 'react';
import { List } from '../common';
import cx from 'classnames';
import { Chip, Avatar } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PublicIcon from '@material-ui/icons/Public';
import styles from './CountryPicker.module.css';

const CountrySelector = ({
  countriesData,
  selectedCountries,
  setSelectedCountries,
  pickerOpen,
  setPickerOpen,
}) => {
  const [key, setKey] = useState(null);

  const filterList = (text) => {
    if (selectedCountries.find(({ name }) => text === name)) return;
    if (key) return text.startsWith(key);
    return text;
  };

  const handleDelete = useCallback((country) => (event) => {
    setSelectedCountries(
      selectedCountries.filter(({ name }) => name !== country)
    );
  }, [selectedCountries]); // eslint-disable-line

  const handleSelect = useCallback((country) => (event) => {
    setSelectedCountries([...selectedCountries, country]);
    setPickerOpen(false);
  }, [selectedCountries]); // eslint-disable-line

  const handleOpen = useCallback(() => {
    setPickerOpen(!pickerOpen);
    setKey(null);
  }, [pickerOpen]); // eslint-disable-line

  useEffect(() => {
    const handleKeyDown = ({ key, keyCode }) => {
      if (key === 'Escape') setPickerOpen(false);
      if ((keyCode >= 65) & (keyCode <= 90)) setKey(key.toUpperCase());
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // eslint-disable-line

  return (
    <div className={styles.container} style={{ top: 0, height: 'auto' }}>
      <div
        className={styles.selector_box}
        style={{ borderRadius: pickerOpen ? '6px 6px 0 0' : '6px' }}
        onClick={handleOpen}
      >
        <div>
          {selectedCountries.length ? (
            selectedCountries.map(({ name, flag }) => (
              <Chip
                key={name}
                label={name}
                style={{ margin: '4px' }}
                onDelete={handleDelete(name)}
                avatar={name === 'Worldwide' 
                  ? (<PublicIcon />) 
                  : (<Avatar src={flag} alt={name} />)
                }
              />
            ))
          ) : (
            <div className={styles.selector_text}>
              Select countries to compare
            </div>
          )}
        </div>
        <AddIcon className={styles.selector_addButton} onClick={handleOpen} />
      </div>

      <div
        className={pickerOpen
          ? cx(styles.selector_menu, styles.selector)
          : styles.selector_menu
        }
        onClick={handleOpen}
      >
        {pickerOpen &&
          countriesData
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

export default CountrySelector;