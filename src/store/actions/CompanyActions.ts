/* eslint-disable import/prefer-default-export */
import { COMPANY_LIST_FETCH_AND_SET } from './types';
import { httpGet, httpPost, httpPut } from '../../components/Lib/RestTemplate';
import { Dispatch } from '@reduxjs/toolkit';

export const fetchAndSetCompanyItems = (authorization: any) => async (dispatch: Dispatch) => {
  if (!authorization?.access_token) {
    console.error('Authorization token is missing');
    return;
  }

  try {
    const response = await httpGet('/company', {
      headers: {
        Authorization: authorization.access_token,
      },
    });

    if (response?.status === 200) {
      dispatch({
        type: COMPANY_LIST_FETCH_AND_SET,
        payload: response.data,
      });
    }
  } catch (error) {
    console.error('Error fetching company data:', error);
  }
};