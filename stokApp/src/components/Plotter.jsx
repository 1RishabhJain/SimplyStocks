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
import stockData from '../assets/IBM.json'; // Import JSON file

// Register Chart.js components
ChartJS.register(LineElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement);

const Plotter = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Extract data from JSON
    const timeSeries = stockData['Time Series (Daily)'];
    const dates = Object.keys(timeSeries).reverse(); // Dates in ascending order
    const highValues = dates.map((date) => parseFloat(timeSeries[date]['4. close']));
    const meta = stockData['Meta Data'];
    const info = meta['1. Information'];

    // Prepare chart data
    const data = {
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

    setChartData(data);
  }, []);

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
            const dataPoint = stockData['Time Series (Daily)'][date];
            return [
              `Open: $${parseFloat(dataPoint['1. open']).toFixed(2)}`,
              `High: $${parseFloat(dataPoint['2. high']).toFixed(2)}`,
              `Low: $${parseFloat(dataPoint['3. low']).toFixed(2)}`,
              `Close: $${parseFloat(dataPoint['4. close']).toFixed(2)}`,
              `Volume: ${parseInt(dataPoint['5. volume']).toLocaleString()}`,
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
    <div style={{ width: "100%", height: "500px"}}>
        <h1>info</h1>
      {chartData ? <Line data={chartData} options={options} /> : <p>Loading...</p>}
    </div>
  );
};

export default Plotter;
