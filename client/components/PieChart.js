// import React from 'react';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const PieChart = ({ data, questionText, optionALabel, optionBLabel }) => {
//   const chartData = {
//     labels: [optionALabel, optionBLabel, 'No Vote'],
//     datasets: [
//       {
//         data: [data.percentageA, data.percentageB, data.percentageNoVote],
//         backgroundColor: ['#4CAF50', '#FF5722', '#9E9E9E'],
//         hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
//       },
//     ],
//   };

//   return (
//     <div className="qotd-pie-chart">
//       <h3 className="qotd-pie-chart-title">{questionText}</h3>
//       <Pie data={chartData} />
//     </div>
//   );
// };

// export default PieChart;

// import React from 'react';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const PieChart = ({ data, questionText, optionALabel, optionBLabel }) => {
//   // Define your theme colors
//   const themeColors = {
//     primary: '#124e66',    // Deep blue
//     secondary: '#748D92',  // Medium grayish-blue
//     accent: '#d3d9d4',     // Light grayish-blue
//     textColor: '#2E3944',  // Dark gray
//     backgroundColor: '#fff',
//   };

//   // Chart Data
//   const chartData = {
//     labels: [optionALabel, optionBLabel, 'No Vote'],
//     datasets: [
//       {
//         data: [data.percentageA, data.percentageB, data.percentageNoVote],
//         backgroundColor: [themeColors.primary, themeColors.secondary, themeColors.accent],
//         hoverBackgroundColor: [
//           shadeColor(themeColors.primary, -10),
//           shadeColor(themeColors.secondary, -10),
//           shadeColor(themeColors.accent, -10),
//         ],
//         borderColor: '#fff',
//         borderWidth: 2,
//       },
//     ],
//   };

//   // Chart Options
//   const options = {
//     plugins: {
//       legend: {
//         display: true,
//         position: 'bottom',
//         labels: {
//           font: {
//             size: 14,
//             family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
//           },
//           color: themeColors.textColor,
//         },
//       },
//       tooltip: {
//         enabled: true,
//         backgroundColor: 'rgba(0,0,0,0.7)',
//         titleFont: {
//           size: 16,
//           family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
//         },
//         bodyFont: {
//           size: 14,
//           family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
//         },
//         bodySpacing: 4,
//         padding: 10,
//         cornerRadius: 4,
//       },
//     },
//     layout: {
//       padding: {
//         top: 20,
//       },
//     },
//     maintainAspectRatio: false,
//     responsive: true,
//   };

//   // Function to shade colors
//   function shadeColor(color, percent) {
//     let R = parseInt(color.substring(1, 3), 16);
//     let G = parseInt(color.substring(3, 5), 16);
//     let B = parseInt(color.substring(5, 7), 16);

//     R = parseInt((R * (100 + percent)) / 100);
//     G = parseInt((G * (100 + percent)) / 100);
//     B = parseInt((B * (100 + percent)) / 100);

//     R = R < 255 ? R : 255;
//     G = G < 255 ? G : 255;
//     B = B < 255 ? B : 255;

//     const RR = (R.toString(16).length === 1 ? '0' : '') + R.toString(16);
//     const GG = (G.toString(16).length === 1 ? '0' : '') + G.toString(16);
//     const BB = (B.toString(16).length === 1 ? '0' : '') + B.toString(16);

//     return '#' + RR + GG + BB;
//   }

//   return (
//     <div
//       className="qotd-pie-chart"
//       style={{
//         position: 'relative',
//         height: '400px',
//         backgroundColor: themeColors.backgroundColor,
//         boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
//         borderRadius: '10px',
//         padding: '20px',
//         margin: '20px auto',
//         maxWidth: '500px',
//       }}
//     >

//       <h3
//         className="qotd-pie-chart-title"
//         style={{
//           textAlign: 'center',
//           marginBottom: '20px',
//           fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
//           color: themeColors.textColor,
//         }}
//       >
//         {questionText}
//       </h3>
//       <Pie data={chartData} options={options} />
//     </div>
//   );
// };

// export default PieChart;


import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, questionText, optionALabel, optionBLabel }) => {
  // Define your theme colors
  const themeColors = {
    primary: '#124e66',    // Deep blue
    secondary: '#748D92',  // Medium grayish-blue
    accent: '#d3d9d4',     // Light grayish-blue
    textColor: '#2E3944',  // Dark gray
    backgroundColor: '#fff',
  };

  // Chart Data
  const chartData = {
    labels: [optionALabel, optionBLabel, 'No Vote'],
    datasets: [
      {
        data: [data.percentageA, data.percentageB, data.percentageNoVote],
        backgroundColor: [themeColors.primary, themeColors.accent, themeColors.secondary],
        hoverBackgroundColor: [
          shadeColor(themeColors.primary, -10),
          shadeColor(themeColors.accent, -10),
          shadeColor(themeColors.secondary, -10),
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  // Chart Options
  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: {
            size: 14,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          },
          color: themeColors.textColor,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleFont: {
          size: 16,
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        },
        bodyFont: {
          size: 14,
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        },
        bodySpacing: 4,
        padding: 10,
        cornerRadius: 4,
      },
    },
    layout: {
      padding: {
        top: 20,
      },
    },
    maintainAspectRatio: true, // Changed to true
    responsive: true,
    // aspectRatio: 1, // Remove or adjust if necessary
  };

  // Function to shade colors
  function shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt((R * (100 + percent)) / 100);
    G = parseInt((G * (100 + percent)) / 100);
    B = parseInt((B * (100 + percent)) / 100);

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    const RR = (R.toString(16).length === 1 ? '0' : '') + R.toString(16);
    const GG = (G.toString(16).length === 1 ? '0' : '') + G.toString(16);
    const BB = (B.toString(16).length === 1 ? '0' : '') + B.toString(16);

    return '#' + RR + GG + BB;
  }

  return (
    <div
      className="qotd-pie-chart"
      style={{
        position: 'relative',
        backgroundColor: themeColors.backgroundColor,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        padding: '20px',
        margin: '20px auto',
        maxWidth: '500px',
      }}
    >
      <h3
        className="qotd-pie-chart-title"
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          color: themeColors.textColor,
        }}
      >
        {questionText}
      </h3>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;

