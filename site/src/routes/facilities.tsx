import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Title from '../components/title';

import FacilitiesList from '../features/facilities/facilities-list';

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { api } from '../api/axios';
import axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';
import { selectAllFacilities } from '../features/facilities/facilitiesSlice';

import { increment } from '../features/facilities/facilitiesSlice';
import { Button } from '@mui/material';

export default function Facilities() {
  const facilities = useSelector(selectAllFacilities);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const facilitiesApi = api({
  //     url: '',
  //     method: 'post',
  //     data: {
  //       query: `
  //           {
  //             facilities(after: "", limit: 100) {
  //               items{
  //                 name
  //                 email
  //                 phoneNumber
  //                 address{
  //                   streetWithNumber
  //                   zipCode
  //                   city
  //                 }
  //                 location{
  //                   lat
  //                   lon
  //                 }
  //                 createdAt
  //               }
  //             }
  //           }
  //         `,
  //     },
  //   })
  //     .then((result) => {
  //       console.log('result api query', result.data.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });

  //   return () => {};
  // }, []);
  return <FacilitiesList />;
}
