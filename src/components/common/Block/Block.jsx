import React from 'react';
import { AnchoredSubtitle } from '../AnchoredTitle/AnchoredTitle';
import styles from './Block.module.css';

const Block = ({ id, title, subtitle, children, source }) => (
  <div id={id} className={styles.block}>
    <div
      className={styles.title}
      style={{ marginBottom: children && 16 }}
    >
      <AnchoredSubtitle hrefId={id} title={title} subtitle={subtitle} />
    </div>

    {children}
    {source && <p className={styles.source}>{source}</p>}
  </div>
);

export default Block;
