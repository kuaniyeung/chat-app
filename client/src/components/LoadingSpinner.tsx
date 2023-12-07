interface Props {
  size: string;
  colour: string;
}
const LoadingSpinner: React.FC<Props> = ({ size, colour }) => {
  return (
    <span
      className={`loading loading-spinner loading-${size} text-${colour}`}
    ></span>
  );
};

export default LoadingSpinner;
