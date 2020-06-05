import React from 'react';
import styles from './List.module.css';
import PublicIcon from '@material-ui/icons/Public';

const List = ({
  country,
  icon,
  name,
  handleClick = null,
  children = null,
}) => {
  return (
    <li onClick={handleClick}>
      <span className={styles.listBlock}>
        {name === 'Worldwide' || country === 'Worldwide' ? (
          <PublicIcon style={{ margin: '0 3px' }} />
        ) : (
          <img width='30px' src={icon} alt={name || country} />
        )}
        <span className={name ? styles.listText : styles.selectText}>
          {name || country}
        </span>
      </span>
      <span className={styles.more}>{children}</span>
    </li>
  );
};

export default List;
