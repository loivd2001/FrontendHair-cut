import './Button.scss';

interface ButtonProps {
  classes?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const Button = (props: ButtonProps) => {
  return (
    <button
      className={['config-button no-ripple', props.classes].join(' ')}
      {...props}
    ></button>
  );
};

export default Button;
