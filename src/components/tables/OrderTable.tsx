import { Box, Paper, Stack } from '@mui/material';
import React, { Dispatch, useEffect } from 'react';
import { StyledTableCell, StyledTableRow } from '../../core/tables/tableStyles';
import { AxiosResponse } from 'axios';
import Doctor from '../../constants/grx-api';

import { OrderInterface } from '../../interfaces/order';
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
import { toast } from 'react-toastify';

const useSortableData = (items: OrderInterface[] = [], config = null) => {
  const [sortConfig, setSortConfig]: [SortConfigInterface | null, Dispatch<SortConfigInterface | null>] = React.useState<SortConfigInterface | null>(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key as keyof OrderInterface] < b[sortConfig.key as keyof OrderInterface]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof OrderInterface] > b[sortConfig.key as keyof OrderInterface]) {
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

  return { items: sortedItems, requestSort, setSortConfig, sortConfig };
};

export const OrderTable = (props: { data?: OrderInterface[] }) => {
  const router = useNavigate();
  const handleOrderNumber = (Order_Number: string) => {
    router('/home/prescriptions/order/' + Order_Number);
  };

  const formatDate = (date: string) => {
    return moment(date).format('MM/DD/YYYY');
  };

  const { items, requestSort, sortConfig, setSortConfig } = useSortableData(props.data ?? []);

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

  useEffect(() => {
    setSortConfig({ key: 'Order_Number', direction: 'descending' });
  }, []);

  return (
    <TableContainer sx={{ maxHeight: 200 }} component={Paper} className="table_customized_Prescription">
      <Table sx={{ minWidth: 700 }} stickyHeader>
        <TableHead className="table_head">
          <TableRow>
            <StyledTableCell onClick={() => requestSort('Rx_Number')} className={getClassNamesFor('Rx_Number')}>
              Rx Number{' '}
              <span>
                <img className="right_arrow" src={TableArrow} alt="logo" height={10} width={10} />
              </span>
            </StyledTableCell>
            <StyledTableCell onClick={() => requestSort('Order_Number')} className={getClassNamesFor('Order_Number')}>
              Order ID{' '}
              <span>
                <img className="right_arrow" src={TableArrow} alt="logo" height={10} width={10} />
              </span>
            </StyledTableCell>
            <StyledTableCell onClick={() => requestSort('Patient_Name')} className={getClassNamesFor('Patient_Name')} style={{ textAlign: 'left' }}>
              Patient{' '}
              <span style={{ paddingLeft: '3px' }}>
                <img className="right_arrow" src={TableArrow} alt="logo" height={10} width={10} />
              </span>
            </StyledTableCell>
            <StyledTableCell onClick={() => requestSort('Prescriber_Name')} className={getClassNamesFor('Prescriber_Name')}>
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
              Tracking
            </StyledTableCell>
            <StyledTableCell onClick={() => requestSort('Medication')} className={getClassNamesFor('Medication')}>
              Medication{' '}
              <span>
                <img className="right_arrow" src={TableArrow} alt="logo" height={10} width={10} />
              </span>
            </StyledTableCell>
            <StyledTableCell onClick={() => requestSort('Issue_Date')} className={getClassNamesFor('Issue_Date')}>
              Rx Date{' '}
              <span>
                <img className="right_arrow" src={TableArrow} alt="logo" height={10} width={10} />
              </span>
            </StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody className="table_body">
          {items &&
            items.map((row: OrderInterface, index: number) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="td">
                  <Stack>{row.Rx_Number ? <Box>Rx-{row.Rx_Number}</Box> : null}</Stack>
                </StyledTableCell>
                <StyledTableCell component="td" className="table_first" onClick={() => handleOrderNumber(row.Order_id)}>
                  <Stack>{row.Invoice_Nbr ? <Box className="table_first">{row.Invoice_Nbr}</Box> : null}</Stack>
                </StyledTableCell>
                <StyledTableCell component="td">
                  <Stack direction="row" alignItems="center" justifyContent="flex-start" style={{ paddingLeft: 15 }}>
                    {/* <span className="table_profile_image">PM</span>  */}
                    {row.Patient_Name}
                  </Stack>
                </StyledTableCell>
                <StyledTableCell component="td">
                  <Stack>{row.Prescriber_Name}</Stack>
                </StyledTableCell>
                <StyledTableCell component="td">
                  <Stack>{row.Status}</Stack>
                </StyledTableCell>
                <StyledTableCell component="td" className="table_first">
                  <Stack onClick={(e: React.SyntheticEvent) => handleTracking(e, row?.Order_Number, row?.Tracking)}>{row.Tracking ? row.Tracking : ''}</Stack>
                </StyledTableCell>
                <StyledTableCell component="td">
                  <Stack>{row.Medication}</Stack>
                </StyledTableCell>
                <StyledTableCell component="td">
                  <Stack>{formatDate(row.Issue_Date)}</Stack>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          {(!items || items.length === 0) && (
            <StyledTableRow>
              <StyledTableCell component="td" className="NoDataFound">
                {/* <Stack>Oops!...Order Not Found.</Stack> */}
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
