import { MouseEvent } from "react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onCancel: (e: MouseEvent<HTMLButtonElement>) => void;
  onConfirm: (() => void) | (() => Promise<void>);
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
        <p className="mb-4 text-neutral">{text}</p>
        <div className="modal-action">
          <button
            className="btn btn-neutral mr-2 text-neutral-content"
            onClick={(e) => {
              onConfirm();
              onCancel(e);
            }}
          >
            Confirm
          </button>
          <button
            className="btn btn-base-300 text-neutral-content"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
