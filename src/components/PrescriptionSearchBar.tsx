import React, { ChangeEvent, InputHTMLAttributes, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';

import { AxiosResponse } from 'axios';
import Doctor from '../constants/grx-api';
import { PatientInterface } from '../interfaces/patient';
import { SEARCH_PATIENT } from '../constants/Endpoints';
import { autocompleteClasses } from '@mui/material';
import searchIcon from '../../src/assets/icons/search_icon.svg';
import { styled } from '@mui/system';
import { toast } from 'react-toastify';
import { useAutocomplete } from '@mui/base';

const Input = styled('input')(
  ({ theme }) => `
display: flex;
align-items: center;
height: 48px;
border:none;
line-height: 22px;
width:300px;
border-radius: 24px 24px 24px 24px;
box-sizing: content-box;
padding: 0 4px 0 10px;
outline: 0;
overflow: hidden;
&:focus {
  border-bottom:1px solid #E2E2E2;
  border-radius: 24px 24px 0px 0px;
}

`
);

export const PrescriptionSearchBar = () => {
  const prescriptionApiData: PatientInterface[] = useAppSelector((state) => state.patientReducer.searchPatient);
  const [search, setSearch] = useState('');
  const [patientData, setPatientData] = useState([]);

  const handleSearchPatient = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setSearch(e.target.value);
      if (search.length > 3) {
        const data = {
          searchTex: search
        };
        const res: AxiosResponse = await Doctor.post(SEARCH_PATIENT, data);
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast(error?.response?.data?.message);
      }
    }
  };

  const { getRootProps, getInputProps, getListboxProps, getOptionProps, groupedOptions } = useAutocomplete({
    id: 'use-autocomplete-demo',
    options: prescriptionApiData,
    getOptionLabel: (option) => option.firstName
  });

  const getInputPropsObj = getInputProps() as InputHTMLAttributes<HTMLInputElement>;

  const Listbox = styled('ul')(
    ({ theme }) => `
    width: 314px;
    margin: 0px 0 0;
    padding: 0;
    position: absolute;
    list-style: none;
    background-color: #fff;
    overflow-y: auto;
    border-radius: 0px 0px 24px 24px;
    max-height: 250px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1;
  
    & li {
      padding: 5px 18px;
      display: flex;
      background-color: #fff;
      & span {
        flex-grow: 1;
      }
  
      & svg {
        color: transparent;
      }
    }
  
    & li[aria-selected='true'] {
      background-color:  rgba(103, 100, 100, 0.05);
      font-weight: 600;
  
      & svg {
        color: #1890ff;
      }
    }
  
    & li.${autocompleteClasses.focused} {
      background-color: rgba(103, 100, 100, 0.05);
      cursor: pointer;
  
      & svg {
        color: currentColor;
      }
    }
  `
  );

  return (
    <div>
      <div {...getRootProps()} className="searchIconOuter">
        <Input onChange={handleSearchPatient} {...getInputPropsObj} value={search} />
        <div className="icon_search">
          <img src={searchIcon} alt="search" height={15} width={18} />
        </div>
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          {(groupedOptions as typeof patientData).map((option, index) => (
            <li {...getOptionProps({ option, index })} key={index}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <div className="search_text">
                  hhhhhh
                  {/* {option.firstName} {''}
                  {option.lastName} */}
                </div>
                {/* <div className="search_text">{option}</div> */}
              </div>
            </li>
          ))}
        </Listbox>
      ) : null}
    </div>
  );
};
