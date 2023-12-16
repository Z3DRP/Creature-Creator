import React from 'react';
import './Loader.css';
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';

const override = css`
  display: block;
  margin: 0;
  border-color: red;
`;

const Loader = ({isLoading}) => {
    return (
        <>
            <div className="loader" > 
              <ClipLoader color="#000" loading={isLoading} css={override} size={50} />
            </div>
        </>
    )
}

export default Loader;