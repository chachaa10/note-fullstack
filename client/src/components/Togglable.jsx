import { useState } from 'react';

const Togglable = ({ buttonLabel, children }) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={() => setVisible(!visible)}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button onClick={() => setVisible(!visible)}>cancel</button>
      </div>
    </>
  );
};

export default Togglable;
