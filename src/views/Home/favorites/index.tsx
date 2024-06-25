import { AppBar, Box, Button, Container, Grid, Stack, Tab, Tabs, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { TabPanel, tabProps } from "../../../components/tabs";

import Chat from "../../../assets/icons/chat.svg";
import Deleat from "../../../assets/icons/deleat.svg";
import Item1 from "../../../assets/icons/item_1.svg";
import Item2 from "../../../assets/icons/item_2.svg";
import Item3 from "../../../assets/icons/item_3.svg";
import Logo from "../../../assets/icons/logo.svg";
import { isLoggedIn } from "../../../services/auth/auth.service";
import { useNavigate } from "react-router-dom";

export default function FavouritePage() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const router = useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (!isLoggedIn()) {
      router("/");
    } else {
      setIsLoaded(true);
    }
  }, [router]);

  return (
 <>
 {

isLoaded && <Box>
<Box component="main" className="signup-page">
  <Container maxWidth={false}>
    {/*------- HEADE START HEAR -------*/}
    <Box className="head">
      <Box className="logo">
        <img src={Logo} alt="input_icon" width={200} />
      </Box>
      <Typography className="menu">Contact Us</Typography>
    </Box>
    <Stack className="heading" direction="row" justifyContent="center" alignItems="center" flexDirection="column">
      {/* Sign Up */}
      <p></p>
    </Stack>
  </Container>
  <Container maxWidth="lg">
    <Box className="main-box">
      <Box sx={{ bgcolor: "background.paper" }}>
        <AppBar position="static" className="tabs-bar">
          <Tabs value={value} onChange={handleChange} style={{ background: "#ffffff" }} indicatorColor="primary" textColor="inherit" variant="fullWidth">
            <Tab className="tab-btn" label=" My Favorite Protocols" {...tabProps(0)} />
            <Tab className="tab-btn" label="My Favorite Prescriptions" {...tabProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Box className="favorites" mt={18}>
            <Container maxWidth="sm">
              <Box className="favorites_out">
                <Box className="item_side">
                  <span>
                    <img src={Item1} alt="input_icon" width={35} />
                  </span>
                  My First Favorite
                </Box>
                <Box className="order_side">
                  <ul>
                    <li>
                      <Button
                        variant="contained"
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          backgroundColor: "#00ACBA",
                          border: "1px solid #00ACBA",
                          borderRadius: "8px",
                          boxShadow: "none",
                          height: "31px",
                          width: "70px",
                          marginInline: "auto",
                          textTransform: "capitalize",
                        }}
                      >
                        Order
                      </Button>
                    </li>
                    <li>
                      <img src={Deleat} alt="input_icon" width={32} />
                    </li>
                  </ul>
                </Box>
              </Box>
              <Box className="favorites_out favorites_in">
                <Box className="item_side">
                  <span>
                    <img src={Item2} alt="input_icon" width={35} />
                  </span>
                  My First Favorite
                </Box>
                <Box className="order_side">
                  <ul>
                    <li>
                      <Button
                        variant="contained"
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          backgroundColor: "#00ACBA",
                          border: "1px solid #00ACBA",
                          borderRadius: "8px",
                          boxShadow: "none",
                          height: "31px",
                          width: "70px",
                          marginInline: "auto",
                          textTransform: "capitalize",
                        }}
                      >
                        Order
                      </Button>
                    </li>
                    <li>
                      <img src={Deleat} alt="input_icon" width={32} />
                    </li>
                  </ul>
                </Box>
              </Box>
              <Box className="favorites_out">
                <Box className="item_side">
                  <span>
                    <img src={Item3} alt="input_icon" width={35} />
                  </span>
                  My First Favorite
                </Box>
                <Box className="order_side">
                  <ul>
                    <li>
                      <Button
                        variant="contained"
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          backgroundColor: "#00ACBA",
                          border: "1px solid #00ACBA",
                          borderRadius: "8px",
                          boxShadow: "none",
                          height: "31px",
                          width: "70px",
                          marginInline: "auto",
                          textTransform: "capitalize",
                        }}
                      >
                        Order
                      </Button>
                    </li>
                    <li>
                      <img src={Deleat} alt="input_icon" width={32} />
                    </li>
                  </ul>
                </Box>
              </Box>
              <Box className="favorites_out favorites_in">
                <Box className="item_side">
                  <span>
                    <img src={Item2} alt="input_icon" width={35} />
                  </span>
                  My First Favorite
                </Box>
                <Box className="order_side">
                  <ul>
                    <li>
                      <Button
                        variant="contained"
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          backgroundColor: "#00ACBA",
                          border: "1px solid #00ACBA",
                          borderRadius: "8px",
                          boxShadow: "none",
                          height: "31px",
                          width: "70px",
                          marginInline: "auto",
                          textTransform: "capitalize",
                        }}
                      >
                        Order
                      </Button>
                    </li>
                    <li>
                      <img src={Deleat} alt="input_icon" width={32} />
                    </li>
                  </ul>
                </Box>
              </Box>
            </Container>
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Box>
            <Stack className="about"></Stack>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography className="info">
                  Prescriber Details
                  <p>Provide prescriber info</p>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Stack className="inputs_out" direction="column">
                  <Grid lg={12}>
                    {/* <InputText
                      helperText="Shiping City is required"
                      required={true}
                      label="Prescriber First Name"
                      name="shiping-city"
                    /> */}
                  </Grid>
                  <Grid lg={12}>
                    {/* <InputText
                      helperText="Shiping City is required"
                      required={true}
                      label="Prescriber Last Name"
                      name="shiping-city"
                    /> */}
                  </Grid>
                  <Grid lg={12}>
                    {/* <InputText
                      helperText="Shiping City is required"
                      required={true}
                      label="Prescriber Phone"
                      name="shiping-city"
                    /> */}
                  </Grid>
                  <Grid lg={12}>
                    {/* <InputText
                      helperText="Shiping City is required"
                      required={true}
                      label="Prescriber Email"
                      name="shiping-city"
                    /> */}
                  </Grid>
                </Stack>
              </Grid>
            </Grid>
            <Box className="devider"></Box>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography className="info">
                  Staff Member Details
                  <p>Provide staff member info</p>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Stack className="inputs_out" direction="column">
                  <Grid lg={12}>
                    {/* <InputText
                      helperText="Shiping City is required"
                      required={true}
                      label="Staffing First Name*"
                      name="shiping-city"
                    /> */}
                  </Grid>
                </Stack>
                <Stack className="inputs_out" direction="column">
                  <Grid lg={12}>
                    {/* <InputText
                      helperText="Shiping City is required"
                      required={true}
                      label="Staffing First Name*"
                      name="shiping-city"
                    /> */}
                  </Grid>
                </Stack>
                <Stack className="inputs_out" direction="column">
                  <Grid lg={12}>
                    {/* <InputText
                      helperText="Shiping City is required"
                      required={true}
                      label="Staffing Phone*"
                      name="shiping-city"
                    /> */}
                  </Grid>
                </Stack>
                <Stack className="inputs_out" direction="column">
                  <Grid lg={12}>
                    {/* <InputText
                      helperText="Shiping City is required"
                      required={true}
                      label="Staffing Email*"
                      name="shiping-city"
                    /> */}
                  </Grid>
                </Stack>
                <Stack className="inputs_out d-vh-between" direction="row">
                  <Box className="mandatory">
                    <span>*</span> This field is mandatory
                  </Box>
                  <Box className="register">
                    <ul>
                      <li>
                        <button className="btn">Cancel</button>
                      </li>
                      <li>
                        <button className="btn reg">Register</button>
                      </li>
                    </ul>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Box>
    </Box>
  </Container>
</Box>
<Box className="chat-floating-icon">
  <img src={Chat} alt="logo" height={65} width={65} />
</Box>
</Box>
 }
 </>
  );
}

