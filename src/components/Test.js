import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Test.css';

// 테스트 컴포넌트 (등록, 테스트)
function Test() {
  const [userName, setUserName] = useState(''); // 검사자 이름
  const [userGender, setUserGender] = useState(false); // 검사자 성별
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [data, setData] = useState([{}]); // 질문 데이터 (JSON 배열)
  const [answers, setAnswers] = useState(''); // 검사자 선택 기록 데이터
  const [questionPage, setQuestionPage] = useState(0); // 퀴즈 페이지 번호

  // 사용자 데이터 저장 함수

  // 검사자 이름을 받아오는 함수
  function inputName() {
    const newUserName = document.querySelector(`input[name="name"]`).value;
    setUserName(newUserName);
    console.log(`검사자 이름: ${userName}`);
  }

  // 검사자 성별을 받아오는 함수
  function inputGender() {
    const newUserGender = document.querySelector(`input[name="gender"]`).value;
    setUserGender(newUserGender);
    console.log(`성별 코드: ${userGender}`);
  }

  // 검사자 정보 입력을 체크하는 함수
  function formCheck() {
    if (currentPage === 1) {
      // 이름과 성별 입력이 모두 완료되어 있지 않다면
      if (userName.length === 0 || userGender === false) {
        return true; // 검색 시작 버튼 비활성화
      }
      // 이름과 성별 입력이 모두 완료되어 있다면
      else {
        return false; // 검색 시작 버튼 활성화
      }
    } else if (currentPage === 2) {
      if (document.querySelector(`input[name="ex-answer"]`).value === false) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  // 현재 페이지로 다음 페이지로 넘기는 함수
  function nextPage() {
    if (currentPage < 3 || questionPage === 6) {
      setCurrentPage(currentPage + 1);
      console.log(`현재 페이지 번호: ${currentPage}`);
    } else {
      setQuestionPage(questionPage + 1);
      console.log(`현재 퀴즈 페이지 번호: ${questionPage}`);
    }

    console.log(`현재 페이지 번호: ${currentPage}`);
  }

  // 현재 페이지를 이전 페이지로 되돌리는 함수
  function previousPage() {
    if (currentPage < 3 || questionPage === 0) {
      setCurrentPage(currentPage - 1);
      console.log(`현재 페이지 번호: ${currentPage}`);
    } else {
      setQuestionPage(questionPage - 1);
      console.log(`현재 퀴즈 페이지 번호: ${questionPage}`);
    }
  }

  // 결과 페이지로 이동하는 함수
  function moveResult() {
    window.location.href = '#/result';
  }

  // OpenAPI 데이터를 가져오는 함수
  function getOpenAPI() {
    const url =
      'http://www.career.go.kr/inspct/openapi/test/questions?apikey=f96b530595b6dccabaed517667511170&q=6';
    axios
      .get(url)
      .then((response) => {
        const data = response.data.RESULT;
        setData(data);
      })
      .catch((e) => {
        alert(e);
      });
  }

  useEffect(() => {
    getOpenAPI();
  }, []);

  // 질문 데이터 묶음 저장 그룹
  var group = [];

  // OpenAPI 질문 데이터 4개씩 묶기
  for (var i = 0; i < data.length / 4; i++) {
    group[i] = data.slice(i * 4, i * 4 + 4);
  }

  // 컴포넌트

  // 검사 시작 버튼 컴포넌트
  function StartButton() {
    return (
      <button
        type="button"
        className="btn-outline-primary"
        disabled={formCheck()}
        onClick={nextPage}
      >
        검사 시작
      </button>
    );
  }

  // 다음 버튼 컴포넌트
  function NextButton() {
    return (
      <button type="button" className="btn-outline-primary" onClick={nextPage}>
        다음
      </button>
    );
  }

  // 이전 버튼 컴포넌트
  function PreviousButton() {
    return (
      <button type="button" className="btn-outline-primary" onClick={previousPage}>
        이전
      </button>
    );
  }

  // 제출 버튼 컴포넌트
  function SubmitButton() {
    return (
      <button type="button" className="btn-outline-primary" onClick={moveResult}>
        제출
      </button>
    );
  }

  return (
    <div id="root">
      <div id="page1-registration" style={{ display: currentPage === 1 ? 'block' : 'none' }}>
        <h2>직업가치관검사</h2>
        <div className="form-group">
          <label>
            이름
            <input name="name" type="text" className="form-control" onChange={inputName} />
          </label>
        </div>
        <div className="form-group">
          <label>성별</label>
          <div>
            <div>
              <label className="form-check-label">
                <input
                  name="gender"
                  type="radio"
                  className="form-check-input"
                  value="100323"
                  onChange={inputGender}
                />
                남성
              </label>
            </div>
            <div>
              <label className="form-check-label">
                <input
                  name="gender"
                  type="radio"
                  className="form-check-input"
                  value="100324"
                  onChange={inputGender}
                />
                여성
              </label>
            </div>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="btn-outline-primary"
            disabled={formCheck()}
            onClick={nextPage}
          >
            검사 시작
          </button>
        </div>
      </div>
      <div id="page2-example" style={{ display: currentPage === 2 ? 'block' : 'none' }}>
        <div className="header-container">
          <div className="title">
            <div>
              <h2>검사 예시</h2>
            </div>
            <div>
              <h3>0%</h3>
            </div>
          </div>
          <div className="progress">
            <p>-------</p>
          </div>
        </div>
        <h4>직업과 관련된 두개의 가치 중에서 자기에게 더 중요한 가치에 표시하세요.</h4>
        <div className="question-form">
          <div>두 개의 가치 중에 자신에게 더 중요한 가치를 선택하세요.</div>
          <div className="answers-form">
            <div className="check-form">
              <label>
                <input type="radio" name="ex-answer" className="form-check-input" value="-1" />
                창의성
              </label>
            </div>
            <div className="check-form">
              <label>
                <input type="radio" name="ex-answer" className="form-check-input" value="-2" />
                안정성
              </label>
            </div>
          </div>
        </div>
        <div className="footer-container">
          <PreviousButton />
          <StartButton />
        </div>
      </div>
      <div id="page3-test" style={{ display: currentPage === 3 ? 'block' : 'none' }}>
        <div className="header-container">
          <div className="title">
            <div>
              <h2>검사 진행</h2>
            </div>
            <div>
              <h3>0%</h3>
            </div>
          </div>
          <div className="progress">
            <p>-------</p>
          </div>
        </div>
        <div className="body-container">
          {group[questionPage].map((jsondata, idx) => {
            // 이런식으로 map함수를 사용해 html코드 안에서 반복문을 돌릴 수 있습니다.
            return (
              <>
                <div className="question-form">
                  <div>두 개 가치 중에 자신에게 더 중요한 가치를 선택하세요.</div>
                  <div className="answers-form">
                    <div className="check-form">
                      <label>
                        <input
                          type="radio"
                          name={jsondata.qitemNo}
                          className="form-check-input"
                          value={jsondata.answerScore01}
                        />
                        {jsondata.answer01}
                      </label>
                    </div>
                    <div className="check-form">
                      <label>
                        <input
                          type="radio"
                          name={jsondata.qitemNo}
                          className="form-check-input"
                          value={jsondata.answerScore02}
                        />
                        {jsondata.answer02}
                      </label>
                    </div>
                  </div>
                </div>
                <br></br>
              </>
            );
          })}
        </div>
        <div className="footer-container">
          <PreviousButton />
          <NextButton />
        </div>
      </div>
      <div id="page4-submit" style={{ display: currentPage === 4 ? 'block' : 'none' }}>
        <div className="header-container">
          <div className="title">
            <h2>수고하셨습니다. 검사가 완료되었습니다.</h2>
          </div>
        </div>
        <div className="body-container">
          <p>
            검사결과는 여러분이 직업을 선택할 때 상대적으로 어떠한 가치를 중요하게 생각하는지를
            알려주고, 중요 가치를 충족시켜줄 수 있는 직업에 대해 생각해 볼 기회를 제공합니다.
          </p>
        </div>
        <div className="footer-container">
          <SubmitButton />
        </div>
      </div>
    </div>
  );
}

export default Test;
