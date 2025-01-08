import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Topbar from "../../../components/Topbar";
import { Button, Input } from "basicui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import MainSection from "../../../components/MainSection";

interface Props {
  location: any;
  space: string;
}

const ApplicationsPage = (props: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  const authorization = useSelector((state: any) => state.authorization);

  return (
    <>
      <div className="page-animate">
        <Topbar title="Applications">
          <div className="topbar-actions">
            <Button>
              <FontAwesomeIcon icon={faPlus} />
              New app
            </Button>
          </div>
        </Topbar>
        <MainSection>Applications list component</MainSection>
      </div>
      {/* <NewApplication /> */}
    </>
  );
};

export default ApplicationsPage;
