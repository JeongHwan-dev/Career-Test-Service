import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Test.css';

// 테스트 컴포넌트 (등록, 테스트)
function Test() {
  const [userName, setUserName] = useState(''); // 검사자 이름
  const [userGender, setUserGender] = useState(false); // 검사자 성별
  const [exAnswer, setExAnswer] = useState(false); // 예시 문항 선택 기록
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [data, setData] = useState([{}]); // 질문 데이터 (JSON 배열)
  const [answers, setAnswers] = useState(''); // 검사자 선택 기록 데이터
  const [questionPage, setQuestionPage] = useState(0); // 퀴즈 페이지

  // 검사자 데이터 함수
  function userData() {
    const userResultData = {
      apikey: '',
      qestrnSeq: '6',
      trgetSe: '100206',
      name: userName,
      gender: userGender,
      grade: '2',
      email: '',
      startDtm: Date.now(),
      answers: '',
    };
  }

  // 검사자 이름을 받아오는 핸들러
  const onNameHandler = (event) => {
    setUserName(event.currentTarget.value);
    console.log(`검사자 이름: ${userName}`);
  };

  // 검사자 성별을 받아오는 핸들러
  const onGenderHandler = (event) => {
    setUserGender(event.currentTarget.value);
    console.log(`성별 코드: ${userGender}`);
  };

  const onExampleHandler = (event) => {
    setExAnswer(event.currentTarget.value);
    console.log(`예시 문제 선택지: ${exAnswer}`);
  };

  // const questionHandler = (event) => {
  //   setAnswers(`${answers} ${event.currentTarget.value}`);
  //   console.log(`검사자 선택 기록: ${answers}`);
  // };

  // 현재 페이지로 다음 페이지로 넘기는 함수
  function nextPage() {
    if (currentPage < 3) {
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
    console.log(questionGroup);
  }, []);

  // 질문 데이터 묶음 저장 그룹
  var questionGroup = [];

  // OpenAPI 질문 데이터 4개씩 묶기
  for (var i = 0; i < data.length / 4; i++) {
    questionGroup[i] = data.slice(i * 4, i * 4 + 4);
  }

  // 한 개의 테스트 질문 페이지에 문제 할당하는 함수
  function allocateQuestion(questionGroup) {
    const page = questionGroup.map((jsonData, index) => {
      return (
        <>
          <div className="question-form">
            <Question num={jsonData.qitemNo} />
            <div className="answers-form">
              <div className="check-form">
                <label>
                  <input
                    type="radio"
                    name={`B${jsonData.qitemNo}`}
                    className="form-check-input"
                    value={jsonData.answerScore01}
                  />
                  {jsonData.answer01}
                </label>
              </div>
              <div className="check-form">
                <label>
                  <input
                    type="radio"
                    name={`B${jsonData.qitemNo}`}
                    className="form-check-input"
                    value={jsonData.answerScore02}
                  />
                  {jsonData.answer02}
                </label>
              </div>
            </div>
          </div>
          <br></br>
        </>
      );
    });
    return page;
  }

  // 테스트 질문 컴포넌트
  function QuestionContainer() {
    // OpenAPI 질문 데이터 4개씩 묶기
    for (var i = 0; i < data.length / 4; i++) {
      questionGroup[i] = data.slice(i * 4, i * 4 + 4);
    }
    if (questionGroup.length <= 0) {
      return <></>;
    }
    return (
      <>
        {questionGroup.map((item, index) => {
          return (
            <>
              <div
                className="question-page"
                id={`questionGroup${index}`}
                style={{ display: questionPage === index ? 'block' : 'none' }}
              >
                {allocateQuestion(questionGroup[index])}
              </div>
            </>
          );
        })}
      </>
    );
  }

  // 컴포넌트

  // 검사 시작 버튼 컴포넌트
  function StartButton() {
    return (
      <button type="button" className="btn-outline-primary" disabled={!exAnswer} onClick={nextPage}>
        검사 시작
      </button>
    );
  }

  // 다음 버튼 컴포넌트
  function NextButton() {
    if (questionPage === questionGroup.length - 1) {
      return (
        <button type="button" className="btn-outline-primary" onClick={moveResult}>
          제출
        </button>
      );
    }
    return (
      <button type="button" className="btn-outline-primary" onClick={nextPage}>
        다음&gt;
      </button>
    );
  }

  // 이전 버튼 컴포넌트
  function PreviousButton() {
    return (
      <button type="button" className="btn-outline-primary" onClick={previousPage}>
        &lt;이전
      </button>
    );
  }

  // 질문 컴포넌트
  function Question(props) {
    return <div>{props.num}. 두 개의 가치 중에 자신에게 더 중요한 가치를 선택하세요.</div>;
  }

  return (
    <div id="root">
      <div id="page1-registration" style={{ display: currentPage === 1 ? 'block' : 'none' }}>
        <h2>직업가치관검사</h2>
        <div className="form-group">
          <label>
            이름
            <input
              name="name"
              type="text"
              className="form-control"
              value={userName}
              onChange={onNameHandler}
            />
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
                  id="male-radio"
                  value="100323"
                  onChange={onGenderHandler}
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
                  id="female-radio"
                  value="100324"
                  onChange={onGenderHandler}
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
            id="user-start-btn"
            disabled={!(userGender && userName)}
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
          <Question num="ex" />
          <div className="answers-form">
            <div className="check-form">
              <label>
                <input
                  type="radio"
                  name="ex-answer"
                  className="form-check-input"
                  value="-1"
                  onChange={onExampleHandler}
                />
                창의성
              </label>
            </div>
            <div className="check-form">
              <label>
                <input
                  type="radio"
                  name="ex-answer"
                  className="form-check-input"
                  value="-2"
                  onChange={onExampleHandler}
                />
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
          <QuestionContainer />
        </div>
        <div className="footer-container">
          <PreviousButton />
          <NextButton />
        </div>
      </div>
    </div>
  );
}

export default Test;
