import { ADD_FAV_PRODUCT, PRODUCT_CATALOG_BLUE_VIEW, PRODUCT_CATALOG_CAT_FILTER, PRODUCT_DOSAGE_FILTER, REMOVE_FAV_PRODUCT, GET_DOSING_DIRECTIONS } from '../../../constants/Endpoints';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, FormControlLabel, Grid, Stack, Typography } from '@mui/material';
import { BootstrapDialog } from '../../../core/tables/tableStyles';
import React, { ChangeEvent, Dispatch, useCallback, useEffect, useState } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../../../store';

import { AxiosResponse } from 'axios';
import { CategoryInterface } from '../../../interfaces/category';
import Chat from '../../../assets/icons/chat.svg';
import Chip from '@mui/material/Chip';
import { DosageInterface } from '../../../interfaces/dosage';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from '../../../components/header/header';
import Doctor from '../../../constants/grx-api';
import Prescribe from '../../../assets/icons/prescribe_icon.svg';
import { Product } from '../../../models/Product';
import Product_ins from '../../../assets/icons/product_insert.svg';
import SearchBar from '../../../components/search-bar';
import { User } from '../../../models/User';
import favFilled from '../../../assets/icons/fav-filled.svg';
import favOutline from '../../../assets/icons/fav-outline.svg';
import { isLoggedIn } from '../../../services/auth/auth.service';
import { productActions } from '../../../store/Actions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AddMedication } from '../../../components/popup/AddMedication';
import Footer from '../../../components/footer/footer';

const ProductPage = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [popupProp, setPopupProp] = useState<{ showDialog: boolean; accountId: string }>({
    showDialog: false,
    accountId: ''
  });
  const router = useNavigate();
  const productCatalogData: Product[] | any = useAppSelector((state: RootState) => state.productReducer.prescriberBlueViewProducts);
  const [search, setSearch] = useState('');
  const [medicationIndex, setMedicationIndex] = useState<number>();

  const handleMedication = async (data: Product) => {
    const index = await productCatalogData.findIndex((product: Product) => product.id === data.id);
    setMedicationIndex(index);
    if (typeof index === 'number' && index >= 0) {
      setPopupProp((popupProp) => ({ ...popupProp, accountId: user?.type === 'Staff' ? user?.activePrescriber?.accountId : user?.doctorAccountId, showDialog: true }));
    }
  };

  const handlePrescribeDetail = () => {
    router('/home/prescribe-now');
  };

  const setValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e?.target?.value);
  };

  const [categories, setCategories]: [CategoryInterface[], Dispatch<CategoryInterface[]>] = useState<CategoryInterface[]>([]);

  const [categoryFilters, setCategoryFilters]: [string[], Dispatch<string[]>] = useState<string[]>([]);

  const [dosageFilters, setDosageFilters]: [DosageInterface[], Dispatch<DosageInterface[]>] = useState<DosageInterface[]>([]);

  const [selectedDosageFilters, setSelectedDosageFilters]: [string[], Dispatch<string[]>] = useState<string[]>([]);
  const [favFilter, setFavFilter] = useState(false);

  const user: User = useAppSelector((state: RootState) => state.profileReducer.user);

  const getCatName = (id: string) => {
    for (let cat of categories) {
      if (cat.package_id === id) {
        return cat;
      }
      for (let childCat of cat.Child) {
        if (childCat.package_id === id) {
          return childCat;
        }
      }
    }
  };

  const addFav = async (id: string) => {
    try {
      const res: AxiosResponse = await Doctor.post(ADD_FAV_PRODUCT, { productIds: [id] });
      if (res.data.success === true) {
        toast('Added to favorite');
        load();
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const removeFav = async (id: string) => {
    try {
      const res: AxiosResponse = await Doctor.post(REMOVE_FAV_PRODUCT, { productIds: [id] });
      if (res.data.success === true) {
        toast('Removed from favorite');
        load();
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const handleProductInsertPdf = (pdflink: string) => {
    window.open(pdflink, '__blank');
  };

  const handleCategoryDelete = (item: string) => {
    setCategoryFilters(categoryFilters.filter((el: string) => el !== item));
  };

  const handleDosageDelete = (item: string) => {
    setSelectedDosageFilters(selectedDosageFilters.filter((el: string) => el !== item));
  };

  const handleFav = (product: any) => {
    if (product.isFavorite) {
      removeFav(product.id);
    } else {
      addFav(product.id);
    }
  };

  const isAllChildChecked = (childs: string[]) => {
    return childs.length > 0 && childs.filter((el: string) => !categoryFilters.includes(el)).length === 0;
  };

  const categoryChecked = (e: ChangeEvent<HTMLInputElement>, cat: CategoryInterface) => {
    // const newCats = [cat.package_id];
    // for (let child of cat.Child) {
    //   newCats.push(child.package_id);
    // }
    // if (e.target.checked) {
    //   setCategoryFilters([...categoryFilters, ...newCats]);
    // } else {
    //   newCats.push(cat.parent_id);
    //   setCategoryFilters(categoryFilters.filter((el: string) => !newCats.includes(el)));
    // }
    const newCats = [cat.name];
    for (let child of cat.Child) {
      newCats.push(child.name);
    }
    if (e.target.checked) {
      setCategoryFilters([...categoryFilters, ...newCats]);
    } else {
      newCats.push(cat.name);
      setCategoryFilters(categoryFilters.filter((el: string) => !newCats.includes(el)));
    }
  };

  const dosageChecked = (e: ChangeEvent<HTMLInputElement>, cat: DosageInterface) => {
    if (e.target.checked) {
      setSelectedDosageFilters([...selectedDosageFilters, cat.df_name]);
    } else {
      setSelectedDosageFilters(selectedDosageFilters.filter((el: string) => !(cat.df_name === el)));
    }
  };

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
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
      return products;
    }
  };

  const load = useCallback(async () => {
    try {
      const params: {
        api_key: string | null;
        dosage_forms?: string;
      } = { api_key: localStorage.getItem('api_key') };
      if (selectedDosageFilters.length > 0) {
        params.dosage_forms = selectedDosageFilters.map((item: string) => item).join();
      }
      const data = {
        enable: false,
        type: 'Prescriber',
        doctorAccountId: user?.type === 'Staff' ? user?.activePrescriber?.accountId : user?.doctorAccountId
      };
      let products: Product[] | undefined = [];
      const res: AxiosResponse = await Doctor.post(PRODUCT_CATALOG_BLUE_VIEW, data);
      if (res.status === 201 && Array.isArray(res.data)) {
        products = await updateDosingDirections(res.data, data.doctorAccountId);
        if (!(Array.isArray(products) && products.length > 0)) {
          products = res.data;
        }
        dispatch(productActions.setProductCatalogData({ data: products as Product[] })); // for medication form
        dispatch(productActions.setPrescriberBlueViewProductCatalogData({ data: products as Product[] }));
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  }, [dispatch, selectedDosageFilters]);

  const loadCategoryFilter = async () => {
    try {
      const res: AxiosResponse = await Doctor.get(PRODUCT_CATALOG_CAT_FILTER);
      if (Array.isArray(res.data)) {
        let data = res?.data?.map((elem: string) => {
          // temp fix - need to chnage once product api structure is fixed
          return { name: elem, Child: [] as CategoryInterface[] };
        });
        setCategories(data as any);
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const loadDosageFilter = async () => {
    try {
      const res: AxiosResponse = await Doctor.get(PRODUCT_DOSAGE_FILTER);
      if (Array.isArray(res.data)) {
        setDosageFilters(res.data as any);
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    load();
    loadCategoryFilter();
    loadDosageFilter();
  }, []);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router('/');
    } else {
      setIsLoaded(true);
    }
  }, [router]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLElement>) => {
    return event.stopPropagation();
  };

  const handleDialougeClose = (event: React.SyntheticEvent, reason: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return event.preventDefault();
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setPopupProp((popupProp) => ({ ...popupProp, showDialog: false, accountId: '' }));
  };

  return (
    <>
      {popupProp.showDialog && (
        <BootstrapDialog onClose={handleDialougeClose} open={popupProp.showDialog} BackdropProps={{ onClick: handleBackdropClick }} PaperProps={{ style: { minHeight: '84%', maxHeight: '89%', minWidth: '40%', maxWidth: 780 } }}>
          <AddMedication handleClose={handleClose} medicationIndex={medicationIndex} edit={true} accountId={popupProp.accountId} />
        </BootstrapDialog>
      )}
      {isLoaded && (
        <>
          <Stack component="main" className="default-layout">
            <Header />
            <Box component="main" className="product-page">
              <Box className="main-content-wrapper-full">
                <Container maxWidth="xl">
                  <Box className="main-content-wrap main-box product_page">
                    <Box className="heading_top">Product Catalog</Box>
                    <Stack direction="row" alignItems="center" className="productLayout">
                      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className="product_content">
                        <Grid item xs={12} sm={12} md={12} lg={3} className="product_content_top">
                          <Box className="product_dropdown_side">
                            <Box className="accordian">
                              <Accordion className="accordian_btn">
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                                  <Typography>Product Category</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  {categories &&
                                    categories.map((cat: CategoryInterface, index: number) => {
                                      return (
                                        <div key={index} className="checkbox_outer">
                                          <FormControlLabel
                                            sx={{ margin: 0 }}
                                            title={cat.name}
                                            control={
                                              <Box marginRight={1}>
                                                <label className="check-input">
                                                  <input type="checkbox" onChange={(e) => categoryChecked(e, cat)} checked={categoryFilters.includes(cat.name) || isAllChildChecked(cat?.Child?.map((c: CategoryInterface) => c.package_id))} />
                                                  <span className="checkmark"></span>
                                                </label>
                                              </Box>
                                            }
                                            label={cat.name}
                                          />

                                          {cat.Child &&
                                            cat.Child.map((subCat: CategoryInterface, i: number) => {
                                              return (
                                                <div key={i} className="checkbox_outer child" style={{ paddingLeft: '30px' }}>
                                                  <FormControlLabel
                                                    sx={{ margin: 0 }}
                                                    title={subCat.name}
                                                    control={
                                                      <Box marginRight={1}>
                                                        <label className="check-input" title={cat.name}>
                                                          <input type="checkbox" onChange={(e) => categoryChecked(e, subCat)} checked={categoryFilters.includes(subCat.package_id)} />
                                                          <span className="checkmark"></span>
                                                        </label>
                                                      </Box>
                                                    }
                                                    label={subCat.name}
                                                  />
                                                </div>
                                              );
                                            })}
                                        </div>
                                      );
                                    })}
                                </AccordionDetails>
                              </Accordion>
                              <Accordion className="accordian_btn">
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                                  <Typography>Dosage Form</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  {dosageFilters &&
                                    dosageFilters.map((cat: DosageInterface, index: number) => {
                                      return (
                                        <div key={index} className="checkbox_outer">
                                          <FormControlLabel
                                            sx={{ margin: 0 }}
                                            title={cat.df_name}
                                            control={
                                              <Box marginRight={1}>
                                                <label className="check-input">
                                                  <input type="checkbox" onChange={(e) => dosageChecked(e, cat)} checked={selectedDosageFilters.filter((item: string) => item === cat.df_name).length > 0} />
                                                  <span className="checkmark"></span>
                                                </label>
                                              </Box>
                                            }
                                            label={cat.df_name}
                                          />
                                        </div>
                                      );
                                    })}
                                </AccordionDetails>
                              </Accordion>
                            </Box>

                            <Box className="filter">
                              <ul style={{ cursor: 'pointer' }} onClick={() => setFavFilter(!favFilter)}>
                                <li>
                                  <img src={favFilter ? favFilled : favOutline} height={25} width={25} alt="fav" />
                                </li>
                                <li>My Favorites</li>
                              </ul>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={9} className="product_content_bottom">
                          <SearchBar value={search} setValue={setValue}></SearchBar>
                          <div style={{ display: 'flex', gap: 4, paddingTop: 5, flexWrap: 'wrap' }}>
                            {categoryFilters.map((item: string, index: number) => {
                              return (
                                <div>
                                  {/* <Chip label={getCatName(item)?.name} onDelete={() => handleCategoryDelete(item)} /> */}
                                  <Chip label={item} onDelete={() => handleCategoryDelete(item)} />
                                </div>
                              );
                            })}

                            {selectedDosageFilters.map((item: string, index: number) => {
                              return (
                                <div>
                                  <Chip label={item} onDelete={() => handleDosageDelete(item)} />
                                </div>
                              );
                            })}
                          </div>

                          <Box className="product_scroll">
                            <Stack className="product_stack" direction="row" flex-wrap="wrap" alignItems="center" justifyContent="center">
                              {productCatalogData &&
                                (productCatalogData as Product[])
                                  .filter((item: Product) => {
                                    return (search.length > 0 && (item.medicationName + ' ' + item.ndc + item.packageName).toLowerCase().includes(search.toLowerCase())) || search.length === 0;
                                  })
                                  .filter((item: Product) => {
                                    if (!favFilter) {
                                      return true;
                                    }
                                    return item.isFavorite === true;
                                  })
                                  .filter((item: Product) => {
                                    if (categoryFilters.length === 0) {
                                      return true;
                                    }
                                    return categoryFilters.includes(item.packageId) || categoryFilters.includes(item.sub_pkg_id);
                                  })
                                  .filter((item: Product) => {
                                    if (selectedDosageFilters.length === 0) {
                                      return true;
                                    }
                                    return selectedDosageFilters.includes(item.dosageForms);
                                  })
                                  .map((data: any | Product, index: number) => {
                                    return (
                                      <Box className="product_out" key={index}>
                                        <Box className="product_outerInfo_content">
                                          <Box className="productInfos">
                                            <Box className="product-short-img-block">
                                              <Box className="product-short-img" style={{ background: 'url(' + `https://www.imprimisrx.com/s/sfsites/c/cms/delivery/media/${data?.contentKey}` + ')' }}></Box>
                                            </Box>
                                            <Typography className="Product_name" style={{ lineHeight: '1.2' }}>
                                              {data?.medicationName}
                                            </Typography>
                                            <Typography className="Product_qty">{data?.formattedSize}</Typography>
                                          </Box>
                                          <Box className="productInfosbtn">
                                            <Button
                                              variant="outlined"
                                              style={{
                                                color: `${user?.isApproved === true ? '#00ACBA' : ''}`,
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                backgroundColor: '#fff',
                                                border: `${user?.isApproved === true ? '1px solid #00ACBA' : ''}`,
                                                borderRadius: '8px',
                                                boxShadow: 'none',
                                                height: '39px',
                                                width: '200px',
                                                marginInline: 'auto',
                                                textTransform: 'capitalize',
                                                marginTop: '6px'
                                              }}
                                              onClick={() => user?.isApproved && handleMedication(data)}
                                              disabled={user?.isApproved === false}
                                            >
                                              Prescribe
                                            </Button>
                                          </Box>
                                        </Box>

                                        <Box className="favorite_product">
                                          <ul>
                                            <li className="fav-icon-outer">
                                              <img src={data.isFavorite ? favFilled : favOutline} alt="fav" height={17} onClick={() => handleFav(data)} />
                                            </li>
                                            <li className="product-insert-icon-outer" onClick={() => handleProductInsertPdf(data?.productInsertPdf)}>
                                              <img src={Product_ins} alt="logo" height={17} />
                                              <Typography component="p">
                                                Product<br></br>
                                                Insert
                                              </Typography>
                                            </li>
                                          </ul>
                                        </Box>
                                      </Box>
                                    );
                                  })}
                            </Stack>
                          </Box>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Box>
                </Container>
              </Box>
            </Box>
            <Box className="chat-floating-icon">
              <img src={Chat} alt="logo" height={65} width={65} />
            </Box>
            <Box className="Prescribe-icon" onClick={handlePrescribeDetail}>
              <img src={Prescribe} alt="logo" height={100} width={180} />
            </Box>
          </Stack>
          <Footer />
        </>
      )}
    </>
  );
};
export default ProductPage;
