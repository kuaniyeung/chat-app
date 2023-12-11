import { MouseEvent } from "react";

interface WarningDialogProps {
  isOpen: boolean;
  onConfirm: (e: MouseEvent<HTMLButtonElement>) => void;
  text: string | undefined;
}

const WarningDialog: React.FC<WarningDialogProps> = ({
  isOpen,
  onConfirm,
  text,
}) => {
  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <p className="mb-4 text-info">{text}</p>
        <div className="modal-action">
          <button className="btn btn-base-300" onClick={onConfirm}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningDialog;
