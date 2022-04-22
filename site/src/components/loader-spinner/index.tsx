import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import styled from '@emotion/styled';

const LoaderSpinner = () => {
  return (
    <LoaderSpinnerWrapper className='loader-spinner'>
      <CircularProgress />
    </LoaderSpinnerWrapper>
  );
};

const LoaderSpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

LoaderSpinnerWrapper.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
};

export default LoaderSpinner;
