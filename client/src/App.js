import React, { Fragment } from 'react';
function App() {
  const redirectPage = () => {
    window.location.href = "https://fileadventure.ml";
  }
  return (
    <Fragment>
      {redirectPage()}
    </Fragment>
  );
}


export default App;
