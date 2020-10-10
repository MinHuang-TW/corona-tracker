import React from 'react';
import Anchor from './Anchor';
import styles from './AnchoredTitle.module.css';
import cx from 'classnames';

export const AnchoredTitle = ({
  hrefId,
  classes,
  color = 'rgba(255, 255, 255, 0.87)',
  children,
}) => (
  <a
    href={`#${hrefId}`}
    className={cx(classes, styles.title)}
    style={{ color, marginBottom: 24 }}
  >
    <Anchor color={color} />
    <h1 className={styles.main_title}>{children}</h1>
  </a>
);

export const AnchoredSubtitle = ({
  hrefId,
  color = 'rgba(255, 255, 255, 0.87)',
  title,
  subtitle,
}) => (
  <>
    <a href={`#${hrefId}`} className={styles.title} style={{ color }}>
      <Anchor color={color} size={12} />
      <h1 className={styles.sub_title}>{title}</h1>
    </a>
    <p className={styles.text}>{subtitle}</p>
  </>
);
