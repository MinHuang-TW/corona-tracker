import React, { useState, useEffect, useCallback } from 'react';
import { fetchHistoryData, fetchHistoryOverall } from '../../api';
import { color } from '../common/Chart/chartConfig';
import { AnchoredTitle, Block, CountryPicker, Progress, LineChart } from '../common';
import styles from './History.module.css';

const History = ({ countries, updated }) => {
  const [countriesData, setCountriesData] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [activeType, setActiveType] = useState('cases');
  const types = ['cases', 'recovered', 'deaths'];
  const selected = selectedCountries && selectedCountries.length > 0;

  const capitalize = (str, lower = false) => 
    (lower ? str.toLowerCase() : str)
      .replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());

  const getTypeText = (type) => (type === 'cases' ? 'Confirmed' : type);

  const TypeButton = ({ type }) => {
    const color_pallete = color[type === 'cases' ? 'confirmed' : type];
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

  useEffect(() => {
    const getData = async () => {
      const allCountries = await fetchHistoryData(countries);
      const overall = await fetchHistoryOverall();
      setSelectedCountries([overall]);
      setCountriesData([overall, ...allCountries]);
    };
    getData();
  }, [countries]);

  return (
    <section id='history' className={styles.container}>
      <AnchoredTitle hrefId='history'>Cases comparison</AnchoredTitle>

      {countriesData.length ? (
        <>
          <div className={styles.buttons}>
            {types.map((type, index) => (<TypeButton key={index} type={type} />))}
          </div>

          <div className={styles.selector}>
            <CountryPicker
              countries={countriesData}
              country={selectedCountries}
              setCountry={setSelectedCountries}
              radius={0}
              selector
            />
          </div>

          <Block 
            id='overTime' 
            title='Cases over time' 
            subtitle={`${capitalize(getTypeText(activeType))} cases`}
            source={selected && `Updated ${updated}`}
          >
            {selected && (
              <div className={styles.chart}>
                <LineChart selectedCountries={selectedCountries} type={activeType} />
              </div>)}
          </Block>

          <Block
            id='countriesTotal'
            title='New cases' 
            subtitle={`${capitalize(getTypeText(activeType))} cases`}
            source={selected && `Updated ${updated}`}
          >

          </Block>
        </>
      ) : (
        <Progress />
      )}
    </section>
  );
};

export default History;