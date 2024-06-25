import { Paper, Stack } from "@mui/material";
import React, { Dispatch } from "react";
import { StyledTableCell, StyledTableRow } from "../../core/tables/tableStyles";

import { PrescriptionInterface } from "../../interfaces/prescription";
import { SortConfigInterface } from "../../interfaces/sortConfig";
import Table from "@mui/material/Table";
import TableArrow from "../../assets/icons/table_arrow.svg";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from 'moment';
import { useNavigate } from "react-router-dom";

const useSortableData = (items: PrescriptionInterface[] = [], config = null) => {
  const [sortConfig, setSortConfig]: [SortConfigInterface | null, Dispatch<SortConfigInterface | null>] = React.useState<SortConfigInterface | null>(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = items;
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key as keyof PrescriptionInterface] < b[sortConfig.key as keyof PrescriptionInterface]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key as keyof PrescriptionInterface] > b[sortConfig.key as keyof PrescriptionInterface]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

export const PrescriptionSearchTable = (props: { data?: PrescriptionInterface[],
  onChange?: () => void;
}) => {
  const router = useNavigate();

  const formatDate = (date: string) => {
    if(!date)  {
      return '';
    }
    return moment(date).format('MM/DD/YYYY')
  }

  const handleContactProfile = () => {
    router("/home/patient/detail");
  };


  const { items } = useSortableData((props.data) ?? []);

  return (
    <TableContainer component={Paper} className="table_customized_PrescriptionSearchbar">
      <Table sx={{ minWidth: 300 }} stickyHeader>
        <TableBody className="table_bodyData">
          {items && items.map((row: PrescriptionInterface, index: number) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="td" className="table_first" onClick={handleContactProfile}>
                <Stack direction="row" alignItems="center" justifyContent="flex-start" style={{ paddingLeft: 15 }}>
                   {row.firstName} {row.lastName}
                </Stack>

              </StyledTableCell>
              <StyledTableCell component="td" onClick={handleContactProfile}>
                <Stack>
                  <Stack>{formatDate(row.dateOfBirth)}</Stack>
                </Stack>
              </StyledTableCell>
              
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
