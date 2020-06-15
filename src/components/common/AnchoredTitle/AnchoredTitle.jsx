import React from 'react';
import Anchor from './Anchor';
import styles from './AnchoredTitle.module.css';

const AnchoredTitle = ({ hrefId, color, children, dark }) => (
  <a
    href={`#${hrefId}`}
    className={dark ? styles.title_dark : styles.title}
    style={{ color }}
  >
    <Anchor color={color} />
    <h1>{children}</h1>
  </a>
);

export default AnchoredTitle;