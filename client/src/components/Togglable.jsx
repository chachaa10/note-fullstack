import { useState } from 'react';

const Togglable = (props) => {
  const [isVisible, setIsVisible] = useState(false);

  const hideWhenVisible = { display: isVisible ? 'none' : '' };
  const showWhenVisible = { display: isVisible ? '' : 'none' };

  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={() => setIsVisible(!isVisible)}>
          {props.buttonLabel}
        </button>
      </div>

      <div style={showWhenVisible}>
        {props.children}
        <button onClick={() => setIsVisible(!isVisible)}>cancel</button>
      </div>
    </>
  );
};

export default Togglable;
