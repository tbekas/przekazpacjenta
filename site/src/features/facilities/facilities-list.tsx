import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Title from '../../components/title';
import LoaderSpinner from '../../components/loader-spinner';
import { useEffect } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';

import { DataGrid, GridColDef, GridValueGetterParams, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';

import { useSelector, useDispatch } from 'react-redux';
import { selectAllFacilities, selectStatusFacilities } from './facilitiesSlice';

import { getFacilities } from './facilitiesSlice';
import { Button } from '@mui/material';

import { FacilitiesPage, Address } from '../../types';
import { TStore } from '../../store';
import { spawn } from 'child_process';

interface FacilitiesState {
  data: FacilitiesPage;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
type FacilitiesArrayProps = {
  facilitiesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  facilities: FacilitiesState;
};

export default function FacilitiesList() {
  const facilities = useSelector(selectAllFacilities);
  const facilitiesStatus = useSelector(selectStatusFacilities);
  const dispatch = useDispatch();
  console.log('facilities from list: ', facilities);

  useEffect(() => {
    if (facilitiesStatus === 'idle') {
      dispatch(getFacilities());
    }
  }, [facilitiesStatus, dispatch]);

  return (
    <Grid item xs={12}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Title>Placówki</Title>
        <Button variant='contained' onClick={() => dispatch(getFacilities())}>
          Dispatch GatAll
        </Button>
        <FacilitiesArray facilitiesStatus={facilitiesStatus} facilities={facilities} />
      </Paper>
    </Grid>
  );
}

const FacilitiesArray = (props: FacilitiesArrayProps) => {
  console.log('Form array: ', props.facilities.data.items);
  const columns: GridColDef[] = [
    { field: 'lp', headerName: 'LP', width: 90, sortable: true },
    {
      field: 'name',
      headerName: 'Nazwa szpitala',
      width: 350,
      editable: false,
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'E-mail',
      width: 350,
      editable: false,
    },
    {
      field: 'addres',
      headerName: 'Adres',
      width: 350,
      editable: false,
    },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem icon={<DeleteIcon />} onClick={() => {}} label='Delete' />,
        <GridActionsCellItem icon={<SecurityIcon />} onClick={() => {}} label='Print' showInMenu />,
      ],
    },
  ];
  console.log('Address');
  function renderAddress(addres: Address) {
    console.log(addres.city);
    console.log(addres.streetWithNumber);
    return addres.zipCode;
  }
  const rows = props.facilities.data.items.map((facility, index) => {
    return {
      id: facility.id,
      lp: '' + `${index + 1}`,
      name: facility.name,
      email: facility.email,
      addres: renderAddress(facility.address),
    };
  });
  return (
    <div style={{ height: 700, width: '100%' }}>
      {props.facilitiesStatus === 'idle' || props.facilitiesStatus === 'loading' ? (
        <LoaderSpinner />
      ) : (
        <DataGrid
          getRowId={(row) => row.id}
          rows={rows}
          columns={columns}
          pageSize={25}
          rowsPerPageOptions={[25]}
          checkboxSelection
          disableSelectionOnClick
        />
      )}
    </div>
  );
};
