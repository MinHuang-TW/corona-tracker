import React, { useState, useEffect, useCallback } from 'react';
import { fetchHistoryData, fetchDataDetails } from '../../api';
import { color } from '../common/Chart/chartConfig';
import { capitalize } from '../../utils/format';
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
  const currentType = capitalize(getTypeText(activeType));

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
          color: selected && 'black',
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
    const query = storedData.map(({ name }) => name).filter(name => name !== 'Worldwide');
    const hasGlobal = query && query.length !== storedData.length;
    const hasOnlyGlobal = hasGlobal & storedData.length === 1;
    
    const getData = async () => {
      let queryHistoryData = '';
      let queryDataDetails = '';

      if (storedData && storedData.length) {
        if (!hasOnlyGlobal)
          queryHistoryData = storedData;
          queryDataDetails = query;
      }
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
            id='countriesTotal'
            title='Case details' 
            source={selected && `Updated ${lastUpdated}`}
          >
            {selected && (<Table data={data} />)}
          </Block>

          <Block 
            id='overTime' 
            title='Cases over time' 
            subtitle={selected && `${currentType} cases`}
            source={selected && `Source: Johns Hopkins University`}
          >
            {selected && (<div className={styles.chart}>
              <LineChart selectedCountries={selectedCountries} type={activeType} />
            </div>)}
          </Block>

          {selected && (<div className={styles.buttons}>
            {types.map((type, index) => (<TypeButton key={index} type={type} />))}
          </div>)}
        </>
      ) : (
        <Progress />
      )}
    </section>
  );
};

export default History;