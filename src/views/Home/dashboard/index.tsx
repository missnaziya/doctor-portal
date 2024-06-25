import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import { GET_RECENT_ORDERS, GET_SLIDER_ORDERS, GET_STATISTICS, PRODUCT_CATALOG_BLUE_VIEW, PRESCRIBER_PROFILE_GET, GET_DOSING_DIRECTIONS } from '../../../constants/Endpoints';
import { NavLink, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';

import { AddMedication } from '../../../components/popup/AddMedication';
import { AddNewPatient } from '../../../components/popup/AddNewPatient';
import { PrescribersList } from '../../../components/popup/PrescribersList';
import { AxiosResponse } from 'axios';
import { BootstrapDialog } from '../../../core/tables/tableStyles';
import Carousel from 'react-material-ui-carousel';
import Chat from '../../../assets/icons/chat.svg';
import Doctor from '../../../constants/grx-api';
import Header from '../../../components/header/header';
import Left from '../../../assets/icons/left_arrow.svg';
import { OrderTable } from '../../../components/tables/OrderTable';
import { Product } from '../../../models/Product';
import Right from '../../../assets/icons/right_arrow.svg';
import SecondaryButton from '../../../core/buttons/secondary-button';
import { SliderOrder } from '../../../models/Slider';
import { User } from '../../../models/User';
import { dashboardActions, productActions } from '../../../store/Actions';
import { isLoggedIn } from '../../../services/auth/auth.service';
import { toast } from 'react-toastify';
import Footer from '../../../components/footer/footer';
import cameraPic from '../../../assets/icons/camera.svg';
import Prescribe from '../../../assets/icons/prescribe_icon.svg';
import { profileActions } from '../../../store/Actions';
import { prescriptionActions } from '../../../store/Actions';
import { SelectPrescriberForm } from '../../../components/popup/PrescribersList';

export default function DashboardPage() {
  const router = useNavigate();
  const dispatch = useAppDispatch();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [medication, setMedication] = useState<boolean>(false);
  const [prescribersDialogue, setPrescribersDialogue] = useState<{
    prescriberList?: User[];
    showDialog?: boolean;
  } | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const [prescribers, setPrescribers] = useState<User[]>([]);
  const [popupProp, setPopupProp] = useState<{ accountId: string }>({
    accountId: ''
  });

  const productData = useAppSelector((state) => state.dashboardReducer.data);
  const statisticsData = useAppSelector((state) => state.dashboardReducer.statistics);
  const medicationProductCatalog: Product[] = useAppSelector((state) => state.productReducer?.products);
  const orderData = useAppSelector((state) => state.dashboardReducer.orders);
  const sliderData = useAppSelector((state) => state.dashboardReducer.sliderOrders);
  const user: User = useAppSelector((state) => state.profileReducer.user);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleMedication = () => {
    // if (Array.isArray(medicationProductCatalog) && medicationProductCatalog?.length > 0) {
    setPopupProp((popupProp) => ({ ...popupProp, accountId: user?.type === 'Staff' ? user?.activePrescriber?.accountId : user?.doctorAccountId }));
    setMedication(true);
    // }
  };

  const redirectToPatient = () => {
    router('/home/patient');
  };

  const redirectToPrescriptions = () => {
    router('/home/prescriptions');
  };

  const handleDescription = () => {
    router('/home/product');
  };

  const handleOrderBtnLink = (item: { Rich_Text_for_Banner__c: string }) => {
    // let url = item?.Rich_Text_for_Banner__c.substring(3, item.Rich_Text_for_Banner__c.length - 4);
    // window.open(url, '_blank');
    router('/home/prescribe-now');
  };

  const handlePrescribeDetail = () => {
    router('/home/prescribe-now');
  };

  const handleDialougeClose = (event: React.SyntheticEvent, reason: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return event.preventDefault();
    } else {
      handleClose();
    }
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLElement>) => {
    return event.stopPropagation();
  };

  const handleClose = () => {
    setOpen(false);
    setMedication(false);
    setPrescribersDialogue({ ...prescribersDialogue, showDialog: false });
  };

  const handleChangePrescriberPopup = async () => {
    SelectPrescriberForm.reset();
    SelectPrescriberForm.patchValue({
      prescriber: user?.activePrescriber
    });
    try {
      const res: AxiosResponse = await Doctor.get(PRESCRIBER_PROFILE_GET);
      if (res.status === 200 && Array.isArray(res.data) && res?.data?.length > 0) {
        setPrescribersDialogue({ ...prescribersDialogue, prescriberList: res?.data as User[], showDialog: true });
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const handleSelectPrescriberCallback = (prescriber: User | null) => {
    if (prescriber !== null) {
      const updatedUser = User.create({ ...user, activePrescriber: prescriber, type: 'Staff' }, true);
      let initialOrder = {
        billTo: { type: '', value: '' },
        shipTo: { type: '', value: '' },
        comment: '',
        credit_card: '',
        needByDate: '',
        selectPrescriber: '',
        selectedPrescriberName: '',
        npi: '',
        blocks: [{ patients: [], prescriptions: [] }]
      };
      dispatch(prescriptionActions.setPrescribeOrder(initialOrder));
      dispatch(profileActions.setUserData({ user: updatedUser as User }));
    }
    handleClose();
  };

  const handleProductTour = () => {
    window.open('https://prescribe.imprimisrx.com/home/dashboard?product_tour_id=443253', '_self');
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files?.length) {
      try {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        const result = await Doctor.post(`doctor-portal/auth/upload-profile-image`, formData, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        const newUser = { ...user, profileImage: { ...user.profileImage, Location: result?.data?.Location, small: result?.data?.small } };
        const duplicateUser: User = User.create({ ...newUser }, true) as User;

        dispatch(profileActions.setUserData({ user: duplicateUser as User }));
      } catch (error: any) {
        if (error?.response?.data?.message) {
          toast(error?.response?.data?.message);
        }
      }
    }
  };

  // api calls ---------------

  // update dosing directions
  const updateDosingDirections = async (products: Product[], prescriberId: string) => {
    try {
      let updatedProducts: Product[] = [];
      const dosingDirectionRes: AxiosResponse = await Doctor.get(`${GET_DOSING_DIRECTIONS}/${prescriberId}`);
      if (dosingDirectionRes?.status === 200 && Array.isArray(dosingDirectionRes?.data) && dosingDirectionRes.data.length > 0) {
        let directionsObj: any = {};
        dosingDirectionRes?.data?.map((direction: any) => {
          if (!directionsObj[direction?.ndc]) {
            directionsObj[direction?.ndc] = [{ id: direction?.directionsId, name: direction?.directions, product: direction?.productId }];
          } else {
            directionsObj[direction?.ndc] = [...directionsObj[direction?.ndc], { id: direction?.directionsId, name: direction?.directions, product: direction?.productId }];
          }
          return 0;
        }, {});
        products?.map((product: Product) => {
          if (directionsObj[product?.ndc] && product?.ndc && product?.productDirections !== null) {
            product['productDirections'] = [...product?.productDirections, ...directionsObj[product?.ndc]];
            updatedProducts = [...updatedProducts, product];
          } else {
            updatedProducts = [...updatedProducts, product];
          }
          return 0;
        });
      }
      return updatedProducts;
    } catch (error: any) {
      console.log('check');
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
      return products;
    }
  };

  // products
  const getProducts = async () => {
    try {
      let products: Product[] | undefined = [];
      const data = {
        enable: false,
        type: 'Prescriber',
        doctorAccountId: user?.type === 'Staff' ? user?.activePrescriber?.accountId : user?.doctorAccountId
      };
      const res: AxiosResponse = await Doctor.post(PRODUCT_CATALOG_BLUE_VIEW, data);
      if (res.status === 201 && Array.isArray(res.data) && res.data.length > 0) {
        products = await updateDosingDirections(res.data, data.doctorAccountId);
        if (!(Array.isArray(products) && products.length > 0)) {
          products = res.data;
        }
        console.log('products', products);
        const productData = products.filter((product) => product.isSpotlight);
        dispatch(dashboardActions.setProductData({ data: productData as Product[] })); // for spotlight products
        dispatch(productActions.setProductCatalogData({ data: products as Product[] })); // for medication form
        dispatch(productActions.setPrescriberBlueViewProductCatalogData({ data: products as Product[] }));
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  // statics
  const getStatistics = async () => {
    try {
      const mdId = user?.type === 'Staff' ? user?.activePrescriber?.mdId : user?.mdId;
      const res: AxiosResponse = await Doctor.get(GET_STATISTICS, { params: { user_id: mdId } });
      const data = {
        patients: res.data.patients,
        prescriptions: res.data.prescriptions
      };

      dispatch(dashboardActions.setStatisticsData(data));
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  // recent orders
  const getRecentOrders = async () => {
    try {
      const mdId = user?.type === 'Staff' ? user?.activePrescriber?.mdId : user?.mdId;
      const res: AxiosResponse = await Doctor.get(GET_RECENT_ORDERS, { params: { md_id: mdId } });
      dispatch(dashboardActions.setRecentOrders(res.data));
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  // sliders
  const getSlideOrders = async () => {
    try {
      const res: AxiosResponse = await Doctor.get(GET_SLIDER_ORDERS);
      if (Array.isArray(res.data.records)) {
        dispatch(dashboardActions.setSliderOrders(res.data.records));
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      router('/');
    } else {
      setIsLoaded(true);
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      if (user?.isApproved) {
        getStatistics();
        getRecentOrders();
      }
      getSlideOrders();
      getProducts();
    }
  }, [dispatch, user]);

  return isLoaded && user ? (
    <>
      {prescribersDialogue && (
        <BootstrapDialog onClose={handleDialougeClose} BackdropProps={{ onClick: handleBackdropClick }} open={prescribersDialogue.showDialog as boolean} PaperProps={{ style: { minHeight: '30%', maxHeight: '60%', minWidth: '40%', maxWidth: 780 } }}>
          <PrescribersList prescribersList={prescribersDialogue?.prescriberList as User[]} handleClose={handleSelectPrescriberCallback} />
        </BootstrapDialog>
      )}
      {open && (
        <BootstrapDialog onClose={handleDialougeClose} open={open} BackdropProps={{ onClick: handleBackdropClick }} PaperProps={{ style: { minHeight: '84%', maxHeight: '89%', minWidth: '75%', maxWidth: 1298 } }}>
          <AddNewPatient handleClose={handleClose} />
        </BootstrapDialog>
      )}
      {medication && medicationProductCatalog && (
        <BootstrapDialog onClose={handleDialougeClose} open={medication} BackdropProps={{ onClick: handleBackdropClick }} PaperProps={{ style: { minHeight: '60%', maxHeight: '89%', minWidth: '40%', maxWidth: 780 } }}>
          <AddMedication handleClose={handleClose} accountId={popupProp.accountId} />
        </BootstrapDialog>
      )}
      <Stack component="main" className="default-layout">
        <Header />
        <Box className="dashboard-page" position="relative">
          <Container maxWidth="xl">
            <Stack className="main-content-wrap">
              <Stack id="dashboard_set" direction={{ xs: 'column', sm: 'column', lg: 'row', xl: 'row' }}>
                <Box flex={{ xs: 1 }} className="dashboard_col_layout">
                  <Stack direction={{ xs: 'column', md: 'row' }} className="dashboardFlex">
                    <Box padding={1} flex={{ xs: 1, md: 3 }}>
                      <Box className="card-sample-block">
                        {user && (
                          <Stack className="doctor_profile" direction={{ sm: 'column', lg: 'row' }} alignItems="center">
                            <Box>
                              <Box className="card-user-profile" style={user?.profileImage?.small ? { background: `url('${user?.profileImage?.small}')` } : {}}>
                                <label className="dashboard_camera" htmlFor="upload-button">
                                  <img src={cameraPic} alt="camera" width={38} height={38} />
                                </label>
                                <input type="file" id="upload-button" style={{ display: 'none' }} onChange={handleImageChange} />
                              </Box>
                            </Box>
                            <Box className="card-user-desc">
                              {/* <Typography className="heading-03-v1  heading-03-v1-size" variant="h3" component="h3">
                                Welcome, <br /> {user.first_name + ' ' + user.last_name}
                              </Typography> */}
                              <Box className="heading-03-v1 heading-03-v1-size">
                                Welcome,{' '}
                                <Box className="user_heading" title={user.firstName + ' ' + user.lastName}>
                                  {user.firstName + ' ' + user.lastName}
                                </Box>
                              </Box>
                              <Typography component="p" className="paragraph-03-v2">
                                {user?.type === 'Staff' && (
                                  <Typography title="Prescriber Name">
                                    <span> Prescriber: </span>
                                    {user?.activePrescriber?.firstName} {user?.activePrescriber?.lastName + ' '}
                                    <span className="select-prescriber" onClick={handleChangePrescriberPopup} title="Click here to switch the prescriber">
                                      (Switch)
                                    </span>
                                  </Typography>
                                )}
                              </Typography>
                              <Typography component="p" className="paragraph-03-v2">
                                {/* Here's what's happening in your account! */}
                                {user.isApproved && (
                                  <>
                                    {user?.type === 'Staff' ? (
                                      <>
                                        <span>NPI:</span>
                                        {user?.activePrescriber?.npi ? user?.activePrescriber?.npi : ''}
                                      </>
                                    ) : (
                                      <>
                                        <span>NPI:</span>
                                        {user?.npi ? user?.npi : ''}
                                      </>
                                    )}
                                  </>
                                )}
                                <Typography className="small" style={{ whiteSpace: 'pre-wrap', wordBreak: 'keep-all', marginTop: '7px' }}>
                                  ImprimisRx appreciates the oppurtunity to help you care for your patients.
                                </Typography>
                                <Grid container spacing={2} mt={1}>
                                  <Grid item>
                                    <Typography component="h4" className="product-tour"  onClick={handleProductTour} title="Click here to take a tour of the new prescriber portal">
                                      <span>Product Tour</span>
                                    </Typography>
                                  </Grid>
                                  {/* <Grid item>
                                    {
                                      user?.type === 'Staff' && (
                                        <Typography component="h4" className="select-prescriber" onClick={handleChangePrescriberPopup} title="Click here to take a tour of the new prescriber portal">
                                          <span>{`${user?.activePrescriber?.firstName} ${user?.activePrescriber?.lastName}`}</span>
                                        </Typography>
                                      )
                                    }
                                  </Grid> */}
                                </Grid>
                              </Typography>

                              {/* <Typography className="small">
                                <span>Dr.</span>
                                {' ' + user.firstName + ' ' + user.lastName}
                                {user.isApproved && ' | '}
                                {user.isApproved && (
                                  <>
                                    <span>NPI:</span>
                                    {user?.npi ? ' ' + user.npi : ''}
                                  </>
                                )}
                              </Typography> */}
                            </Box>
                          </Stack>
                        )}
                      </Box>
                    </Box>
                    <Box padding={1} flex={{ xs: 1, md: 3 }}>
                      <Box className="card-sample-block">
                        <Box className="card_sample_in">
                          <Box className="most-used-block used-products-spotlight">
                            <Box className="most-used-heading">
                              <Box>
                                <Typography variant="h4" component="h4" className="heading-04-v1" color="#263238CC">
                                  Products Spotlight
                                </Typography>
                              </Box>
                            </Box>
                            <Box className="most-used-products">
                              <Box className="most-used-pdt-list">
                                <Stack className="product_spotlight" direction="row" alignItems="center" justifyContent="space-around">
                                  {productData &&
                                    productData?.slice(0, 4).map((data: Product, index: number) => {
                                      return (
                                        <Box className="most-used-pdt-list" key={index} title={data?.shortName} onClick={handleDescription}>
                                          <Box className="product-short-img-block">
                                            <Box className="product-short-img">
                                              <img src={`https://www.imprimisrx.com/s/sfsites/c/cms/delivery/media/${data?.contentKey}`} alt={data?.shortName} />
                                            </Box>
                                            {/* <Box className="product-short-img" style={{ background: 'url(' + productImages[data?.contentKey] + ')' }}></Box> */}
                                          </Box>
                                          <Typography variant="h5" component="h5" className="same-typography-final">
                                            {data?.shortName}
                                          </Typography>
                                        </Box>
                                      );
                                    })}
                                </Stack>
                              </Box>
                              <Box className="view-all-link">
                                <NavLink to="/home/product" style={{ textDecoration: 'none' }}>
                                  <div>Click here to view Full catalog</div>
                                </NavLink>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Stack>
                  <Box padding={1} className="dashboardFlex">
                    <Box className="card-sample-block primary-border">
                      <Box>
                        <Typography variant="h4" component="h4" className="heading-04-v1" textAlign="center" color="#263238CC">
                          Start a Prescription
                        </Typography>
                        {/* <Typography className="paragraph-01" textAlign="center" component="p" color="#263238CC">
                          Prescribe now by:{' '}
                        </Typography> */}
                      </Box>
                      <Stack justifyContent="center" className="start_prescription_btn_container" sx={{ ml: 5, mr: 5, mt: 2, borderRadius: '8px' }}>
                        {!user.isApproved && (
                          <Stack mt={4} mb={2} textAlign="center">
                            <Typography className="important_message">
                              <b>Important:</b> These options will be available to you as soon as your account is verified{' '}
                            </Typography>
                          </Stack>
                        )}
                        <Stack className="start_prescription_btn" direction="row" justifyContent="center" gap={{ xs: 0, md: 3 }} paddingY={3} paddingX={8}>
                          <SecondaryButton onClick={handleMedication} label="Choosing a Medication" disabled={!user.isApproved}></SecondaryButton>
                          <SecondaryButton onClick={redirectToPatient} label="Choosing existing Patient" disabled={!user.isApproved}></SecondaryButton>
                          <SecondaryButton onClick={handleClickOpen} label="Adding new Patient" disabled={!user.isApproved}></SecondaryButton>
                        </Stack>
                      </Stack>
                    </Box>
                  </Box>
                </Box>
                <Stack direction={{ xs: 'column', md: 'column' }} style={{ minWidth: '300px' }}>
                  <Box padding={1} flex={{ md: 1, xl: 'unset' }}>
                    <Box className="card-sample-block statics-ratio-card">
                      <Box>
                        <Typography variant="h4" component="h4" className="heading-04-v1 --heading-v4-padding" textAlign="center" color="#263238CC">
                          Statistics
                        </Typography>
                      </Box>
                      <Stack textAlign="center" direction="row" alignItems="center" justifyContent="space-around" width="100%" className="stack-card-sample">
                        {user.isApproved ? (
                          <Box className="card-sample-counting patients-counting" onClick={redirectToPatient}>
                            <Typography variant="h1" component="h1">
                              {statisticsData.patients.toLocaleString('en-US', { style: 'decimal', useGrouping: true })}
                            </Typography>
                            <Typography variant="h4" component="h4">
                              Patients
                            </Typography>
                          </Box>
                        ) : (
                          <Box className="card-sample-counting patients-counting">
                            <Typography variant="h1" component="h1">
                              00
                            </Typography>
                            <Typography variant="h4" component="h4">
                              Patient
                            </Typography>
                          </Box>
                        )}

                        <Box className="card-counting-divider"></Box>

                        {user.isApproved ? (
                          <Box className="card-sample-counting patients-counting" onClick={redirectToPrescriptions}>
                            <Typography variant="h1" component="h1">
                              {statisticsData.prescriptions.toLocaleString('en-US', { style: 'decimal', useGrouping: true })}
                            </Typography>
                            <Typography variant="h4" component="h4">
                              Prescriptions
                            </Typography>
                          </Box>
                        ) : (
                          <Box className="card-sample-counting patients-counting">
                            <Typography variant="h1" component="h1">
                              00
                            </Typography>
                            <Typography variant="h4" component="h4">
                              Prescriptions
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  </Box>
                  <Box padding={1} flex={{ xs: 1, sM: 1, md: 1, lg: 1, xl: 1 }}>
                    <Carousel
                      fullHeightHover={false}
                      indicators={true}
                      NextIcon={<img className="right_arrow" src={Right} alt="logo" height={15} width={15} />}
                      PrevIcon={<img className="left_arrow" src={Left} alt="logo" height={15} width={15} />}
                      navButtonsProps={{
                        style: {
                          display: 'block',
                          backgroundColor: 'transparent',
                          borderRadius: 0,
                          opacity: 1,
                          padding: 0,
                          margin: 4
                        }
                      }}
                      className="carasouselAlignment"
                    >
                      {sliderData &&
                        sliderData.map((item: SliderOrder, index: number) => {
                          return (
                            // <Box >
                            <Box className="card-sample-block card-sample-block-flex cardAlign" key={index}>
                              <Box className="exclusive-product-slide">
                                <Box className="exclusive-product-slide-desc">
                                  <span className="exclusive-name-tag">{item?.Heading__c}</span>
                                </Box>
                                {/* <Box className="exclusive-product-slide-desc">
                                  <Typography variant="h3" component="h3">
                                    <span className="name-highlight">{item?.Heading__c}</span>
                                  </Typography>
                                </Box> */}
                                <Stack direction="row" alignItems="center" justifyContent="center" mt={2}>
                                  {/* <Box className="exclusive-product-slide-img"> */}
                                  {/* `https://dev.harrow.cloud/v1/doctor-portal/doctor/advertisements${item?.Banners_Image_URL__c}` */}
                                  <Box className="product-slide-img" style={{ background: `url(https://www.imprimisrx.com/resource/1683821604000/promotionCarouselBanner${item?.Banners_Image_URL__c})` }}></Box>
                                  {/* <img src={`https://www.imprimisrx.com/resource/1683821604000/promotionCarouselBanner${item?.Banners_Image_URL__c}`} alt={''} /> */}
                                  {/* <img className="product-slide-img" src={`https://www.imprimisrx.com/resource/1683821604000/promotionCarouselBanner${item?.Banners_Image_URL__c}`} alt={''} /> */}
                                  {/* // <Box className="product-slide-img" style={{ background: `url(https://dev.harrow.cloud/v1/doctor-portal/doctor/advertisements${item?.Banners_Image_URL__c})` }}></Box> */}
                                  {/* </Box> */}
                                  {/* <Box className="exclusive-product-slide-desc"> */}
                                  {/* <Typography variant="h3" component="h3" style={{ width: 146 }} dangerouslySetInnerHTML={{ __html: item?.Description__c }} className="sliderDescription"> */}
                                  {/* {item?.description} */}
                                  {/* Ophthalmic <br></br> Emulsion
                                          <span>(preservative-free)</span>
                                          5.5mL Bottles */}
                                  {/* </Typography> */}
                                  {/* <ul>
                                          <li>
                                            <span>»</span> No Prior Authorizations
                                          </li>
                                          <li>
                                            <span>»</span> No Coupons
                                          </li>
                                          <li>
                                            <span>»</span> No Pharmacy Call Backs
                                          </li>
                                        </ul>
                                        <Typography>
                                          <span>$440 per Box of 10</span> ($44 per bottle)
                                        </Typography> */}
                                  {/* </Box> */}
                                </Stack>
                                {/* <Box className="order-used-btn">
                                  <Button variant="contained" style={{ fontSize: '18px', backgroundColor: '#F3893D', borderRadius: '8px', boxShadow: 'none', height: '38px', width: '130px', textTransform: 'capitalize' }} onClick={() => handleOrderBtnLink(item)}>
                                    Order Now
                                  </Button>
                                </Box> */}
                              </Box>
                            </Box>
                            // </Box>
                          );
                        })}
                    </Carousel>
                  </Box>
                </Stack>
              </Stack>

              <Box padding={1}>
                <Box className="card-sample-block">
                  <Box style={{ display: 'flex', paddingTop: '10px', alignItems: 'flex-end' }}>
                    <Box style={{ flex: 1 }}>
                      <Typography variant="h4" textAlign="center" component="h4" className="heading-04-v1" color="#263238CC">
                        Most Recent Prescriptions
                      </Typography>
                    </Box>
                    <Box>
                      <Stack onClick={redirectToPrescriptions} style={{ cursor: 'pointer' }}>
                        <Box className="view_all_info">View All</Box>
                      </Stack>
                    </Box>
                  </Box>
                  <Box className="recent-order-table-layout">
                    {user.isApproved ? (
                      orderData && <OrderTable data={orderData} />
                    ) : (
                      <Box className="most_recent_prescription_container">
                        <Stack mt={2} pt={4} pb={4} textAlign="center">
                          <Typography className="important_message">
                            <b>Important:</b> Here you will be able to view and sort your most recent prescriptions{' '}
                          </Typography>
                        </Stack>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Container>
        </Box>

        <Box className="chat-floating-icon">
          <img src={Chat} alt="logo" height={50} width={50} />
        </Box>
        <Box className="Prescribe-icon" onClick={handlePrescribeDetail}>
          <img src={Prescribe} alt="logo" height={100} width={180} />
        </Box>
      </Stack>
      <Footer />
    </>
  ) : (
    <></>
  );
}
