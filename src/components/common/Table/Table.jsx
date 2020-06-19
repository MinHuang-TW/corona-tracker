import React from 'react';
import { uuid } from 'uuidv4';
import { capitalize } from '../../../utils/format';
import Avatar from '@material-ui/core/Avatar';
import PublicIcon from '@material-ui/icons/Public';
import styles from './Table.module.css';

const Table = ({ activeType, data }) => {
  const currentType = capitalize(
    activeType === 'cases' ? 'Confirmed' : activeType
  );

  const icon = {
    width: '20px',
    height: '20px',
    filter: 'saturate(80%)',
    margin: 2,
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.head}>
          <th style={{ width: '40%' }}>Country</th>
          <th>{currentType}</th>
          <th>{currentType} per 1M</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ name, data }) => (
          <tr key={uuid()}>
            <td className={styles.countries}>
              <span>
                {name === 'Worldwide' ? (
                  <PublicIcon />
                ) : (
                  <Avatar src={data.countryInfo.flag} alt={name} style={icon} />
                )}
              </span>
              <span>{name}</span>
            </td>
            <td className={styles.value}>
              {data[activeType].toLocaleString()}
            </td>
            <td className={styles.value}>
              {data[`${activeType}PerOneMillion`].toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;