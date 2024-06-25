import { AddMedicationForm, AddMedicationHandler } from '../../../services/pages/popup-form/AddMedicationForm.service';
import { Box, Container, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FieldControl, FieldGroup, Validators } from 'react-reactive-form';
import { productActions, prescriptionActions } from '../../../store/Actions';
import { useAppDispatch, useAppSelector } from '../../../store';
import '../../../theme/temp/pages/prescription-ordering.scss';
import { AxiosResponse } from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitleProps } from '../../../interfaces/DialogTitleProps';
import { InputComment } from '../../../core/forms/InputComment';
import { InputSearchSelect } from '../../../core/forms/inputs/InputSearchSelect';
import { InputSelect } from '../../../core/forms/inputs/InputSelect';
import { RadioInput } from '../../../core/forms/inputs/RadioInput';
import { InputQuantitySelect } from '../../../core/forms/inputs/InputQuantitySelect';
import { InputText } from '../../../core/forms/inputs/InputText';
// import { InputSelectFreeSolo } from '../../../core/forms/inputs/InputSelectFreeSolo';
import { PRODUCT_CATALOG, ADD_DOSING_DIRECTIONS } from '../../../constants/Endpoints';
import { Medication } from '../../../models/Medication';
import Doctor from '../../../constants/grx-api';
import PrimaryButton from '../../../core/buttons/primary-button';
import { Product } from '../../../models/Product';
import { ProductSize } from '../../../models/ProductSize';
import TertiaryButton from '../../../core/buttons/tertiary-button';
import { useNavigate } from 'react-router-dom';
import { Order } from '../../../models/Order';
import { toast } from 'react-toastify';
import { FormArray, FormControl as FormControlType, FormGroup } from 'react-reactive-form';
import { FormControl, Autocomplete, TextField } from '@mui/material';
import { Color } from '../../../interfaces/Color';
import { createFilterOptions } from '@mui/material/Autocomplete';

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

export const AddMedication = (props: { handleClose: () => void; order?: Order | undefined; medicationIndex?: number | undefined; edit?: boolean; accountId?: string | undefined }) => {
  const dispatch = useAppDispatch();
  // const productCatalog = useAppSelector(state => state.productReducer.products);
  const productCatalog = useAppSelector((state) => state.productReducer.prescriberBlueViewProducts);

  const [quantities, setQuantities] = useState<any>([]);
  const [refills, setrefills] = useState<any>([]);
  const [dosingInstructions, setDosingInstructions] = useState<any>([]);
  const [medicalNecessities, setMedicalNecessities] = useState<any>([]);
  const [selectedMedication, setSelectedMedication] = useState<Product | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<any>([]);
  const [otherClinicalDifferenceRequired, setOtherClinicalDifferenceRequired] = useState<boolean>(false);
  const [value, setValue] = useState<any | null>(null);
  const router = useNavigate();

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

  const onSelectDosingInstructions = (value: any) => {
    if (value !== null || value !== undefined) {
      AddMedicationForm.patchValue({
        choose_dosing_instruction: value
      });
    }
  };

  const onSelectQuantity = (value: number, data: any) => {
    if (value && data) {
      const price = parseFloat(data?.quantityVolume) * parseFloat(data?.staticPrice);
      AddMedicationForm.patchValue({
        quantity: value,
        quantityLabel: data?.name,
        price: price.toFixed(2)
      });
    }
  };

  const onSelectMedication = (value: { data: Product }) => {
    if (productCatalog) {
      const selected = (productCatalog as Product[]).find((item: Product) => item.id === value.data.id);
      if (selected) {
        // console.log("T::", selected);
        const quantityOptions = Array.isArray(selected?.productQuantities) && selected?.productQuantities?.map((qty: any) => ({ id: qty?.quantityVolume, label: qty?.name, value: qty?.quantityVolume, data: qty })).sort((a: any, b: any) => parseInt(a?.label) - parseInt(b?.label));
        // console.log("Q::",quantityOptions);
        setQuantities(quantityOptions);
        const refillOptions = Array.isArray(selected?.productRefills) && selected?.productRefills?.map((refill: any) => ({ id: refill?.id, label: refill?.name, value: refill?.value })).sort((a: any, b: any) => parseInt(a?.label) - parseInt(b?.label));
        setrefills(refillOptions);
        const dosingInstructionsOptions = Array.isArray(selected?.productDirections) && selected?.productDirections.map((instruction: any) => ({ id: instruction?.name, label: instruction?.name, value: instruction?.name })).sort((a: any, b: any) => parseInt(a?.label) - parseInt(b?.label));
        setDosingInstructions(dosingInstructionsOptions);
        const medicationNecessityOptions = selected?.medicalNecessity?.split(';');
        setMedicalNecessities(medicationNecessityOptions);
        AddMedicationForm.patchValue({
          medication: selected,
          size: selected.size,
          quantity: selected.productQuantities[0].quantityVolume,
          // supply: selected.productQuantities[0].daySupply,
          temperature: selected.temp,
          refills: 0,
          choose_medical_necessity: medicationNecessityOptions.length > 0 && medicationNecessityOptions[0],
          comments: '',
          price: selected.price,
          choose_dosing_instruction: ''
        });
        onSelectQuantity(selected.productQuantities[0].quantityVolume, selected.productQuantities[0]);
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
      selectedMedication: AddMedicationForm.value.medication
    };

    // add other clinical difference if user has selected
    AddMedicationForm.value.other_clinical_difference && (medication['other_clinical_difference'] = AddMedicationForm.value.other_clinical_difference);

    // check if the direction added, is a custom direction
    const isExist: any = AddMedicationForm.value.medication.productDirections.find((direction: any) => direction.name === AddMedicationForm.value.choose_dosing_instruction);
    if (!isExist) {
      addDosingDirections(props?.accountId as string, AddMedicationForm?.value?.medication?.ndc, AddMedicationForm.value.choose_dosing_instruction);
    }

    let order;

    if (props.order) {
      order = props.order;
      order.blocks[0].prescriptions[0] = medication;
    } else {
      order = {
        billTo: {
          type: '',
          value: ''
        },
        shipTo: {
          type: '',
          value: ''
        },
        comment: '',
        credit_card: '',
        needByDate: '',
        selectPrescriber: '',
        selectedPrescriberName: '',
        npi: '',
        blocks: [
          {
            patients: [],
            prescriptions: [medication]
          }
        ]
      };
    }

    dispatch(prescriptionActions.setPrescribeOrder(order));

    AddMedicationForm.reset();
    props.handleClose();
    router('/home/prescribe-now');
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
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setValue({
                label: newValue.inputValue
              });
              if (newValue !== null || newValue !== undefined) {
                // console.log('check2', newValue);
                AddMedicationForm.patchValue({
                  choose_dosing_instruction: newValue.inputValue
                });
              }
            } else {
              setValue({ label: newValue?.value });
              if (newValue !== null || newValue !== undefined) {
                // console.log('check3', newValue);
                AddMedicationForm.patchValue({
                  choose_dosing_instruction: newValue.value
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
            return option.label;
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
    if (typeof props?.medicationIndex === 'number' && Array.isArray(productCatalog)) {
      onSelectMedication({ data: productCatalog[props?.medicationIndex] });
    }
  }, []);

  useEffect(() => {
    isOtherClinicalDifferenceRequired();
  });

  return (
    <>
      <BootstrapDialogTitle id="customized-dialog-title" onClose={props.handleClose}></BootstrapDialogTitle>
      <DialogContent dividers className="popup_content_medication">
        <Box component="main" className="popup-info_medication">
          <Container maxWidth="lg">
            <Box className="main-box">
              <Box sx={{ bgcolor: 'background.paper' }}>
                <Stack className="modal_heading_main" direction="row" justifyContent="center" alignItems="center">
                  <Typography className="heading_bottom_without_border">Add Medication</Typography>
                </Stack>
                <Box>
                  {productCatalog && Array.isArray(productCatalog) && productCatalog?.length > 0 && (
                    <FieldGroup
                      control={AddMedicationForm}
                      render={({ get, invalid }) => (
                        <form>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={4} lg={4} className="select_eyes_radio">
                              <Typography component="p">
                                Eye <span>*</span>
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={8} lg={8}>
                              <FieldControl
                                name="eye"
                                render={RadioInput}
                                meta={{
                                  name: 'eye',
                                  // defaultValue: get('eye').value,
                                  options: [
                                    { label: 'left eye', value: 'left eye' },
                                    { label: 'right eye', value: 'right eye' },
                                    { label: 'both eye', value: 'both eye' }
                                  ]
                                }}
                              />
                            </Grid>
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
                                  editMode: props?.edit
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <FieldControl
                                name="quantity"
                                render={InputQuantitySelect}
                                meta={{
                                  name: 'quantity',
                                  options: quantities.map((item: { label: string; value: string; id: string }) => {
                                    return { label: item.label, value: item.value, data: item };
                                  }),
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
                                  options: refills.length > 0 ? refills : []
                                }}
                              />
                            </Grid>
                            {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                              <FieldControl
                                name="choose_dosing_instruction"
                                render={InputSelect}
                                meta={{ name: 'choose_dosing_instruction', label: 'Choose Dosing Instructions', placeholder: 'Please Enter Choose Dosing Instructions', options: dosingInstructions?.length > 0 ? dosingInstructions : [] }}
                              />
                            </Grid> */}
                            <Grid item xs={12} sm={12} md={12} lg={12}>
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
                                    <Box style={{ width: 'auto', paddingLeft: 2, paddingRight: 2 }}>
                                      <TertiaryButton label={'Cancel'} onClick={props.handleClose}></TertiaryButton>
                                    </Box>
                                    <Box style={{ width: 'auto', paddingLeft: 2, paddingRight: 2 }}>
                                      <PrimaryButton label={'Add Medication'} onClick={addMedicationHandler}></PrimaryButton>
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
