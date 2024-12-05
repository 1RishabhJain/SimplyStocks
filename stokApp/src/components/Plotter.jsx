import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement);

const Plotter = ({ apikey, symbol }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeSeriesType, setTimeSeriesType] = useState('TIME_SERIES_DAILY');
  //const [timeRange, setTimeRange] = useState('30d');

  // Base URL for the API
  const BASE_URL = "http://t12-env.eba-pkqpyn5m.us-east-2.elasticbeanstalk.com/";

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // Construct the full URL with parameters
        const url = `http://t12-env.eba-pkqpyn5m.us-east-2.elasticbeanstalk.com/api/stockdata/${apikey}?symbol=${symbol}&function=${timeSeriesType}`;
        console.log(url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'X-Requested-With': 'XMLHttpRequest', // Indicates the request is made via AJAX
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);

        const timeSeriesKey = {
          TIME_SERIES_DAILY: 'Time Series (Daily)',
          TIME_SERIES_WEEKLY: 'Weekly Time Series',
          TIME_SERIES_MONTHLY: 'Monthly Time Series',
        }[timeSeriesType];

        // Determining whether it's pulling daily, weekly or monthly data
        let timeSeries;
        if (timeSeriesType === 'TIME_SERIES_DAILY') {
          timeSeries = data['Time Series (Daily)'];
        } 
        else if (timeSeriesType === 'TIME_SERIES_WEEKLY') {
          timeSeries = data['Weekly Time Series'];
        }
        else if (timeSeriesType === 'TIME_SERIES_MONTHLY') {
          timeSeries = data['Monthly Time Series'];
        }

        // Process data for chart rendering
        const dates = Object.keys(timeSeries); // Loading the dates

        const highValues = dates.map((date) => ({
          date,
          high: parseFloat(timeSeries[date]['2. high']),
          low: parseFloat(timeSeries[date]['3. low']),
          open: parseFloat(timeSeries[date]['1. open']),
          close: parseFloat(timeSeries[date]['4. close']),
        }));

        // Prepare chart data
        const chartData = {
          labels: dates,
          datasets: [
            {
              label: 'High Prices',
              data: highValues.map((item) => item.high),
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              tension: 0.4,
            },
          ],
          meta: highValues,
        };

        setChartData(chartData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStockData();
  }, [apikey, symbol, timeSeriesType]);

  const handleTimeSeriesChange = (event) => {
    setTimeSeriesType(event.target.value);
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return chartData.labels[index];
          },
          label: (tooltipItem) => {
            const index = tooltipItem.dataIndex;
            const meta = chartData.meta[index];
            //const dataPoint = chartData.datasets[0].data[index];
            return [
              `High: $${meta.high.toFixed(2)}`,
              `Low: $${meta.low.toFixed(2)}`,
              `Open: $${meta.open.toFixed(2)}`,
              `Close: $${meta.close.toFixed(2)}`,
            ];
          },
        },
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Dates',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Prices',
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <div>
        <label>
          Date Range:
          <select value={timeSeriesType} onChange={handleTimeSeriesChange}>
            <option value="TIME_SERIES_DAILY">Daily</option>
            <option value="TIME_SERIES_WEEKLY">Weekly</option>
            <option value="TIME_SERIES_MONTHLY">Monthly</option>
          </select>
        </label>
      </div>
      {loading && <p>Loading...</p>}
      {chartData && <Line data={chartData} options={options} />}
    </div>
  );
};

export default Plotter;
