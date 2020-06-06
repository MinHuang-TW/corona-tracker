import React, { useState, useEffect, useCallback } from 'react';
import List from '../List/List';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import styles from './CountryPicker.module.css';

const CountryPicker = ({ handleCountry, countries, selected_Country, setCountry, setIcon, icon }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const handleSelect = useCallback((country, flag) => e => {
    handleCountry(country); 
    setCountry(country);
    setIcon(flag);
    setOpen(false);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleClose = event => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleClose);
    
    return () => {
      window.removeEventListener('keydown', handleClose);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.selector} onClick={handleOpen}>
        <List country={selected_Country} icon={icon}>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </List>

        {open && countries
          .filter(({ name }) => name !== selected_Country)
          .map(({ name, flag }) => (
            <List 
              key={name}
              name={name}
              icon={flag}
              handleClick={handleSelect(name, flag)} 
            />
          ))}
      </div>
    </div>
  );
};

export default CountryPicker;
