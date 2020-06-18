import axios from 'axios';

const url = 'https://corona.lmao.ninja/v2';
const url_JHU = 'https://disease.sh/v2/historical';

const initial = {
  name: 'Worldwide',
  flag: null,
  lat: 20,
  long: 15,
};

const handleError = (error) => {
  if (axios.isCancel(error)) console.log('api cancel');
  else throw error;
};

export const fetchCountries = async () => {
  let source = axios.CancelToken.source();
  try {
    const { data } = await axios.get(`${url}/countries`, {
      cancelToken: source.token,
    });
    const countries = data.map(
      ({ country: name, cases, countryInfo: { lat, long, flag } }) => ({
        name,
        lat,
        long,
        flag,
        cases,
      })
    );
    return [initial, ...countries];
  } catch (error) {
    handleError(error);
  }
};

export const fetchData = async (country) => {
  let source = axios.CancelToken.source();
  let changeableUrl = `${url}/all`;
  if (country && country !== 'Worldwide') 
    changeableUrl = `${url}/countries/${country}`;

  try {
    const {
      data: {
        cases,
        todayCases,
        recovered,
        todayRecovered,
        deaths,
        todayDeaths,
        updated,
        active,
      },
    } = await axios.get(changeableUrl, { cancelToken: source.token });
    return {
      cases,
      todayCases,
      recovered,
      todayRecovered,
      deaths,
      todayDeaths,
      updated,
      active,
    };
  } catch (error) {
    handleError(error);
  }
};

export const fetchHistoryData = async (countries, days) => {
  const day = days ? days : 'all';
  let source = axios.CancelToken.source();
  try {
    const countriesName = countries && countries.map(({ name }) => name);
    const query = countries ? encodeURIComponent(countriesName) : 'all';
    const { data } = await axios.get(`${url_JHU}/${query}?lastdays=${day}`, {
      cancelToken: source.token,
    });
    if (!countries) return [{ ...initial, timeline: data }];
    if (countriesName.length === 1) return countries
      .map(({ name, flag, lat, long }) => ({ 
        name, 
        flag, 
        lat, 
        long, 
        timeline: data.timeline,
      }));

    const filteredData = data.filter((d) => d.hasOwnProperty('timeline'));
    let mergedData = [];
    for (let i = 0; i < countries.length; i++) {
      mergedData.push({
        ...countries[i],
        ...filteredData.find(({ country }) => country === countries[i].name),
      });
    }
    return mergedData
      .filter((data) => data.timeline !== undefined)
      .map(({ name, flag, lat, long, timeline }) => ({
        name,
        flag,
        lat,
        long,
        timeline,
      }));
  } catch (error) {
    handleError(error);
  }
};