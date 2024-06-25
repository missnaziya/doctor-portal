import { Block, Order } from '../../../models/Order';
import { Box, Container, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FieldControl, FieldGroup, Validators } from 'react-reactive-form';
import { useAppDispatch, useAppSelector } from '../../../store';

import { AddMedicationForm } from '../../../services/pages/popup-form/AddMedicationForm.service';
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitleProps } from '../../../interfaces/DialogTitleProps';
import { InputComment } from '../../../core/forms/InputComment';
import { InputSearchSelect } from '../../../core/forms/inputs/InputSearchSelect';
import { InputQuantitySelect } from '../../../core/forms/inputs/InputQuantitySelect';
import { InputSelect } from '../../../core/forms/inputs/InputSelect';
import { InputText } from '../../../core/forms/inputs/InputText';
import { Medication } from '../../../models/Medication';
import { PRODUCT_CATALOG, ADD_DOSING_DIRECTIONS, GET_DOSING_DIRECTIONS } from '../../../constants/Endpoints';
import Doctor from '../../../constants/grx-api';
import PrimaryButton from '../../../core/buttons/primary-button';
import { Product } from '../../../models/Product';
import { ProductSize } from '../../../models/ProductSize';
import TertiaryButton from '../../../core/buttons/tertiary-button';
import { productActions } from '../../../store/Actions';
import { PrescriptionInterface } from '../../../interfaces/prescription';
import { toast } from 'react-toastify';
import { FormArray, FormControl as FormControlType, FormGroup } from 'react-reactive-form';
import { FormControl, Autocomplete, TextField } from '@mui/material';
import { Color } from '../../../interfaces/Color';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { AxiosResponse } from 'axios';

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const filter = createFilterOptions<any>();

export const AddPrescriptionMedication = (props: {
  handleClose: (medication?: Medication | null, order?: Order | { block: Block; i: number } | null, prIndex?: number) => void;
  data: { block: Block | undefined; i: number | undefined };
  prIndex?: number;
  medicationIndex?: number;
  edit?: boolean;
  blueView?: string | undefined;
  accountId?: string | undefined;
}) => {
  // let defaultVal: any = '';
  const dispatch = useAppDispatch();
  const productCatalog: Product[] = useAppSelector((state) => state.productReducer.products);
  const patientBlueViewProducts: Product[] = useAppSelector((state) => state.productReducer.patientBlueViewProducts);
  const prescriberBlueViewProducts: Product[] = useAppSelector((state) => state.productReducer.prescriberBlueViewProducts);

  const [quantities, setQuantities] = useState<any>([]);
  const [refills, setrefills] = useState<any>([]);
  const [dosingDirections, setDosingDirections] = useState<any>({});
  const [dosingInstructions, setDosingInstructions] = useState<any>([]);
  const [medicalNecessities, setMedicalNecessities] = useState<any>([]);
  const [selectedMedication, setSelectedMedication] = useState<Product | null>(null);
  const [otherClinicalDifferenceRequired, setOtherClinicalDifferenceRequired] = useState<boolean>(false);
  const [value, setValue] = useState<any | null>(null);

  // Conditionally apply validation to `other medical difference` field based on `choose_medication_necessity` value
  const isOtherClinicalDifferenceRequired = () => {
    const chooseMedicationNecessityControl = AddMedicationForm.controls.choose_medical_necessity;
    const otherClinicalDifferenceControl = AddMedicationForm.controls.other_clinical_difference;
    chooseMedicationNecessityControl.valueChanges.subscribe((value: string) => {
      if (value !== null) {
        if (value && value.toLowerCase() === 'other clinical difference') {
          // Apply validation
          otherClinicalDifferenceControl.setValidators([Validators.required]);
        } else {
          // Remove validation
          otherClinicalDifferenceControl.setValidators([]);
        }
        // Update the validity of the control
        otherClinicalDifferenceControl.updateValueAndValidity();
        value.toLowerCase().trim() === 'other clinical difference' ? setOtherClinicalDifferenceRequired(true) : setOtherClinicalDifferenceRequired(false);
      }
    });
  };

  const onSelectQuantity = (value: any, data: any) => {
    if (value && data) {
      // console.log('DATA:::', data);
      const price = parseFloat(data?.quantityVolume) * parseFloat(data?.staticPrice);
      AddMedicationForm.patchValue({
        quantity: value,
        quantityLabel: data?.name,
        price: price.toFixed(2)
      });
    }
  };

  const onSelectMedication = (value: { data: Product }, qty?: number, dosingInstruction?: string) => {
    if (productCatalog) {
      AddMedicationForm.reset();
      let selected: any;
      if (props?.blueView === 'patient') {
        selected = (patientBlueViewProducts as Product[]).find((item: Product) => item?.id === value?.data?.id);
      } else if (props?.blueView === 'prescriber') {
        selected = (prescriberBlueViewProducts as Product[]).find((item: Product) => item?.id === value?.data?.id);
      } else {
        selected = (productCatalog as Product[]).find((item: Product) => item?.id === value?.data?.id);
      }
      if (selected) {
        // console.log("T::", selected);
        const quantityOptions =
          Array.isArray(selected?.productQuantities) && selected?.productQuantities?.map((qty: any) => ({ id: qty?.quantityVolume, label: qty?.name, value: qty?.quantityVolume, daySupply: qty?.daySupply, data: qty })).sort((a: any, b: any) => parseInt(a?.label) - parseInt(b?.label));
        setQuantities(quantityOptions);
        const refillOptions = Array.isArray(selected?.productRefills) && selected?.productRefills?.map((refill: any) => ({ id: refill?.id, label: refill?.name, value: refill?.value })).sort((a: any, b: any) => parseInt(a?.label) - parseInt(b?.label));
        setrefills(refillOptions);
        const dosingInstructionsOptions = Array.isArray(selected?.productDirections) && selected?.productDirections.map((instruction: any) => ({ id: instruction?.name, label: instruction?.name, value: instruction?.name })).sort((a: any, b: any) => parseInt(a?.label) - parseInt(b?.label));
        setDosingInstructions(dosingInstructionsOptions);
        const medicationNecessityOptions = selected?.medicalNecessity?.split(';');
        setMedicalNecessities(medicationNecessityOptions);
        AddMedicationForm.patchValue({
          medication: selected,
          size: selected?.size,
          quantity: props.edit ? qty : selected.productQuantities[0].quantityVolume,
          // supply: selected.productQuantities[0].daySupply,
          temperature: selected.temp,
          refills: 0,
          choose_medical_necessity: medicationNecessityOptions.length > 0 && medicationNecessityOptions[0],
          comments: '',
          price: selected.price,
          choose_dosing_instruction: ''
        });
        if (!props.edit) {
          onSelectQuantity(selected.productQuantities[0].quantityVolume, selected.productQuantities[0]);
        }
        setSelectedMedication(selected);
      }
    }
  };

  const addMedicationHandler = () => {
    AddMedicationForm.controls.medication.markAsTouched({ emitEvent: true, onlySelf: true });
    AddMedicationForm.controls.quantity.markAsTouched({ emitEvent: true, onlySelf: true });
    // AddMedicationForm.controls.supply.markAsTouched({ emitEvent: true, onlySelf: true });
    AddMedicationForm.controls.refills.markAsTouched({ emitEvent: true, onlySelf: true });
    AddMedicationForm.controls.choose_dosing_instruction.markAsTouched({ emitEvent: true, onlySelf: true });
    AddMedicationForm.controls.choose_medical_necessity.markAsTouched({ emitEvent: true, onlySelf: true });
    AddMedicationForm.controls.other_clinical_difference.markAsTouched({ emitEvent: true, onlySelf: true });
    AddMedicationForm.controls.comments.markAsTouched({ emitEvent: true, onlySelf: true });

    if (AddMedicationForm.invalid) {
      return;
    }

    let medication: Medication = {
      medication: AddMedicationForm.value.medication.medicationName,
      quantity: AddMedicationForm.value.quantity,
      quantityLabel: AddMedicationForm.value.quantityLabel,
      // supply: AddMedicationForm.value.supply,
      temperature: AddMedicationForm.value.temperature,
      refills: AddMedicationForm.value.refills,
      choose_dosing_instruction: AddMedicationForm.value.choose_dosing_instruction,
      choose_medical_necessity: AddMedicationForm.value.choose_medical_necessity,
      comments: AddMedicationForm.value.comments,
      price: AddMedicationForm.value.price,
      selectedMedication: AddMedicationForm.value.medication as Product
    };

    // add other clinical difference if user has selected
    AddMedicationForm.value.other_clinical_difference && (medication['other_clinical_difference'] = AddMedicationForm.value.other_clinical_difference);

    // check if the direction added, is a custom direction
    const isExist: any = AddMedicationForm.value.medication.productDirections.find((direction: any) => direction.name === AddMedicationForm.value.choose_dosing_instruction);
    if (!isExist) {
      addDosingDirections(props?.accountId as string, AddMedicationForm?.value?.medication?.ndc, AddMedicationForm.value.choose_dosing_instruction);
    }

    // edit handle close callback
    if (props.edit) props.handleClose(medication, props?.data as { block: Block; i: number }, props?.prIndex);
    // add handle close callback
    else props.handleClose(medication, props?.data as { block: Block; i: number });
    AddMedicationForm.reset();
  };

  // add dosing directions
  const addDosingDirections = async (accountId: string, ndc: string, directions: string) => {
    try {
      const payload: { accountId: string; ndc: string; directions: string } = {
        accountId: accountId,
        ndc: ndc,
        directions: directions
      };
      await Doctor.post(ADD_DOSING_DIRECTIONS, payload);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const InputSelectFreeSolo = ({ touched, hasError, meta }: FormArray | FormControlType | FormGroup) => {
    const getColor = () => {
      if (touched) {
        if (hasError('required')) {
          return Color.ERROR;
        }
        return Color.SUCCESS;
      }
      return Color.PRIMARY;
    };

    const getError = () => {
      if (touched) {
        if (hasError('required')) {
          return true;
        }
        return false;
      }

      return false;
    };

    const isRequired = () => {
      if (typeof meta.required != 'undefined') {
        return meta.required;
      }
      return true;
    };

    return meta?.options ? (
      <FormControl className="form-input select" sx={{ width: '100%' }} error={getError()}>
        <Autocomplete
          value={value}
          onBlur={(e: React.FocusEvent<HTMLInputElement, Element>) => {
            if (!AddMedicationForm.value.choose_dosing_instruction && e.target.value) {
              AddMedicationForm.patchValue({
                choose_dosing_instruction: e.target.value
              });
            } else if (AddMedicationForm.value.choose_dosing_instruction && e.target.value) {
              AddMedicationForm.patchValue({
                choose_dosing_instruction: e.target.value
              });
            }
          }}
          onChange={(event, newValue) => {
            // console.log('evt', event, newValue);
            if (typeof newValue === 'string') {
              setValue({
                label: newValue
              });
              if (newValue !== null || newValue !== undefined) {
                // console.log('check1', newValue);
                AddMedicationForm.patchValue({
                  choose_dosing_instruction: newValue
                });
              }
            } else if (newValue && newValue?.inputValue) {
              // Create a new value from the user input
              setValue({
                label: newValue?.inputValue
              });
              if (newValue !== null || newValue !== undefined) {
                // console.log('check2', newValue);
                AddMedicationForm.patchValue({
                  choose_dosing_instruction: newValue?.inputValue
                });
              }
            } else {
              setValue({ label: newValue?.value });
              if (newValue !== null || newValue !== undefined) {
                // console.log('check3', newValue);
                AddMedicationForm.patchValue({
                  choose_dosing_instruction: newValue?.value
                });
              }
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = meta?.options?.some((option: any) => inputValue === option?.label);
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                label: `Add "${inputValue}"`
              });
            }
            return filtered;
          }}
          selectOnFocus
          handleHomeEndKeys
          id="free-solo-with-text-demo"
          options={meta?.options}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === 'string') {
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return `Add "${option.inputValue}"`;
            }
            // Regular option
            if (option && option.label) {
              return option.label;
            }
            return '';
          }}
          renderInput={(params) => <TextField required={isRequired()} helperText={getError() && meta.helperText} color={getColor()} error={getError()} {...params} label={meta.label} placeholder={meta.placeholder} />}
          freeSolo // Allow free typing
        />
      </FormControl>
    ) : (
      <></>
    );
  };

  useEffect(() => {
    AddMedicationForm.reset();
    // loadCatalog();
    // in case of edit
    if (props?.edit && props?.data && typeof props?.prIndex === 'number') {
      onSelectMedication({ data: props?.data?.block?.prescriptions[props?.prIndex]?.selectedMedication as Product }, props?.data?.block?.prescriptions[props?.prIndex]?.quantity as any);
      setValue(props?.data?.block?.prescriptions[props?.prIndex]?.choose_dosing_instruction);
      AddMedicationForm.patchValue({
        choose_dosing_instruction: props?.data?.block?.prescriptions[props?.prIndex]?.choose_dosing_instruction,
        comments: props?.data?.block?.prescriptions[props?.prIndex]?.comments,
        refills: props?.data?.block?.prescriptions[props?.prIndex]?.refills
      });
    }
  }, []);

  useEffect(() => {
    isOtherClinicalDifferenceRequired();
  });

  return (
    <>
      <BootstrapDialogTitle id="customized-dialog-title" onClose={() => props.handleClose()}></BootstrapDialogTitle>
      <DialogContent dividers className="popup_content_medication">
        <Box component="main" className="popup-info_medication">
          <Container maxWidth="xl">
            <Box className="main-box">
              <Box sx={{ bgcolor: 'background.paper' }}>
                <Stack className="modal_heading_main" direction="row" justifyContent="center" alignItems="center">
                  <Typography className="heading_bottom_without_border">{props.edit ? 'Edit Medication' : 'Add Medication'}</Typography>
                </Stack>
                <Box>
                  {productCatalog && patientBlueViewProducts && prescriberBlueViewProducts && (
                    <FieldGroup
                      control={AddMedicationForm}
                      render={({ get, invalid }) => (
                        <form>
                          <Grid container spacing={2}>
                            {props?.blueView === 'patient' && (
                              <Grid item xs={12} sm={12} md={12} lg={12} id="add_medication_form">
                                <FieldControl
                                  name="medication"
                                  render={InputSearchSelect}
                                  meta={{
                                    name: 'medication',
                                    options: (patientBlueViewProducts as Product[]).map((item: Product) => {
                                      return { label: item.medicationName, value: item.id, data: item };
                                    }),
                                    label: 'Medication',
                                    placeholder: 'Please Enter Medication',
                                    onChange: onSelectMedication,
                                    defaultIndex: props?.medicationIndex,
                                    editMode: props.edit
                                  }}
                                />
                              </Grid>
                            )}
                            {props?.blueView === 'prescriber' && (
                              <Grid item xs={12} sm={12} md={12} lg={12} id="add_medication_form">
                                <FieldControl
                                  name="medication"
                                  render={InputSearchSelect}
                                  meta={{
                                    name: 'medication',
                                    options: (prescriberBlueViewProducts as Product[]).map((item: Product) => {
                                      return { label: item.medicationName, value: item.id, data: item };
                                    }),
                                    label: 'Medication',
                                    placeholder: 'Please Enter Medication',
                                    onChange: onSelectMedication,
                                    defaultIndex: props?.medicationIndex,
                                    editMode: props.edit
                                  }}
                                />
                              </Grid>
                            )}
                            {props?.blueView !== 'patient' && props?.blueView !== 'prescriber' && (
                              <Grid item xs={12} sm={12} md={12} lg={12} id="add_medication_form">
                                <FieldControl
                                  name="medication"
                                  render={InputSearchSelect}
                                  meta={{
                                    name: 'medication',
                                    options: (productCatalog as Product[]).map((item: Product) => {
                                      return { label: item.medicationName, value: item.id, data: item };
                                    }),
                                    label: 'Medication',
                                    placeholder: 'Please Enter Medication',
                                    onChange: onSelectMedication,
                                    defaultIndex: props?.medicationIndex,
                                    editMode: props.edit
                                  }}
                                />
                              </Grid>
                            )}
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <FieldControl
                                name="quantity"
                                render={InputQuantitySelect}
                                meta={{
                                  name: 'quantity',
                                  options: Array.isArray(quantities)
                                    ? quantities.map((item: { label: string; value: string; id: string; data: any }) => {
                                        return { label: item.label, value: item.value, data: item };
                                      })
                                    : [{ label: '0', value: '0', id: '0', data: {} }],
                                  label: 'Quantity (ML)',
                                  placeholder: 'Quantity (ML)',
                                  onChange: onSelectQuantity,
                                  defaultVal: AddMedicationForm?.value?.quantity
                                }}
                              />
                            </Grid>
                            {/* <Grid item xs={12} sm={12} md={6} lg={6}>
                              <FieldControl name="supply" render={InputText} meta={{ name: 'supply', label: 'Day Supply (Edit As Needed)', placeholder: 'Please Enter Day Supply (Edit As Needed)' }} />
                            </Grid> */}
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <FieldControl
                                name="refills"
                                render={InputSelect}
                                meta={{
                                  name: 'refills',
                                  label: 'Refills',
                                  placeholder: 'Please Enter Refills',
                                  options: Array.isArray(refills) ? refills : [{ id: '0', label: '0', value: '0' }]
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              {/* <FieldControl
                          name="choose_dosing_instruction"
                          render={InputSelect}
                          meta={{
                            name: "choose_dosing_instruction",
                            label: "Choose Dosing Instructions",
                            placeholder: "Please Enter Choose Dosing Instructions",
                            options: (Array.isArray(dosingInstructions) ? dosingInstructions : [{ label: '0', value: '0', data: '0' }])
                          }} /> */}
                              <FieldControl
                                name="choose_dosing_instruction"
                                render={InputSelectFreeSolo}
                                meta={{
                                  name: 'choose_dosing_instruction',
                                  label: 'Choose Dosing Instructions',
                                  placeholder: 'Please Enter Choose Dosing Instructions',
                                  options: dosingInstructions?.length > 0 ? dosingInstructions : []
                                  // onChange: onSelectDosingInstructions,
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <FieldControl
                                name="choose_medical_necessity"
                                render={InputSelect}
                                meta={{
                                  name: 'choose_medical_necessity',
                                  label: 'Choose Medical Necessity',
                                  placeholder: 'Please Enter Choose Medical Necessity',
                                  options: Array.isArray(medicalNecessities) ? medicalNecessities.map((medicalNecessity: any) => ({ id: medicalNecessity, label: medicalNecessity, value: medicalNecessity })) : [{ id: '', label: '', value: '' }]
                                }}
                              />
                            </Grid>
                            {otherClinicalDifferenceRequired && (
                              <Grid item xs={12} sm={12} md={12} lg={12}>
                                <FieldControl
                                  name="other_clinical_difference"
                                  render={InputComment}
                                  meta={{
                                    name: 'other_clinical_difference',
                                    value: 'comments',
                                    label: 'Other Clinical Difference Reason',
                                    helperText: 'Comments are required',
                                    required: otherClinicalDifferenceRequired,
                                    placeholder: 'Please Mention reason'
                                  }}
                                />
                              </Grid>
                            )}
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <FieldControl name="comments" render={InputComment} meta={{ name: 'comments', value: 'comments', label: 'Comments', helperText: 'Comments are required', required: false, placeholder: 'Write Comments.........' }} />
                            </Grid>
                            <Grid className="billing_info bottom" pt="0" container spacing={2}>
                              <Grid item xs={12} sm={12} md={12} lg={12} pl={0}>
                                <Grid item className="inputs_fields_ratio">
                                  <Box className="mandatory">
                                    <span> * </span> This field is mandatory
                                  </Box>
                                  <Box className="d-vh-between" gap={2} mt={1}>
                                    <Box style={{ width: '146px' }}>
                                      <TertiaryButton label={'Cancel'} onClick={() => props.handleClose()}></TertiaryButton>
                                    </Box>
                                    <Box style={{ width: '230px' }}>
                                      <PrimaryButton label={props.edit ? 'Save Medication' : 'Add Medication'} onClick={addMedicationHandler}></PrimaryButton>
                                    </Box>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </form>
                      )}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      </DialogContent>
    </>
  );
};
