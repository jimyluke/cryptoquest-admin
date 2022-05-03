interface ISpinner {
  flex?: boolean;
  position?: string;
  size?: string;
}

const Spinner = ({ flex, position, size }: ISpinner) => {
  return (
    <div
      className={`spinner-overlay ${flex ? 'spinner-overlay--flex' : ''} ${
        position === 'top-left' ? 'spinner-overlay--top-left' : ''
      }`}
    >
      <div
        className={`spinner-container ${
          size === 'small'
            ? 'spinner-container--small'
            : size === 'xs'
            ? 'spinner-container--xs'
            : ''
        }`}
      />
    </div>
  );
};

export default Spinner;
