import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEvent } from "react";

interface Props {
  onCancel: (e: MouseEvent<HTMLButtonElement>) => void;
  onConfirm: (() => void) | (() => Promise<void>);
  title: string;
  text: string;
}

const Alert: React.FC<Props> = ({ onCancel, onConfirm, title, text }) => {
  return (
    <div
      role="alert"
      className="alert $
      } shadow-lg z-50 flex justify-between bg-base-200 mb-1"
    >
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className="w-5 h-5 text-accent mr-3"
        />
        <div className="text-left">
          <h3 className="font-bold">{title}</h3>
          <div className="text-xs">{text}</div>
        </div>
      </div>

      <div className="flex">
        <button className="btn btn-sm" onClick={onCancel}>
          Close
        </button>
        <button
          className="btn btn-sm btn-primary"
          onClick={(e) => {
            onConfirm();
            onCancel(e);
          }}
        >
          See
        </button>
      </div>
    </div>
  );
};

export default Alert;
