import { AddNewCardFormHandler, addNewCardForm } from '../../../services/pages/popup-form/AddNewCardForm.service';
import { Box, Button, Container, DialogContent, Grid, Stack, Typography } from '@mui/material';
import { FieldControl, FieldGroup } from 'react-reactive-form';

import { InputCvv } from "../../../core/forms/InputCvv";
import { InputExpiryDate } from "../../../core/forms/InputExpiryDate";
import { InputText } from "../../../core/forms/inputs/InputText";
import { InputTextCC } from "../../../core/forms/InputTextCC";
import { InputZipCode } from "../../../core/forms/inputs/InputZipCode";
import React from "react";
import { useNavigate } from "react-router-dom";

export const AddNewCard = (props: { handleClose: (e: React.SyntheticEvent) => void}) => {
  const router = useNavigate();

  const handleCard = async (e: React.SyntheticEvent) => {
    const res = await AddNewCardFormHandler(e, router);
    if (res === 'OK') props.handleClose(e);
  };
  
  return (
    <>
      <DialogContent dividers className="popup_content" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Box component="main" className="card-info">
          <Container maxWidth="lg">
            <Box className="main-box">
              <Box sx={{ bgcolor: 'background.paper' }}>
                <Stack className="modal_heading_main" direction="row" justifyContent="center" alignItems="center">
                  <Typography className="heading_bottom_without_border">Add New Card</Typography>
                </Stack>
                <FieldGroup
                  control={addNewCardForm}
                  render={({ get, invalid }) => (
                    <form>
                      <Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Stack className="inputs_fields_ratio" direction="row">
                              <Grid xs={12}>
                                <FieldControl name="cc_number" render={InputTextCC} meta={{ name: 'cc_number', label: 'Card Number', placeholder: 'Please Enter Card Number', helperText: 'Card Number is required' }} />
                              </Grid>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={6} md={6} lg={6}>
                            <FieldControl name="exp_date" render={InputExpiryDate} meta={{ helperText: "Exp. Date is required.", label: "Exp. Date", name: "exp_date", placeholder: "Please Enter Exp Date", value: "exp_date" }} />
                          </Grid>
                          <Grid item xs={12} sm={6} md={6} lg={6}>
                            <Stack className="inputs_fields_ratio" direction="row">
                              <Grid xs={12}>
                                <FieldControl
                                  name="cvc"
                                  render={InputCvv}
                                  meta={{
                                    name: 'cvc',
                                    helperText: 'CVC/CVV is required',
                                    label: 'CVC/CVV',
                                    placeholder: 'Please Enter CVC/CVV'
                                  }}
                                />
                              </Grid>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Stack className="inputs_fields_ratio" direction="row">
                              <Grid xs={12}>
                                <FieldControl
                                  name="cardholdername"
                                  render={InputText}
                                  meta={{
                                    name: 'cardholdername',
                                    helperText: 'Cardholder Name is required.',
                                    label: 'Cardholder Name',
                                    placeholder: 'Please Enter Cardholder Name'
                                  }}
                                />
                              </Grid>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Stack className="inputs_fields_ratio" direction="row">
                              <Grid xs={12}>
                                <FieldControl
                                  name="billingZc"
                                  render={InputZipCode}
                                  meta={{
                                    helperText: "Zip Code is required.",
                                    name: "billingZc",
                                    label: "Billing Zip Code",
                                    placeholder: "Please Enter Billing Zip Code",
                                  }}
                                />
                              </Grid>
                            </Stack>
                          </Grid>

                          <Grid item xs={12} sm={12} md={12} lg={12} mt={3}>
                            <Stack className="add_btnouter" direction="row" justifyContent="center" alignItems="center" gap={1.5}>
                              <Box className="add_outerbtnscancel" onClick={props.handleClose}>
                                <Button
                                  className="add_cancel_btn"
                                  variant="outlined"
                                  style={{
                                    color: '#032439',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    backgroundColor: '#fff',
                                    border: '1px solid #00ACBA',
                                    borderRadius: '8px',
                                    boxShadow: 'none',
                                    textTransform: 'capitalize',
                                    justifyContent: 'center',
                                    display: 'flex',
                                    minWidth: '146px',
                                    height: '49px'
                                  }}
                                >
                                  Cancel
                                </Button>
                              </Box>
                              <Box className="add_outerbtns">
                                <Button
                                  className="cancel_btn"
                                  variant="contained"
                                  onClick={handleCard}
                                  // disabled={invalid}
                                  style={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#ffffff',
                                    backgroundColor: '#00ACBA',
                                    border: '1px solid #00ACBA',
                                    borderRadius: '8px',
                                    boxShadow: 'none',
                                    textTransform: 'capitalize',
                                    flex: 1,
                                    width: '100%',
                                    height: '49px'
                                  }}
                                >
                                  Add Credit Card
                                </Button>
                              </Box>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Box>
                    </form>
                  )}
                />
              </Box>
            </Box>
          </Container>
        </Box>
      </DialogContent>
    </>
  );
};
