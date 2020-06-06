import React from 'react';
import styles from './List.module.css';
import PublicIcon from '@material-ui/icons/Public';

const List = ({ text, icon = null, main = null, onClick = null, children = null }) => {
  return (
    <li onClick={onClick}>
      <span className={styles.listBlock}>
        {icon ? (
          <img width='30px' src={icon} alt={text} />
          ) : (
          <PublicIcon style={{ margin: '0 3px' }} />
        )}
        <span className={main ? styles.selectText : styles.listText}>
          {text}
        </span>
      </span>
      {children && <span className={styles.more}>{children}</span>}
    </li>
  );
};

export default List;
