import axios from 'axios';

const url = 'https://corona.lmao.ninja/v2';

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
      confirmed: cases,
      todayCases,
      recovered,
      todayRecovered,
      deaths,
      todayDeaths,
      lastUpdate: updated,
    };
  } catch (error) {
    console.log(error);
  }
};

export const fetchDailyData = async () => {
  try {
    const { data } = await axios.get(`https://covid19.mathdro.id/api/daily`);
    const modifiedData = data.map((dailyData) => ({
      confirmed: dailyData.confirmed.total,
      deaths: dailyData.deaths.total,
      date: dailyData.reportDate,
    }));
    return modifiedData;
  } catch (error) {
    console.log(error);
  }
};

export const fetchCountries = async () => {
  try {
    const { data } = await axios.get(`${url}/countries`);
    return data.map((d) => ({ name: d.country, ...d.countryInfo }));
  } catch (error) {
    console.log(error);
  }
};
