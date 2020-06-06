import React from 'react';
import styles from './List.module.css';
import PublicIcon from '@material-ui/icons/Public';

const List = ({ text, icon, main, onClick, children, divider = true }) => {
  return (
    <li onClick={onClick} className={divider ? styles.divider : null}>
      <span className={styles.listBlock}>
        {icon ? (<img src={icon} alt={text} />) : (<PublicIcon />)}
        <span className={main ? styles.selectText : styles.listText}>
          {text}
        </span>
      </span>
      {children && <span className={styles.more}>{children}</span>}
    </li>
  );
};

export default List;
