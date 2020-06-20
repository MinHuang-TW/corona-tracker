import React, { useState, useEffect, useCallback } from 'react';
import { fetchHistoryData, fetchDataDetails } from '../../api';
import { color } from '../common/Chart/chartConfig';
import { AnchoredTitle, Block, CountryPicker, Progress, LineChart, Table } from '../common';
import moment from 'moment';
import styles from './History.module.css';

const History = ({ countriesData }) => {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [data, setData] = useState([]);
  const types = ['cases', 'recovered', 'deaths'];
  const [activeType, setActiveType] = useState(types[0]);

  const selected = selectedCountries && selectedCountries.length > 0;
  const getTypeText = (type) => (type === 'cases' ? 'Confirmed' : type);
  const lastUpdated = moment(data.length && data[0].updated).startOf('hour').fromNow();

  const TypeButton = ({ type }) => {
    const color_pallete = color[getTypeText(type).toLowerCase()];
    const selected = activeType === type;
    const handleSetType = useCallback(() => setActiveType(type), [type]);
    return (
      <div 
        onClick={handleSetType}
        className={styles.button}
        style={{
          background: selected && color_pallete,
          color: selected && '#000000',
          borderColor: selected && color_pallete,
          fontWeight: selected && 600,
        }}
      >
        {getTypeText(type).toUpperCase()}
      </div>
    )
  };

  const handleCountry = async (country) => {
    const query = country === 'Worldwide' ? '' : country;
    const newData = [...data, ...await fetchDataDetails(query)];
    setData(newData);
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('SelectedCountry'));
    let queryHistoryData = '',
        queryDataDetails = '';
    let hasGlobal = false,
        hasOnlyGlobal = false;

    if (storedData && storedData.length) {
      const query = storedData
        .map(({ name }) => name)
        .filter(name => name !== 'Worldwide');

      hasGlobal = query && query.length !== storedData.length;
      hasOnlyGlobal = hasGlobal & storedData.length === 1;

      if (!hasOnlyGlobal)
        queryHistoryData = storedData;
        queryDataDetails = query;
    }
    
    const getData = async () => {
      const globalHistory = await fetchHistoryData(queryHistoryData);
      setSelectedCountries(globalHistory);

      let countriesData = await fetchDataDetails(queryDataDetails);
      if (hasGlobal && !hasOnlyGlobal) {
        const globalData = await fetchDataDetails();
        countriesData = [...globalData, ...countriesData];
      }
      return setData(countriesData);
    };
    getData();
  }, []);

  return (
    <section id='history' className={styles.container}>
      <AnchoredTitle hrefId='history'>Cases comparison</AnchoredTitle>

      {countriesData.length ? (
        <>
          <div className={styles.selector}>
            <CountryPicker
              countries={countriesData}
              country={selectedCountries}
              setCountry={setSelectedCountries}
              handleCountry={handleCountry}
              data={data}
              setData={setData}
              selector
            />
          </div>


          <Block 
            id='overTime' 
            title='Cases over time' 
            source={selected && `Updated ${lastUpdated} from Johns Hopkins University`}
          >
            {selected && (<div className={styles.chart}>
              <div className={styles.buttons}>
                {types.map((type, index) => (<TypeButton key={index} type={type} />))}
              </div>

              <LineChart selectedCountries={selectedCountries} type={activeType} />
            </div>)}
          </Block>

          <Block
            id='countriesTotal'
            title='Cases details' 
            source={selected && `Updated ${lastUpdated} from Worldometers`}
          >
            {selected && (<Table data={data} />)}
          </Block>
        </>
      ) : (
        <Progress />
      )}
    </section>
  );
};

export default History;