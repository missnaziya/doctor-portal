import { Paper, Stack } from '@mui/material';
import React, { Dispatch } from 'react';
import { StyledTableCell, StyledTableRow } from '../../core/tables/tableStyles';

import Add from '../../assets/icons/add-icon.svg';
import { PatientInterface } from '../../interfaces/patient';
import { SortConfigInterface } from '../../interfaces/sortConfig';
import Table from '@mui/material/Table';
import TableArrow from '../../assets/icons/table_arrow.svg';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const useSortableData = (items: PatientInterface[] = [], config = null) => {
  const [sortConfig, setSortConfig]: [SortConfigInterface | null, Dispatch<SortConfigInterface | null>] = React.useState<SortConfigInterface | null>(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = items;
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key as keyof PatientInterface] < b[sortConfig.key as keyof PatientInterface]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof PatientInterface] > b[sortConfig.key as keyof PatientInterface]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

export const PatientTable = (props: { data: PatientInterface[]; onChange?: (patient: PatientInterface) => void }) => {
  const router = useNavigate();

  const formatDate = (date: string) => {
    if (!date) {
      return '';
    }
    return moment.utc(date).format('MM/DD/YYYY');
  };

  const handleContactProfile = (row: PatientInterface) => {
    router(`/home/patient/detail/${row.pat_id}`);
  };

  const { items, requestSort, sortConfig } = useSortableData(props.data ?? []);

  const getClassNamesFor = (name: string) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  return (
    <TableContainer component={Paper} className="table_customized_Prescription">
      <Table sx={{ minWidth: 700 }} stickyHeader>
        <TableHead className="table_head">
          <TableRow>
            <StyledTableCell onClick={() => requestSort('fname')} className={getClassNamesFor('fname')} sx={{ display: 'flex', alignItems: 'left', paddingLeft: '30px' }}>
              Patient Name{' '}
              <span style={{ paddingLeft: '3px' }}>
                <img className="right_arrow" src={TableArrow} alt="logo" height={10} width={10} />
              </span>
            </StyledTableCell>
            <StyledTableCell onClick={() => requestSort('birth_date')} className={getClassNamesFor('birth_date')}>
              DOB{' '}
              <span>
                <img className="right_arrow" src={TableArrow} alt="logo" height={10} width={10} />
              </span>
            </StyledTableCell>
            <StyledTableCell onClick={() => requestSort('phone_nbr')} className={getClassNamesFor('phone_nbr')}>
              Phone{' '}
              <span>
                <img className="right_arrow" src={TableArrow} alt="logo" height={10} width={10} />
              </span>
            </StyledTableCell>
            <StyledTableCell onClick={() => requestSort('prescriber')} className={getClassNamesFor('prescriber')}>
              Prescriber{' '}
              <span>
                <img className="right_arrow" src={TableArrow} alt="logo" height={10} width={10} />
              </span>
            </StyledTableCell>
            <StyledTableCell onClick={() => requestSort('prescriber')} className={getClassNamesFor('prescriber')}>
              Add Date{' '}
              <span>
                <img className="right_arrow" src={TableArrow} alt="logo" height={10} width={10} />
              </span>
            </StyledTableCell>
            <StyledTableCell>Add Prescription</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody className="table_body">
          {items &&
            items.map((row: PatientInterface, index: number) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="td" className="table_first" onClick={() => handleContactProfile(row)}>
                  <Stack direction="row" alignItems="center" justifyContent="flex-start" style={{ paddingLeft: 15 }}>
                    {/* <span className="table_profile_image">PM</span>  */}
                    {`${row.fname} ${row.lname}`}
                  </Stack>
                </StyledTableCell>
                <StyledTableCell component="td" onClick={() => handleContactProfile(row)}>
                  <Stack>
                    <Stack>{formatDate(row.birth_date)}</Stack>
                  </Stack>
                </StyledTableCell>
                <StyledTableCell component="td" onClick={() => handleContactProfile(row)}>
                  <Stack>{row && row.hp_area_code && row.hp_phone_number ? `(${row.hp_area_code}) ${row.hp_phone_number.trim().replace(/(\d{3})(\d{4})$/, '$1-$2')}` : ''}</Stack>
                </StyledTableCell>
                <StyledTableCell component="td" onClick={() => handleContactProfile(row)}>
                  <Stack>{row.prescriber}</Stack>
                </StyledTableCell>
                <StyledTableCell component="td" onClick={() => handleContactProfile(row)}>
                  <Stack>{moment.utc(row.add_date).format('MM/DD/YYYY')}</Stack>
                </StyledTableCell>
                <StyledTableCell component="td" onClick={() => props.onChange && props.onChange(row)} className="plusIcon">
                  <img src={Add} height={15} width={15} alt="logo" />
                </StyledTableCell>
              </StyledTableRow>
            ))}

          {(!items || items.length === 0) && (
            <StyledTableRow aria-colspan={5}>
              <StyledTableCell component="td" className="NoDataFound">
                {/* <Stack>Oops!...Current Patient Not Found.</Stack> */}
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
