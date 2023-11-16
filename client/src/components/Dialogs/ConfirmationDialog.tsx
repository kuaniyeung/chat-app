import { MouseEvent } from "react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onCancel: (e: MouseEvent<HTMLButtonElement>) => void;
  onConfirm: Function;
  text: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  text,
}) => {
  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <p className="mb-4 text-info">{text}</p>
        <div className="modal-action">
          <button
            className="btn btn-info mr-2"
            onClick={(e) => {
              onConfirm();
              onCancel(e);
            }}
          >
            Confirm
          </button>
          <button className="btn btn-base-300" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
