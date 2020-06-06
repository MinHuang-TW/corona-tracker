import React, { useState, useEffect, useCallback } from 'react';
import List from '../List/List';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import styles from './CountryPicker.module.css';

const CountryPicker = ({
  countries, handleCountry,
  selected_Country, setCountry,
  icon, setIcon,
  open, setOpen,
  setPopupInfo,
}) => {
  const [key, setKey] = useState(null);

  const filterList = text => {
    if (text === selected_Country) return;
    if (key) return text.startsWith(key);
    return text;
  };

  const handleOpen = useCallback(() => {
    setOpen(!open);
    setKey(null);
    // eslint-disable-next-line
  }, [open]);

  const handleSelect = useCallback((country, flag) => (event) => {
    handleCountry(country);
    setCountry(country);
    setIcon(flag);
    setOpen(false);
    setPopupInfo(null);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleKeyDown = ({ key, keyCode }) => {
      if (key === 'Escape') setOpen(false);
      if (keyCode >= 65 & keyCode <= 90) setKey(key.toUpperCase());
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.selector} onClick={handleOpen}>
        <List main icon={icon} text={selected_Country} divider={open}>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </List>

        {open && countries
          .filter(({ name }) => filterList(name))
          .map(({ name, flag }) => (
            <List 
              key={name} 
              icon={flag} 
              text={name}
              onClick={handleSelect(name, flag)} 
            />
        ))}
      </div>
    </div>
  );
};

export default CountryPicker;