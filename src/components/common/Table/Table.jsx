import React, { useState, useCallback } from 'react';
import { uuid } from 'uuidv4';
import { capitalize, sortLists } from '../../../utils/format';
import { color } from '../Chart/chartConfig';
import Avatar from '@material-ui/core/Avatar';
import PublicIcon from '@material-ui/icons/Public';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import styles from './Table.module.css';

const Table = ({ data }) => {
  const [descending, setDescending] = useState(true);
  const columnLists = [
    'name', 'tests', 'cases', 'casesPerOneMillion', 
    'critical', 'active', 'recovered', 'deaths',
  ];
  const [sortColumn, setSortColum] = useState(columnLists[0].sortIndx);

  const Cell = ({ data }) => columnLists.map((list, index) => (
    <td key={uuid()} className={!index ? styles.countries : styles.value}>
      {!index && (<span className={styles.align}>
        {data[list] === 'Worldwide' 
          ? (<PublicIcon />) 
          : (<Avatar
              src={data.countryInfo && data.countryInfo.flag}
              style={{ width: '20px', height: '20px', margin: 2 }}
              alt={data[list]}
            />)}
      </span>)}
      <span className={styles.align}>
        {!index ? data[list] 
          : data[list] === 0 ? '-' 
          : data[list].toLocaleString()}
      </span>
    </td>
  ));

  const setHeadText = (text) => {
    if (text === 'name') return 'Country';
    if (text === 'cases') return 'Confirmed';
    if (text.includes('PerOneMillion')) return 'Confirmed per 1M';
    return capitalize(text);
  }

  const handleSort = useCallback((sortIndx) => (event) => {
      setDescending(!descending);
      setSortColum(sortIndx);
    }, [descending]);

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.head}>
            {columnLists.map((list) => (
              <th key={uuid()} className={styles.column} onClick={handleSort(list)}>
                {color.hasOwnProperty(list) || list.includes('cases') ? (
                  <span
                    className={styles.indicator}
                    style={{ background: list.includes('cases') ? color.confirmed : color[list] }} 
                  />
                ) : null}
                <span style={{ maxWidth: 70, display: 'inline-block' }}>{setHeadText(list)}</span>
                <span
                  className={descending ? styles.less : styles.more}
                  style={{ display: list !== sortColumn && 'none' }}
                >
                  <ArrowDropDownIcon />
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data
            .sort((a, b) => sortLists(a, b, sortColumn, descending))
            .map((country) => (<tr key={uuid()}><Cell data={country} /></tr>))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;