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

  // Base URL for the API
  const BASE_URL = "http://t7-env.eba-nqn9uaid.us-east-2.elasticbeanstalk.com";

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // Construct the full URL with parameters
        const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
        const url = `${CORS_PROXY}http://t7-env.eba-nqn9uaid.us-east-2.elasticbeanstalk.com/api/stockdata/${apikey}?symbol=${symbol}&function=TIME_SERIES_DAILY`;
        console.log(url)
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Origin': 'http://localhost:5173', // Specify your frontend origin
            'X-Requested-With': 'XMLHttpRequest', // Indicates the request is made via AJAX
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);
        // Process data for chart rendering
        const timeSeries = data['Time Series (Daily)'];
        const dates = Object.keys(timeSeries).reverse(); // Dates in ascending order
        const highValues = dates.map((date) => parseFloat(timeSeries[date]['4. close']));

        // Prepare chart data
        const chartData = {
          labels: dates,
          datasets: [
            {
              label: 'High Prices',
              data: highValues,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              tension: 0.4,
            },
          ],
        };

        setChartData(chartData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStockData();
  }, [apikey, symbol]);

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
            const date = chartData.labels[index];
            const dataPoint = chartData.datasets[0].data[index];
            return [
              `High: $${dataPoint.toFixed(2)}`,
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
          text: 'High Prices',
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      {loading && <p>Loading...</p>}
      {chartData && <Line data={chartData} options={options} />}
    </div>
  );
};

export default Plotter;
