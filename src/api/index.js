import axios from 'axios';

const url = 'https://corona.lmao.ninja/v2';
const url_JHU = 'https://disease.sh/v2/historical';

export const fetchData = async (country) => {
  let changeableUrl = `${url}/all`;
  if (country) changeableUrl = `${url}/countries/${country}`;

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
      },
    } = await axios.get(changeableUrl);
    return {
      cases,
      todayCases,
      recovered,
      todayRecovered,
      deaths,
      todayDeaths,
      updated,
    };
  } catch (error) {
    throw error;
  }
};

export const fetchHistoryOverall = async (days) => {
  const day = days ? days : 'all';
  let source = axios.CancelToken.source();

  try {
    const { data } = await axios.get(`${url_JHU}/all?lastdays=${day}`, {
      cancelToken: source.token,
    });
    return {
      name: 'Worldwide',
      flag: null,
      lat: 20,
      long: 15,
      timeline: data,
    };
  } catch (error) {
    if (axios.isCancel(error)) console.log('api cancel');
    else throw error;
  }
};

export const fetchHistoryData = async (countries, days) => {
  const day = days ? days : 'all';
  let source = axios.CancelToken.source();

  try {
    const countriesName = countries.map(({ name }) => name);
    const query = encodeURIComponent(countriesName);
    const { data } = await axios.get(`${url_JHU}/${query}?lastdays=${day}`, {
      cancelToken: source.token,
    });
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
    if (axios.isCancel(error)) console.log('AxiosCancel cancel');
    else throw error;
  }
};

export const fetchCountries = async () => {
  try {
    const { data } = await axios.get(`${url}/countries`);
    return data.map(
      ({ country: name, cases, countryInfo: { lat, long, flag } }) => ({
        name,
        lat,
        long,
        flag,
        cases,
      })
    );
  } catch (error) {
    throw error;
  }
};