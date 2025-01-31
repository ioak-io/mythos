import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addDays, format } from 'date-fns';
import { faCheck, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.scss';
import ReceiptModel from '../../../model/ReceiptModel';
import ExpenseModel from '../../../model/ExpenseModel';
import Topbar from '../../../components/Topbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchAndSetCompanyItems } from '../../../store/actions/CompanyActions';

const EMPTY_EXPENSE: ExpenseModel = {
  amount: undefined,
  billDate: '',
  category: '',
  description: '',
  tagId: [],
};

const EMPTY_BILL: ReceiptModel = {
  billDate: format(new Date(), 'yyyy-MM-dd'),
  items: [{ ...EMPTY_EXPENSE }],
  number: '',
  total: 0,
  description: '',
};

interface Props {
  space: string;
  location: any;
}

const LandingPage = (props: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const authorization = useSelector((state: any) => state.authorization);
  const companyList = useSelector((state: any) => state.company.items);

  // useEffect(() => {
  //   if (location.state?.refresh || !companyList.length) {
  //     dispatch(fetchAndSetCompanyItems(authorization));
  //   }
  // }, [location.state, dispatch, authorization]);

  const goToCreateCompanyPage = () => {
    navigate('/company/edit');
  };

  const goToCompanyPage = (companyReference: number) => {
    navigate(`/${companyReference}/application`);
  };

  return (
    <div className="landing-page">
      <Topbar title="Choose company" />
      <div className="landing-page__main__container">
        <div className="landing-page__main main-section">
          {companyList.map((company: any) => (
            <button
              key={company._id}
              className="landing-page__main__company"
              onClick={() => goToCompanyPage(company.reference)}
            >
              <div className="landing-page__main__company__title">
                {company.name}
              </div>
              <div className="landing-page__main__company__subtitle">
                {company.description}
              </div>
            </button>
          ))}
          <button
            className="landing-page__main__new-company"
            onClick={goToCreateCompanyPage}
          >
            <FontAwesomeIcon icon={faPlus} />
            <div>New company</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
