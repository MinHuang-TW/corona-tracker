import React, { useState, useEffect } from 'react';
import { fetchData } from '../../api';
import { useWindowWidth } from '../Hook';
import { Map } from '../../components';
import { AnchoredTitle, Block, CountryPicker, Chart, Cards, Progress } from '../common';
import styles from './Total.module.css';
import moment from 'moment';

const Total = ({ countries }) => {
  const [data, setData] = useState([]);
  const [country, setCountry] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const windowWidth = useWindowWidth();
  const lastUpdated = moment(data && data.updated).startOf('hour').fromNow();

  const blockLists = [{ 
    id: 'overview', 
    title: 'Cases overview', 
    children: <Cards data={data} /> 
  }, { 
    id: 'breakdown', 
    title: 'Breakdown of Confirmed cases', 
    children: <Chart data={data} bar /> 
  }, { 
    id: 'distribution', 
    title: 'Distribution of Confirmed cases', 
    children: <Chart data={data} /> 
  }];

  const handleCountry = async (country) => {
    setData(await fetchData(country));
  };

  useEffect(() => {
    setCountry(countries[0]);
  }, [countries]);

  useEffect(() => {
    const getData = async () => {
      setData(await fetchData());
    };
    getData();
  }, []);

  return (
    <section id='map'>
      <div className={styles.cover} />
      <Map
        country={country}
        setCountry={setCountry}
        countries={countries}
        handleCountry={handleCountry}
        data={data}
        popupOpen={popupOpen}
        setPopupOpen={setPopupOpen}
      />
      {countries.length ? (
        <div className={styles.body}>
          <AnchoredTitle hrefId='map'>
            {`Coronavirus ${windowWidth > 600 ? '(COVID-19) ' : ''}Cases`}
          </AnchoredTitle>

          <CountryPicker
            country={country}
            setCountry={setCountry}
            countries={countries}
            handleCountry={handleCountry}
            setPopupOpen={setPopupOpen}
          />

          {blockLists.map(({ id, title, children }) =>(
            <Block
              key={id}
              id={id}
              title={title}
              classes={styles[`${id}`]}
              subtitle={country && country.name}
              source={`Updated ${lastUpdated}`}
            >
              {children}
            </Block>))}
        </div>
      ) : (
        <Progress />
      )}
    </section>
  );
};

export default Total;