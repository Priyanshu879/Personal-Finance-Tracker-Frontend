import React from "react";
// import CardBox from "./CardBox";
import { Container, Row } from "react-bootstrap";
import CircularProgressBar from "../../components/CircularProgressBar";
import LineProgressBar from "../../components/LineProgressBar";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
// import MovingIcon from '@mui/icons-material/Moving';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import SmartSuggestions from "../../components/SuggestionCard";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const Analytics = ({ transactions }) => {
  const TotalTransactions = transactions.length;
  const totalIncomeTransactions = transactions.filter(
    (item) => item.transactionType === "credit"
  );
  const totalExpenseTransactions = transactions.filter(
    (item) => item.transactionType === "expense"
  );

  let totalIncomePercent =
    (totalIncomeTransactions.length / TotalTransactions) * 100;
  let totalExpensePercent =
    (totalExpenseTransactions.length / TotalTransactions) * 100;

  // console.log(totalIncomePercent, totalExpensePercent);

  const totalTurnOver = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalTurnOverIncome = transactions
    .filter((item) => item.transactionType === "credit")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalTurnOverExpense = transactions
    .filter((item) => item.transactionType === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const TurnOverIncomePercent = (totalTurnOverIncome / totalTurnOver) * 100;
  const TurnOverExpensePercent = (totalTurnOverExpense / totalTurnOver) * 100;

 

  const colors = {
    Groceries: "#FF6384",
    Rent: "#36A2EB",
    Salary: "#FFCE56",
    Tip: "#4BC0C0",
    Food: "#9966FF",
    Medical: "#FF9F40",
    Utilities: "#8AC926",
    Entertainment: "#6A4C93",
    Transportation: "#1982C4",
    Other: "#F45B69",
  };

  // Category wise pie chart data
  
  let categoryWiseExpense = {};
  transactions.forEach((transaction) => {
    if (transaction.transactionType === "expense") {
      if (!categoryWiseExpense[transaction.category]) {
        categoryWiseExpense[transaction.category] = 0;
      }
      categoryWiseExpense[transaction.category] += transaction.amount;
    }
  });
  // console.log("Category Wise Expense:", categoryWiseExpense);

  const pieChartData = {
    categories: Object.keys(categoryWiseExpense),
    labels: Object.keys(categoryWiseExpense),
    datasets: [
      {
        data: Object.values(categoryWiseExpense),
        backgroundColor: Object.values(colors),
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  // Top 3 payment methods bar chart

  let paymentData = {};
  transactions.forEach((transaction) => {
    if (!paymentData[transaction.paymentMethod]) {
      paymentData[transaction.paymentMethod] = 0;
    }
    paymentData[transaction.paymentMethod] += transaction.amount;
  });
  console.log("Payment Data:", paymentData);

  const top3PaymentEntries = Object.entries(paymentData)
    .sort((a, b) => b[1] - a[1]) // sort by amount (descending)
    .slice(0, 3); // take top 3

  const top3PaymentData = Object.fromEntries(top3PaymentEntries);

  console.log("Top 3 Payment Methods:", top3PaymentData);

  const paymentBarChartData = {
    labels: Object.keys(top3PaymentData),
    datasets: [
      {
        data: Object.values(top3PaymentData),
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  const paymentBarChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend if only one dataset
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // line chart data for spending by date

  let spendingByDate = {};

  transactions.forEach((t) => {
    const date = t.date.split("T")[0]; // remove time if present
    if (!spendingByDate[date]) {
      spendingByDate[date] = 0;
    }
    spendingByDate[date] += t.amount;
  });

  // Sort by date
  const sortedDates = Object.keys(spendingByDate).sort();

  const chartLabels = sortedDates;
  const chartData = sortedDates.map((date) => spendingByDate[date]);

  const lineChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Spending Over Time',
        data: chartData,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <Container className="mt-5 d-flex justify-content-center flex-column align-items-center">
        <Row>
          <div className="col-lg-6 col-md-6 mb-4">
            <div className="card h-100 " style={{ width: "30rem" }}>
              <div className="card-header bg-black text-white">
                <span style={{ fontWeight: "bold" }}>Smart Suggestions</span>{" "}
                
              </div>
              <div className="card-body">
                <SmartSuggestions transactions={transactions}/>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 mb-4">
            <div className="card h-100"  style={{ width: "30rem" }}>
              <div className="card-header bg-black text-white ">
                <span style={{ fontWeight: "bold" }}>Total TurnOver:</span>{" "}
                {totalTurnOver}
              </div>
              <div className="card-body">
                <h5 className="card-title" style={{ color: "green" }}>
                  Income: <ArrowDropUpIcon /> {totalTurnOverIncome}{" "}
                  <CurrencyRupeeIcon />
                </h5>
                <h5 className="card-title" style={{ color: "red" }}>
                  Expense: <ArrowDropDownIcon />
                  {totalTurnOverExpense} <CurrencyRupeeIcon />
                </h5>
                <div className="d-flex justify-content-center mt-3">
                  <CircularProgressBar
                    percentage={TurnOverIncomePercent.toFixed(0)}
                    color="green"
                  />
                </div>

                <div className="d-flex justify-content-center mt-4 mb-4">
                  <CircularProgressBar
                    percentage={TurnOverExpensePercent.toFixed(0)}
                    color="red"
                  />
                </div>
              </div>
            </div>
          </div>

          
          
        </Row>
        <Row>
          

          <div className="col-lg-6 col-md-6 mb-4">
            <div className="card h-100" style={{ width: "30rem" }}>
              <div className="card-header bg-black text-white">
                <span style={{ fontWeight: "bold" }}>
                  Category-Wise Spending
                </span>
              </div>
              <div className="card-body">
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6 mb-4">
            <div className="card h-100" style={{ width: "30rem" }}>
              <div className="card-header bg-black text-white ">
                <span style={{ fontWeight: "bold" }}>
                  Top 3 Payment Method{" "}
                </span>
              </div>
              <div className="card-body" style={{ marginTop: "6rem" }}>
                <Bar
                  data={paymentBarChartData}
                  options={paymentBarChartOptions}
                />
              </div>
            </div>
          </div>
          
        </Row>
        <Row>
          

          

          <div className="col-lg-6 col-md-6 mb-4">
            <div className="card h-100"style={{ width: "61.6rem" }}>
              <div className="card-header  bg-black text-white">
                <span style={{ fontWeight: "bold" }}>Spending Changed Over Time</span>
              </div>
              <div className="card-body">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </div>
          </div>

          
        </Row>
      </Container>
    </>
  );
};

export default Analytics;
