// importing required tools
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";

// importing stylesheet
import "../Styles/home.css";

// importing navbar
import { Navbar } from "./navbar";

// registering requirements of piechart and graph
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

// importing action function of covid tracker
import {
  searchFailure,
  searchLoading,
  searchSuccess,
} from "../Redux/covidTrackerRedux/covidTrackerActions";

// Main HomePage function and exporting it
export const HomePage = () => {
  // changing background image of body
  document.body.style.background = "none";
  document.body.style.background =
    "url('https://images.unsplash.com/photo-1583423230902-b653abc541eb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center";

  // dispatch function
  const dispatch = useDispatch();

  // getting country name from redux
  const { countrySearch } = useSelector((state) => state.event);

  // props for world data, continent data, countries data
  const [worldData, setworldData] = useState({});
  const [contientData, setcontientData] = useState([]);
  const [countriesData, setcountriesData] = useState([]);

  // getting world, continent, and countries covid report data
  useEffect(() => {
    axios.get("https://corona.lmao.ninja/v2/all?today").then((res) => {
      setworldData(() => res.data);
    });
    axios
      .get("https://corona.lmao.ninja/v2/continents?today=true&sort")
      .then((res) => {
        setcontientData(() => res.data);
      });
    axios
      .get("https://corona.lmao.ninja/v2/countries?yesterday&sort")
      .then((res) => {
        setcountriesData(() => res.data);
      });
  }, []);

  // searched country prop
  const [searched, setsearched] = useState(countrySearch);

  // changing searched prop according redux countrysearch
  useEffect(() => {
    setsearched(() => countrySearch);
  }, [countrySearch]);

  // searched country data
  const [searchedcountryData, setsearchedcountryData] = useState([]);

  // fetching searched country data
  useEffect(() => {
    axios
      .get(
        `https://corona.lmao.ninja/v2/countries/${searched}?yesterday=true&strict=true&query`,
      )
      .then((res) => {
        if (res.data.message) {
          dispatch(searchSuccess("india"));
        }

        setsearchedcountryData(() => res.data);
      })
      .catch((error) => {
        dispatch(searchSuccess("india"));
      });
  }, [searched]);

  // pie chart data
  const piedata = {
    labels: ["deaths", "recovered", "cases"],
    datasets: [
      {
        label: "# of Votes",
        data: [
          searchedcountryData.deathsPerOneMillion,
          searchedcountryData.recoveredPerOneMillion,
          searchedcountryData.casesPerOneMillion,
        ],
        backgroundColor: ["red", "green", "yellow"],
        borderColor: ["red", "green", "yellow"],
        borderWidth: 1,
      },
    ],
  };

  // starting date and end date for graph
  const [startDate, setstartDate] = useState("2022-01-01T00:00:00Z");
  const [endDate, setendDate] = useState("2022-06-16T00:00:00Z");

  // handling changes in startin data or end date
  const handleChangeDate = (prop, value) => {
    if (prop == "start") {
      setstartDate(() => value + "T00:00:00Z");
    } else {
      setendDate(() => value + "T00:00:00Z");
    }
  };

  // graph data props
  const [chartcases, setchartcases] = useState([]);
  const [chartdate, setchartdate] = useState([]);

  // fetching data of graph as per starting date and end date
  useEffect(() => {
    axios
      .get(
        `https://api.covid19api.com/country/${searched}/status/confirmed?from=${startDate}&to=${endDate}`,
      )
      .then((res) => {
        if (res.data.message) {
          alert("ERROR! search a country");
          dispatch(searchSuccess("india"));
        }

        let cases = [];
        let date = [];

        res.data.map(({ Cases, Date }, index) => {
          if (index % 2 == 0) {
            cases.push(Cases);
            date.push(Date.split("T")[0]);
          }
        });

        setchartcases(() => cases);
        setchartdate(() => date);
      })
      .catch((error) => {
        alert("ERROR! search a country");
        dispatch(searchSuccess("india"));
      });
  }, [searched, startDate, endDate]);

  // graph data
  const data = {
    labels: chartdate,
    datasets: [
      {
        label: "cases",
        data: chartcases,
        backgroundColor: "yellow",
        borderColor: "green",
        tension: 0.4,
        fill: true,
        pointStyle: "rect",
        pointBorderColor: "blue",
        pointBackgroundColor: "#fff",
        showLine: true,
      },
    ],
  };

  console.clear();

  // return div to render
  return (
    <div>
      {/* navbar */}
      <Navbar />
      {/* main display div */}
      <div id="display-main-div">
        {/* main world wide div */}
        <div id="world-covid-data-div">
          <h1>World Wide Report</h1>
          {/* active and critical cases main div */}
          <div id="world-wide-active-critical-div">
            <div key={912}>
              <h2>Active Case</h2>
              <p>{worldData.active}</p>
            </div>
            <div className="line-between-div"></div>
            <div key={913}>
              <h2>Critical Case</h2>
              <p>{worldData.critical}</p>
            </div>
          </div>
          <div>
            {/* today report div */}
            <h2>Today's covid report</h2>
            <div id="world-wide-total-report-div">
              <div key={914}>
                <h2>Cases</h2>
                <p>{worldData.todayCases}</p>
              </div>
              <div className="line-between-div"></div>
              <div key={915}>
                <h2>Deaths</h2>
                <p>{worldData.todayDeaths}</p>
              </div>
              <div className="line-between-div"></div>
              <div key={916}>
                <h2>Recovered</h2>
                <p>{worldData.todayRecovered}</p>
              </div>
            </div>
          </div>
          <div>
            {/* total cases report div */}
            <h2>Total covid report</h2>
            <div id="world-wide-total-report-div">
              <div key={917}>
                <h2>Cases</h2>
                <p>{worldData.cases}</p>
              </div>
              <div className="line-between-div"></div>
              <div key={918}>
                <h2>Deaths</h2>
                <p>{worldData.deaths}</p>
              </div>
              <div className="line-between-div"></div>
              <div key={919}>
                <h2>Recovered</h2>
                <p>{worldData.recovered}</p>
              </div>
            </div>
          </div>
          {/* continents table main div */}
          <div className="continent-countries-table-div">
            <h2>Continents today's covid report</h2>
            <table className="contient-countries-table">
              <thead>
                <tr>
                  <th align="left">Continents Name</th>
                  <th align="right">Cases</th>
                  <th align="right">Deaths</th>
                  <th align="right">Recovers</th>
                </tr>
              </thead>
              <tbody>
                {contientData.map(
                  (
                    { todayCases, todayDeaths, todayRecovered, continent },
                    index,
                  ) => (
                    <tr key={index}>
                      <td align="left">{continent}</td>
                      <td align="right">{todayCases}</td>
                      <td align="right">{todayDeaths}</td>
                      <td align="right">{todayRecovered}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
          {/* countries table main div */}
          <div className="continent-countries-table-div">
            <h2>Countries total covid report</h2>
            <table className="contient-countries-table">
              <thead>
                <tr>
                  <th>Continents Name</th>
                  <th align="right">Cases</th>
                  <th align="right">Deaths</th>
                  <th align="right">Recovers</th>
                </tr>
              </thead>
              <tbody>
                {countriesData.map(
                  ({ cases, deaths, recovered, country }, index) => (
                    <tr key={index}>
                      <td align="left">{country}</td>
                      <td align="right">{cases}</td>
                      <td align="right">{deaths}</td>
                      <td align="right">{recovered}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* main searched country div */}
        <div id="searched-country-data-div">
          {/* country detail div (name, population and continent) */}
          <div id="country-flag-name-detail-div">
            <div>
              <h1 key={987653}>{searchedcountryData.country}</h1>
            </div>
            <div>
              <p key={searchedcountryData.population}>
                <strong>Population :-</strong> {searchedcountryData.population}
              </p>
              <p>
                <strong>Continent :-</strong> {searchedcountryData.continent}
              </p>
            </div>
          </div>
          {/* country today datat and total data box */}
          <div id="country-total-today-cases-div">
            <div>
              <h2>Country today's cases</h2>
              <div>
                <div key={searchedcountryData.todayCases}>
                  <h2>Cases</h2>
                  <p>{searchedcountryData.todayCases}</p>
                </div>
                <div className="line-between-div"></div>
                <div key={searchedcountryData.todayDeaths}>
                  <h2>Deaths</h2>
                  <p>{searchedcountryData.todayDeaths}</p>
                </div>
                <div className="line-between-div"></div>
                <div key={searchedcountryData.todayRecovered}>
                  <h2>Recovered</h2>
                  <p>{searchedcountryData.todayRecovered}</p>
                </div>
              </div>
            </div>
            <div>
              <h2>Country Total cases</h2>
              <div>
                <div key={searchedcountryData.cases}>
                  <h2>Cases</h2>
                  <p>{searchedcountryData.cases}</p>
                </div>
                <div className="line-between-div"></div>
                <div key={searchedcountryData.deaths}>
                  <h2>Deaths</h2>
                  <p>{searchedcountryData.deaths}</p>
                </div>
                <div className="line-between-div"></div>
                <div key={searchedcountryData.recovered}>
                  <h2>Recovered</h2>
                  <p>{searchedcountryData.recovered}</p>
                </div>
              </div>
            </div>
          </div>
          {/* country active and critical cases div */}
          <div id="country-active-critical-div">
            <div key={searchedcountryData.active}>
              <h2>Active Case</h2>
              <p>{searchedcountryData.active}</p>
            </div>
            <div className="line-between-div"></div>
            <div key={searchedcountryData.critical}>
              <h2>Critical Case</h2>
              <p>{searchedcountryData.critical}</p>
            </div>
          </div>
          {/* Pie chart div */}
          <div id="pie-chart-status">
            <h2>Report per million</h2>
            <div className="chart-pie-div">
              <Pie
                data={piedata}
                width={100}
                height={100}
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          </div>
          {/* graph div */}
          <div id="graph-representation">
            <h2>
              Graphical representation (from {startDate.split("T")[0]} to{" "}
              {endDate.split("T")[0]})
            </h2>
            <div id="select-date-div">
              <input
                type="date"
                onChange={(event) =>
                  handleChangeDate("start", event.target.value)
                }
                className="select-date-input"
              />
              <input
                type="date"
                onChange={(event) =>
                  handleChangeDate("end", event.target.value)
                }
                className="select-date-input"
              />
            </div>
            <div className="chart-pie-div">
              <Line data={data}>Hello</Line>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
