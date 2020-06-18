import React, { useState, useEffect, useCallback } from 'react';
import { fetchHistoryData, fetchDataDetails } from '../../api';
import { color } from '../common/Chart/chartConfig';
import { capitalize } from '../../utils/format';
import { AnchoredTitle, Block, CountryPicker, Progress, LineChart } from '../common';
import { uuid } from 'uuidv4';
import moment from 'moment';
import PublicIcon from '@material-ui/icons/Public';
import styles from './History.module.css';

const History = ({ countriesData }) => {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [data, setData] = useState([]);
  const [activeType, setActiveType] = useState('cases');
  const types = ['cases', 'recovered', 'deaths'];
  const selected = selectedCountries && selectedCountries.length > 0;
  const getTypeText = (type) => (type === 'cases' ? 'Confirmed' : type);
  const lastUpdated = moment(data.length && data[0].data.updated).startOf('hour').fromNow();

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
    const hasStoredData = storedData && storedData.length;
    const query = hasStoredData && storedData
      .map(({ name }) => name)
      .filter(name => name !== 'Worldwide');
    const hasGlobal = query.length !== storedData.length;
    const hasOnlyGlobal = hasGlobal & storedData.length === 1;

    const getData = async () => {
      const globalHistory = await fetchHistoryData(hasStoredData && !hasOnlyGlobal && storedData);
      setSelectedCountries(globalHistory);

      const globalData = await fetchDataDetails();
      const selectedCountriesData = await fetchDataDetails(query);

      if (!hasStoredData || hasOnlyGlobal) return setData(globalData);
      if (hasGlobal) {
        const newData = [...globalData, ...selectedCountriesData];
        return setData(newData);
      }
      return setData(selectedCountriesData);
    };
    getData();
  }, []);
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
              handleCountry={handleCountry}
              data={data}
              setData={setData}
              radius={0}
              selector
            />
          </div>

          <Block 
            id='overTime' 
            title='Cases over time' 
            subtitle={`${capitalize(getTypeText(activeType))} cases`}
            source={selected && 'Source: Johns Hopkins University'}
          >
            {selected && (<div className={styles.chart}>
              <LineChart selectedCountries={selectedCountries} type={activeType} />
            </div>)}
          </Block>

          <Block
            id='countriesTotal'
            title='Total cases' 
            subtitle={`${capitalize(getTypeText(activeType))} cases`}
            source={selected && `Updated ${lastUpdated}`}
          >
            <table style={{ width: '100%', textAlign: 'right', fontSize: 14, margin: 'auto' }}>
              <thead>
                <tr style={{ textAlign: 'center', fontSize: 12 }}>
                  <th>Country</th>
                  <th>{capitalize(getTypeText(activeType))}</th>
                  <th>{capitalize(getTypeText(activeType))} / 1M</th>
                </tr>
              </thead>
              <tbody>
                {data.map(({ name, data: { cases, casesPerOneMillion, countryInfo }}, index) => (
                  <tr 
                    key={uuid()} 
                    style={{ 
                      background: index % 2 ? null : 'rgba(255, 255, 255, 0.07)',
                    }}
                  >
                    <td style={{ textAlign: 'left', fontSize: 12, paddingLeft: 8 }}>
                      {name === 'Worldwide' ? (<span style={{ height: 48 }}><PublicIcon /></span>) : (
                        <img src={countryInfo.flag} alt={name} style={{ marginRight: 8 }} />
                      )}
                      <span>{name}</span>
                    </td>
                    <td>{cases.toLocaleString()}</td>
                    <td>{casesPerOneMillion.toLocaleString()}</td>
                  </tr>))}
              </tbody>
            </table>
          </Block>
        </>
      ) : (
        <Progress />
      )}
    </section>
  );
};

export default History;