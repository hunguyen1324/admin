import React, { useState, useEffect, useMemo } from "react";
import Chart from "react-apexcharts";
import ReactApexChart from 'react-apexcharts';
import { Container, Row, Col } from 'react-bootstrap';
import { FetchAll } from '../../Services/DashboardService';

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getdashboard = async () => {
      try {
        const res = await FetchAll();
        const resData = res.data;

        const transformedData = resData.map(item => ({
          label: item.label,
          men_price: item.men_price,
          women_price: item.women_price,
          total: item.men_price + item.women_price,
          men_product: item.men_product,
          women_product: item.women_product,
          total_product: item.men_product + item.women_product
        }));

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    getdashboard();
    const intervalId = setInterval(getdashboard, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const totalProducts = useMemo(() => {
    return data.reduce((acc, item) => ({
      men_product: acc.men_product + item.men_product,
      women_product: acc.women_product + item.women_product
    }), { men_product: 0, women_product: 0 });
  }, [data]);

  const totalPrices = useMemo(() => {
    return data.reduce((acc, item) => ({
      men_price: acc.men_price + item.men_price,
      women_price: acc.women_price + item.women_price
    }), { men_price: 0, women_price: 0 });
  }, [data]);

  const chartDataProduct = {
    options: {
      chart: { type: 'pie' },
      labels: ['Men Product', 'Women Product'],
    },
    series: [totalProducts.men_product, totalProducts.women_product],
  };

  const chartDataPrice = {
    options: {
      chart: { type: 'pie' },
      labels: ['Men Price', 'Women Price'],
    },
    series: [totalPrices.men_price, totalPrices.women_price],
  };

  const barChartData = {
    options: {
      chart: { id: "basic-bar" },
      xaxis: { categories: data.map(item => item.label) },
    },
    series: [
      {
        name: "Total Price",
        data: data.map(item => item.total),
      },
      {
        name: "Total Quantity",
        data: data.map(item => item.total_product),
      },
    ]
  };

  return (
    <div className="main">
      <Container>
        <div className="App_value">
          <h1>Chart of clothes sold in a year by label <i className="fas fa-user"></i></h1>
          <Row>
            <Col className="col-8">
              <Chart options={barChartData.options} series={barChartData.series} type="bar" width="100%" />
            </Col>
            <Col className="col-4">
              <ReactApexChart options={chartDataProduct.options} series={chartDataProduct.series} type="pie" width="380" />
              <ReactApexChart options={chartDataPrice.options} series={chartDataPrice.series} type="pie" width="380" />
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default Dashboard;
