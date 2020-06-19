import React, { useState, useCallback } from 'react';
import { uuid } from 'uuidv4';
import { capitalize, sortLists } from '../../../utils/format';
import Avatar from '@material-ui/core/Avatar';
import PublicIcon from '@material-ui/icons/Public';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import styles from './Table.module.css';

const Icon = ({ name, icon }) => (
  <span>
    {name === 'Worldwide' 
      ? (<PublicIcon />) 
      : (<Avatar 
          src={icon} 
          alt={name} 
          style={{ width: '20px', height: '20px', margin: 2 }} 
        />)}
  </span>
);

const Table = ({ activeType, data }) => {
  const [descending, setDescending] = useState(true);
  const currentType = capitalize(activeType === 'cases' ? 'Confirmed' : activeType);
  const columnLists = [ 
    { sortIndx: 'name', text: 'Country' },  
    { sortIndx: activeType, text: currentType },  
    { sortIndx: `${activeType}PerOneMillion`, text: currentType + ' per 1M' },  
  ];
  const [sortColumn, setSortColum] = useState(columnLists[0].sortIndx);

  const handleSort = useCallback((sortIndx) => (event) => {
    setDescending(!descending);
    setSortColum(sortIndx);
  }, [descending]);

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.head}>
          {columnLists.map(({ sortIndx, text }) => (
            <th key={uuid()} className={styles.column} onClick={handleSort(sortIndx)}>
              <span>{text}</span>
              <span 
                className={descending ? styles.less : styles.more}
                style={{ display: sortIndx !== sortColumn && 'none' }}
              >
                <ArrowDropDownIcon />
              </span>
            </th>))}
        </tr>
      </thead>
      <tbody>
        {data
          .sort((a, b) => sortLists(a, b, sortColumn, descending))
          .map(({ name, data }) => (
            <tr key={uuid()}>
              <td className={styles.countries}>
                <Icon name={name} icon={data.countryInfo && data.countryInfo.flag} />
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