import React from 'react';
import styles from './List.module.css';
import PublicIcon from '@material-ui/icons/Public';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const List = ({ text, icon, main, onClick, open = true }) => (
  <li onClick={onClick} className={open ? styles.divider : null}>
    <span className={styles.listBlock}>
      {icon ? <img src={icon} alt={text} /> : <PublicIcon />}
      <span className={main ? styles.selectText : styles.listText}>
        {text}
      </span>
    </span>
    {main && (
      <span className={open ? styles.less : styles.more}>
        <ExpandMoreIcon />
      </span>
    )}
  </li>
);

export default List;