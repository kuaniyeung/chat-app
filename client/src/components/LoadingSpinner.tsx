import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

type Props = {
    colour: string
}
const LoadingSpinner: React.FC<Props> = ({colour}) => {
  return (
    <div className={`w-16 h-16 text-${colour} animate-spin p-2`}>
      <FontAwesomeIcon icon={faSpinner} size="2x" />
    </div>
  );
};

export default LoadingSpinner;
