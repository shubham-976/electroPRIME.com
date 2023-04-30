import React, { useEffect } from 'react'
import Sidebar from "./Sidebar.js"
import "./Dashboard.css"
import { Typography } from '@material-ui/core'
import { Link } from "react-router-dom";
import { getAllProductsAdmin } from "../../actions/productAction.js"
import { useSelector, useDispatch } from "react-redux";
import { Line, Doughnut } from 'react-chartjs-2';
import {
  //for line chart
  Chart as ChartJS, //these are important things must to be included (these are basic components of line-chart) according to documentation
  CategoryScale, //its must to include x axis
  LinearScale,   //its must to include y axis
  PointElement,  //its must to highlight points in line of graph
  LineElement,   //its must to include line itself in graph
  Title,        //its must to show title of graph
  Tooltip,      //its must to include tooltips (some info or box which is shown when we hover on graph or graph line)
  Legend,       //its must to show rectangular box which tells what this graph line actually denotes
  //some more thinhs needed for Doughnut chart
  ArcElement
} from 'chart.js';
import MetaData from '../layout/MetaData.js';
import { getAllOrders } from '../../actions/orderAction.js';
import { getAllUsers } from '../../actions/userAction.js';
ChartJS.register(
  //for line chart
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  //some more things for doughnut chart
  ArcElement
);


const Dashboard = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products_)
  const { orders } = useSelector((state) => state.allOrders_)
  const { users } = useSelector((state) => state.allUsers_);


  let outOfStock = 0;

  products && products.forEach((item) => {
    if (item.stock === 0) {
      outOfStock += 1;
    }
  })

  let revenue = 0;
  orders && orders.forEach((ord) => {
    revenue += ord.totalPrice;
  })
  revenue = revenue.toFixed(2);


  useEffect(() => {
    dispatch(getAllProductsAdmin());
    dispatch(getAllOrders());
    dispatch(getAllUsers());

  }, [dispatch])

  //for line chart
  const lineState = {
    labels: ['Initial Amount (₹)', 'Amount Earned (₹)'],
    datasets: [
      {
        label: 'Total Amount Collected (₹)',
        data: [0, revenue],
        borderColor: '#e60584',
        backgroundColor: '#e60584'
      }
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', //upar ek rectangular symbol which is telling what this graph denoted, that rectangles's position
      },
      title: {
        display: true,  //this is the main heading of the graph
        text: 'Revenue Chart (Total Money from Sales)',
      },
    },
  };

  //for doughnut chart
  const doughnutState = {
    labels: ["Products Out Of Stock", "Products InStock"],
    datasets: [
      {
        backgroundColor: ["#cc0000", "#009933"],
        hoverBackgroundColor: ["#cc0000", "#009933"],
        data: [outOfStock, products.length - outOfStock]
      }
    ]
  }
  return (
    <>
      <MetaData title="Dashboard - ADMIN" />

      <Sidebar />
      <div className="dashboard">

        <div className="dashBoardContainer">

          <Typography component="h1">Dashboard</Typography>

          <div className="dashboardSummary">
            <div>
              <p>
                Total Revenue generated : <br /> ₹{revenue}
              </p>
            </div>
            {orders && (
              <div><p>
                Total Orders till date : <br /> {orders.length} </p>
              </div>
            )}
            <div className='dashboardSummaryBox2'>
              <Link to="/admin/products">
                <p>{products && products.length}</p>
                <p>Products</p>
              </Link>
              <Link to="/admin/orders">
                <p>{orders && orders.length}</p>
                <p>Orders</p>
              </Link>
              <Link to="/admin/users">
                <p>{users && users.length}</p>
                <p>Users</p>
              </Link>
            </div>
          </div>

          <div className="lineChart">
            <Line data={lineState} options={options} />
          </div>

          <div className="doughnutChart">
            <Doughnut data={doughnutState} />
          </div>

        </div>
      </div>
    </>
  )
}

export default Dashboard