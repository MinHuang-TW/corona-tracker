import React from 'react';
import styles from './List.module.css';
import PublicIcon from '@material-ui/icons/Public';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const List = ({ text, icon, main, onClick, isOpen = true }) => (
  <li onClick={onClick} className={isOpen ? styles.divider : null}>
    <span className={styles.listBlock}>
      {icon ? <img src={icon} alt={text} /> : <PublicIcon />}
      <span className={main ? styles.selectText : styles.listText}>
        {text ? text : 'Worldwide'}
      </span>
    </span>
    {main && <span className={styles.more}>
      {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
    </span>}
  </li>
);

export default List;