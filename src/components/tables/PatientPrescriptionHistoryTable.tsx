import { Box, Paper, Stack } from '@mui/material';
import React, { ChangeEvent, Dispatch, useEffect, useState } from 'react';
import { StyledTableCell, StyledTableRow } from '../../core/tables/tableStyles';

import { PrescriptionInterface } from '../../interfaces/prescription';
import { SortConfigInterface } from '../../interfaces/sortConfig';
import Table from '@mui/material/Table';
import TableArrow from '../../assets/icons/table_arrow.svg';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { GET_SHIPPING_CARRIER, FEDEX_TRACK_URL, STAMPS_COM_TRACK_URL, UPS_TRACK_URL } from '../../constants/Endpoints';
import { AxiosResponse } from 'axios';
import Doctor from '../../constants/grx-api';
import { toast } from 'react-toastify';
import SearchBar from '../search-bar';

const useSortableData = (items: PrescriptionInterface[] = [], config = null) => {
  const [sortConfig, setSortConfig]: [SortConfigInterface | null, Dispatch<SortConfigInterface | null>] = React.useState<SortConfigInterface | null>(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key as keyof PrescriptionInterface] < b[sortConfig.key as keyof PrescriptionInterface]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof PrescriptionInterface] > b[sortConfig.key as keyof PrescriptionInterface]) {
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

export const PatientPrescriptionHistoryTable = (props: { data: PrescriptionInterface[] }) => {
  const router = useNavigate();
  const [originalData, setOriginalData] = useState(props.data || []);
  const [filteredData, setFilteredData] = useState(props.data || []);
  const [search, setSearch] = React.useState<string>('');

  const setSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const formatDate = (date: string) => {
    return moment(date).format('MM/DD/YYYY');
  };

  const { items, requestSort, sortConfig } = useSortableData(filteredData ?? []);

  const getClassNamesFor = (name: string) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const openTrackingTab = (url: String, id: String) => {
    window.open(`${url}${id}`, '_blank');
  };

  const handleTracking = async (e: React.SyntheticEvent, orderId: String, trackingId: String) => {
    const carrierRes: AxiosResponse = await Doctor.get(GET_SHIPPING_CARRIER, { params: { orderId: `${orderId}` } });
    if (carrierRes?.data?.length > 0) {
      let type = carrierRes?.data[0]?.carrier_code;
      if (type !== undefined) {
        if (type === 'fedex') openTrackingTab(FEDEX_TRACK_URL, `${trackingId}`);
        if (type === 'stamps_com') openTrackingTab(STAMPS_COM_TRACK_URL, `${trackingId}`);
        if (type === 'ups') openTrackingTab(UPS_TRACK_URL, `${trackingId}`);
      }
    } else {
      toast('Unable to track order');
      return e.preventDefault();
    }
  };

  const handleOpenOrderPage = (Order_id: string, Rx_id: string) => {
    router(`/home/prescriptions/order/${Order_id}-${Rx_id}`);
  };

  useEffect(() => {
    let tempFilteredData = originalData?.filter((item: PrescriptionInterface) => {
      console.log((item.Rx_id + ' ' + item.Issue_Date + ' ' + item.Order_Number + ' ' + item.Prescriber_Name + ' ' + item.Medication + ' ' + item.Status).toLowerCase());
      return (search.length > 0 && (item.Rx_id + ' ' + item.Issue_Date + ' ' + item.Order_Number + ' ' + item.Prescriber_Name + ' ' + item.Medication + ' ' + item.Status).toLowerCase().includes(search.toLowerCase())) || search.length === 0;
    });
    console.log(tempFilteredData);
    setFilteredData([...tempFilteredData]);
  }, [search]);

  return (
    <Box className="recent-order-table-layout recents-order-table-patient">
      <Box className="search_box">
        <SearchBar value={search} setValue={setSearchValue} autoFocus={false} />
      </Box>
      <Box className="recent-order-table-layout">
        <TableContainer component={Paper} className="table_customized_Prescription">
          <Table sx={{ minWidth: 700, minHeight: 300 }} stickyHeader>
            <TableHead className="table_head">
              <TableRow>
                <StyledTableCell onClick={() => requestSort('Rx_Number')} className={getClassNamesFor('Rx_Number')}>
                  Rx Number{' '}
                  <span>
                    <img className="right_arrow" src={TableArrow} alt="logo" height={10} width={10} />
                  </span>
                </StyledTableCell>
                <StyledTableCell onClick={() => requestSort('Order_id')} className={getClassNamesFor('Medication')}>
                  Order ID{' '}
                  <span>
                    <img className="right_arrow" src={TableArrow} alt="logo" height={10} width={10} />
                  </span>
                </StyledTableCell>

                <StyledTableCell onClick={() => requestSort('Prescriber_Name')} className={getClassNamesFor('Patient_Name')}>
                  Prescriber{' '}
                  <span>
                    <img className="right_arrow" src={TableArrow} alt="logo" height={10} width={10} />
                  </span>
                </StyledTableCell>

                <StyledTableCell onClick={() => requestSort('Status')} className={getClassNamesFor('Status')}>
                  Status{' '}
                  <span>
                    <img className="right_arrow" src={TableArrow} alt="logo" height={10} width={10} />
                  </span>
                </StyledTableCell>
                <StyledTableCell onClick={() => requestSort('Tracking')} className={getClassNamesFor('Tracking')}>
                  Tracking #{' '}
                </StyledTableCell>
                <StyledTableCell onClick={() => requestSort('Medication')} className={getClassNamesFor('Prescriber_Name')}>
                  Medication{' '}
                  <span>
                    <img className="right_arrow" src={TableArrow} alt="logo" height={10} width={10} />
                  </span>
                </StyledTableCell>
                <StyledTableCell onClick={() => requestSort('Issue_Date')} className={getClassNamesFor('Order_Number')}>
                  Rx Date{' '}
                  <span>
                    <img className="right_arrow" src={TableArrow} alt="logo" height={10} width={10} />
                  </span>
                </StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody className="table_body">
              {items &&
                items.map((row: PrescriptionInterface, index: number) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="td">{row.Rx_id ? <Stack>Rx-{row.Rx_id}</Stack> : null}</StyledTableCell>
                    <StyledTableCell component="td" className="table_first" onClick={() => handleOpenOrderPage(row.Order_id, row.Rx_id)}>
                      {row?.Order_id ? <Stack>{row.Order_Number}</Stack> : null}
                    </StyledTableCell>

                    <StyledTableCell component="td">
                      <Stack>{row.Prescriber_Name}</Stack>
                    </StyledTableCell>

                    <StyledTableCell component="td">
                      <Stack>{row.Status}</Stack>
                    </StyledTableCell>
                    <StyledTableCell component="td" className="table_first">
                      <Stack
                        onClick={(e: React.SyntheticEvent) => {
                          handleTracking(e, row?.Order_id, row?.Tracking);
                        }}
                      >
                        {row?.Tracking ? row?.Tracking : ''}
                      </Stack>
                    </StyledTableCell>
                    <StyledTableCell component="td">
                      <Stack sx={{ textAlign: 'start' }}>{row.Medication}</Stack>
                    </StyledTableCell>
                    <StyledTableCell component="td">
                      <Stack>{moment(row.Issue_Date).format('MM-DD-YYYY')}</Stack>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}

              {(!items || items.length === 0) && (
                <StyledTableRow>
                  <StyledTableCell component="td" className="NoDataFound">
                    {/* <Stack>Oops!...Prescription History Not Found.</Stack> */}
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
