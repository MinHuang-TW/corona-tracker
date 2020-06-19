import React, { useState, useCallback } from 'react';
import { AnchoredSubtitle } from '../AnchoredTitle/AnchoredTitle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styles from './Block.module.css';

const Block = ({ id, title, subtitle, children, source }) => {
  const [open, setOpen] = useState(true);
  const handleOpen = useCallback(() => setOpen(!open), [open]);
  const setStyle = open ? styles.less : styles.more;

  return (
    <div id={id} className={styles.block}>
      <div
        className={styles.title}
        style={{ marginBottom: open && children && 16 }}
      >
        <div>
          <AnchoredSubtitle hrefId={id} title={title} subtitle={subtitle} />
        </div>
        <span 
          className={setStyle} 
          onClick={handleOpen} 
          style={{ display: !children && 'none' }}
        >
          <ExpandMoreIcon />
        </span>
      </div>
      {open && (
        <>
          {children}
          {source && <p className={styles.source}>{source}</p>}
        </>
      )}
    </div>
  );
};

export default Block;
