import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './css/Test.css';

function Result() {
  return (
    <>
      <div className="header-container">
        <div className="title">
          <h2>검사가 완료되었습니다.</h2>
        </div>
      </div>
      <div className="body-container">
        <p>
          검사결과는 여러분이 직업을 선택할 때 상대적으로 어떠한 가치를 중요하게 생각하는지를
          알려주고, 중요 가치를 충족시켜줄 수 있는 직업에 대해 생각해 볼 기회를 제공합니다.
        </p>
      </div>
      <div className="footer-container"></div>
    </>
  );
}

export default Result;
