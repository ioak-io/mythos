import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Input, Button, Select, Textarea } from 'basicui';
import Topbar from '../../../components/Topbar';
import './style.scss';
import { newId } from '../../../events/MessageService';
import CompanyModel from '../../../model/CompanyModel';
import { updateCompany, createCompany } from './service';
import { fetchAndSetCompanyItems } from 'src/store/actions/CompanyActions';

interface Props {
  history: any;
  location: any;
}

const EMPTY_COMPANY: CompanyModel = {
  _id: undefined,
  name: '',
  description: '',
  reference: null,
  numberFormat: 'en-US',
  currency: 'USD',
};

const EditCompanyPage = (props: Props) => {
  const navigate = useNavigate();
  const authorization = useSelector((state: any) => state.authorization);
  const companyList = useSelector((state: any) => state.company.items);
  const [searchParams] = useSearchParams();
  const [formId, setFormId] = useState(newId());
  const [state, setState] = useState<CompanyModel>({ ...EMPTY_COMPANY });
  const dispatch = useDispatch();
  const handleChange = (event: any) => {
    setState({ ...state, [event.currentTarget.name]: event.currentTarget.value });
  };

  const save = async() => {
    if (searchParams.get('id')) {
      await updateCompany(state, authorization).then((response: any) => {
      }).catch((error: any) => {
        console.error("Failed to update company:", error);
      });
    } else {
      await createCompany(state, authorization).then((response: any) => {
        console.log("State", state);
        console.log("Authorization", authorization);
      }).catch((error: any) => {
        console.error("Failed to create company:", error);
      });
    }
    // await dispatch(fetchAndSetCompanyItems(authorization));
    goBack();
  };
  

  const goBack = () => {
    navigate(`/`,{replace:true, state: { refresh: true }});
  };

  return (
    <div className="edit-company-page">
      <Topbar title={searchParams.get('id') ? 'Edit company' : 'New company'}>
        right
      </Topbar>
      <div className="edit-company-page__main main-section content-section page-width">
        <form id={formId} onSubmit={save}>
          <div className="form">
            <div className="form-two-column">
              <Input
                name="name"
                value={state.name}
                onInput={handleChange}
                label="Company name"
              />
              <Input
                name="reference"
                value={state.reference || ''}
                onInput={handleChange}
                label="Company ID"
                disabled
                tooltip={
                  !state.reference ? 'Auto generated after creation' : ''
                }
              />
            </div>
            <Textarea
              name="description"
              value={state.description}
              onInput={handleChange}
              label="Description"
            />
          </div>
        </form>
      </div>
      <div className="footer">
        <div />
        <div className="footer-right">
          <Button
            type="submit"
            onClick={save}
          >
            <FontAwesomeIcon icon={faCheck} />
            {searchParams.get('id') ? 'Save' : 'Save and go back'}
          </Button>
          <Button onClick={goBack}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCompanyPage;
