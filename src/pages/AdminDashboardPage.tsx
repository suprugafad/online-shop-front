import React, {useEffect, useState} from 'react';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Box,
  Divider,
  Container,
  CircularProgress
} from '@mui/material';
import LineChart from "../components/LineChart";
import salesApi from "../api/SalesAPI";
import HeaderAdmin from "../components/admin/HeaderAdmin";

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string,
    borderWidth: number;
  }[];
};

const AdminDashboard: React.FC = () => {
  const [salesChartData, setSalesChartData] = useState<ChartData | undefined>(undefined);
  const [totalSales, setTotalSales] = useState<number>(0);
  const [customers, setCustomers] = useState<number>(0);
  const [deliveredOrders, setDeliveredOrders] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    fetchMonthlySales().catch(() => {});
    fetchAmountOfCustomers().catch(() => {});
    fetchTotalSales().catch(() => {});
    fetchAmountOfDeliveredOrders().catch(() => {});
    setTimeout(() => {
      setIsLoading(false)
    }, 500);
  }, []);

  const fetchAmountOfCustomers = async () => {
    const customers = await salesApi.getAmountOfCustomers();
    setCustomers(customers);
  }

  const fetchAmountOfDeliveredOrders = async () => {
    const customers = await salesApi.getAmountOfDeliveredOrders();
    setDeliveredOrders(customers);
  }

  const fetchTotalSales = async () => {
    const totalSales = await salesApi.getTotalSales();
    setTotalSales(totalSales);
  }

  const fetchMonthlySales = async () => {
    const salesData = await salesApi.getMonthlySales();

    if (salesData) {
      setSalesChartData(salesData);
    } else {
      setSalesChartData({
        labels: [],
        datasets: [],
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <HeaderAdmin title={"GameScape"}></HeaderAdmin>
        <Container maxWidth="sm">
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
            <CircularProgress/>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <HeaderAdmin title={"GameScape"}></HeaderAdmin>
      <Grid container style={{width: '80%', textAlign: 'center', margin: 'auto', marginBottom: '20px'}}>
        <Box width='100%'>
          <Typography variant="h4" marginTop='20px' marginBottom='20px'>Statistics</Typography>
          <Divider/>
        </Box>
        <Box style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '30px'}}>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardHeader title="Total Sales"/>
              <CardContent>
                <Typography variant="h4">{totalSales}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardHeader title="Delivered Orders"/>
              <CardContent>
                <Typography variant="h4">{deliveredOrders}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardHeader title="Customers"/>
              <CardContent>
                <Typography variant="h4">{customers}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Box>
        <Grid item xs={12}>
          <Paper style={{marginTop: '20px'}}>
            <Typography variant="h5">Sales Chart</Typography>
            {salesChartData && <LineChart chartData={salesChartData}/>}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default AdminDashboard;
