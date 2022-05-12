import Modal from 'react-modal';
import { Close } from '@mui/icons-material';

const customStyles = {
  content: {
    display: 'flex',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    minWidth: '300px',
    maxWidth: '800px',
  },
};

Modal.setAppElement('#root');

interface IModalComponentProps {
  children: JSX.Element;
  isOpen: boolean;
  onClose: () => void;
  isClosable?: boolean;
  additionalClose?: () => void;
}

const ModalComponent = ({
  children,
  isOpen,
  onClose = () => null,
  isClosable = true,
  additionalClose = () => null,
}: IModalComponentProps) => {
  let onCloseCustom;

  if (!isClosable) {
    onCloseCustom = () => null;
  } else {
    onCloseCustom = () => {
      additionalClose();
      onClose();
    };
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        style={customStyles}
        contentLabel="Modal"
        onRequestClose={onCloseCustom}
      >
        <button
          className={`modal__close-btn btn btn--xs zindex-2 ${
            !isClosable ? 'modal__close-btn--hidden' : ''
          }`}
          onClick={onCloseCustom}
        >
          <Close />
        </button>
        {children}
      </Modal>
    </>
  );
};

export default ModalComponent;
