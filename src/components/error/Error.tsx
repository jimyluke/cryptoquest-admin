import { SerializedError } from '@reduxjs/toolkit';

interface IErrorProps {
  error: SerializedError;
}

const Error = ({ error }: IErrorProps) => {
  return (
    <div className="error__container">
      <div className="error__content">
        <div className="error__heading">Error</div>
        <div className="error__description">{error.message}</div>
      </div>
    </div>
  );
};

export default Error;
