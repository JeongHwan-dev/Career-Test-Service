import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Result() {
  const location = useLocation();

  useEffect(() => {
    //console.log(location.state.resultURL);
  }, []);

  return (
    <>
      <div id="root">
        <p>{location.state.resultURL}</p>
      </div>
    </>
  );
}

export default Result;
