import axios from 'axios';

const url = 'https://corona.lmao.ninja/v2';

export const fetchData = async (country) => {
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
    console.log(error);
  }
};

export const fetchGlobalData = async () => {
  try {
    const { data } = await axios.get(`${url}/historical/all?lastdays=all`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchCountries = async () => {
  try {
    const { data } = await axios.get(`${url}/countries`);
    return data.map(({ country, countryInfo, cases }) => ({
      name: country,
      ...countryInfo,
      cases,
    }));
  } catch (error) {
    console.log(error);
  }
};
