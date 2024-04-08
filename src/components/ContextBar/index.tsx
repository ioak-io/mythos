import "./style.css";

interface Props {
  title?: string;
  children?: any;
}

const ContextBar = (props: Props) => {
  return (
    <div className="context-bar">
      <div>{props.title}</div>
      <div className="context-bar__right">{props.children}</div>
    </div>
  );
};

export default ContextBar;
