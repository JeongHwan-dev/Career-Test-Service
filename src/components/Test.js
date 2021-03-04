import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './css/Test.css';

var answersArray = []; // 검사자 응답 정보 데이터 배열 (가공전)

// 테스트 컴포넌트 (등록, 테스트)
function Test() {
  const [userName, setUserName] = useState(''); // 검사자 이름
  const [userGender, setUserGender] = useState(false); // 검사자 성별
  const [exAnswer, setExAnswer] = useState(false); // 예시 문항 선택 기록
  const [data, setData] = useState([{}]); // 질문 데이터 (JSON 배열)
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [questionPage, setQuestionPage] = useState(0); // 퀴즈 페이지
  const [currentProgress, setCurrentProgress] = useState(0); // 진행도 바
  const [resultURL, setResultURL] = useState(''); // 결과 페이지 url 정보
  const history = useHistory;
  let userAnswers = ''; // 검사자 응답 정보 데이터

  // 검사자 이름 설정 핸들러
  const onNameHandler = (event) => {
    setUserName(event.currentTarget.value);
    console.log(`검사자 이름: ${userName}`);
  };

  // 검사자 성별 설정 핸들러
  const onGenderHandler = (event) => {
    setUserGender(event.currentTarget.value);
    console.log(`성별 코드: ${userGender}`);
  };

  // 예시 문제 진행 확인 핸들러
  const onExampleHandler = (event) => {
    setExAnswer(event.currentTarget.value);
    console.log(`예시 문제 선택지: ${exAnswer}`);
  };

  // 진행도 핸들러
  const onProgressHandler = () => {
    const checked = document.querySelectorAll(`input:checked`).length; // 체크 개수 확인
    setCurrentProgress(Math.ceil((100 / 28) * (checked - 2)));
  };

  // 검사자 응답 정보 취합 핸들러
  const onAnswersHandler = () => {
    for (var i = 1; i < answersArray.length; i++) {
      userAnswers += `B${i}=${answersArray[i]} `;
    }
  };

  // 진행도 바 함수
  function ProgressBar() {
    return (
      <div className="progress">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${currentProgress}%` }}
          aria-valuenow="100"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    );
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
    console.log(data);
  }, []);

  // 질문 데이터 묶음 저장 그룹
  var questionGroup = [];

  // OpenAPI 질문 데이터 4개씩 묶기
  for (var i = 0; i < data.length / 4; i++) {
    questionGroup[i] = data.slice(i * 4, i * 4 + 4);
  }

  // 결과 URL 요청 함수
  function postOpenAPI() {
    const reportURL = 'http://www.career.go.kr/inspct/openapi/test/report';
    const userData = {
      apikey: '08eff82361010e36e469cf5353765658',
      qestrnSeq: '6',
      trgetSe: '100209',
      name: userName,
      gender: userGender,
      grade: '1',
      startDtm: new Date().getTime(),
      answers: userAnswers,
    };
    axios.post(reportURL, userData).then((response) => {
      // 질문. 왜 setResultURL() 함수로 resultURL에 url데이터를 넣어도
      // 콘솔로 확인했을 때 빈 값이 나오는지 이유가 궁금합니다.
      setResultURL(response.data.RESULT.url);
      console.log(`Result Page: ${response.data.RESULT.url}`);

      // =============== 빈 값 출력 =====================
      console.log(`ResultURL: ${resultURL}`);
      // =============== 빈 값 출력 =====================
    });
  }

  // 한 장의 테스트 질문 페이지에 문제 할당하는 함수
  function allocateQuestion(group) {
    const page = group.map((jsonData, index) => {
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
                    onChange={() => {
                      answersArray[jsonData.qitemNo] = jsonData.answerScore01;
                      console.log(
                        `SET: Answer[${jsonData.qitemNo}] = ${answersArray[jsonData.qitemNo]}`,
                      );
                    }}
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
                    onChange={() => {
                      answersArray[jsonData.qitemNo] = jsonData.answerScore02;
                      console.log(
                        `SET: Answer[${jsonData.qitemNo}] = ${answersArray[jsonData.qitemNo]}`,
                      );
                    }}
                  />
                  {jsonData.answer02}
                </label>
              </div>
            </div>
          </div>
        </>
      );
    });
    return page;
  }

  // 현재 페이지로 다음 페이지로 넘기는 함수
  function nextPage() {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
      console.log(`MOVE: Main Page ${currentPage} => ${currentPage + 1}(now)`);
    } else {
      setQuestionPage(questionPage + 1);
      console.log(`MOVE: Test Page ${questionPage + 1} => ${questionPage + 2}(now)`);
    }
  }

  // 현재 페이지를 이전 페이지로 되돌리는 함수
  function previousPage() {
    if (questionPage === 0) {
      setCurrentPage(currentPage - 1);
      console.log(`MOVE: Main Page ${currentPage} => ${currentPage - 1}(now)`);
    } else {
      setQuestionPage(questionPage - 1);
      console.log(`MOVE: Test Page ${questionPage + 1} => ${questionPage}(now)`);
    }
  }

  // 결과 페이지로 이동하는 함수
  function moveResult() {
    window.location.href = '#/result';
  }

  // 컴포넌트

  // 검사 시작 버튼 컴포넌트
  function StartButton() {
    if (currentPage === 1) {
      return (
        <button
          type="button"
          className="btn-outline-primary"
          id="user-start-btn"
          disabled={!(userName && userGender)} // 검사자 정보 입력 확인
          onClick={nextPage}
        >
          검사 시작
        </button>
      );
    } else if (currentPage === 2) {
      return (
        <button
          type="button"
          className="btn-outline-primary"
          disabled={!exAnswer} // 예시 문항 체크 여부 확인
          onClick={nextPage}
        >
          검사 시작
        </button>
      );
    }
  }

  // 다음 버튼 컴포넌트
  function NextButton() {
    if (questionPage === questionGroup.length - 1) {
      return (
        <button
          type="button"
          className="btn-outline-primary"
          onClick={() => {
            moveResult();
            onAnswersHandler();
            console.log(`userAnswers: ${userAnswers}`);
            postOpenAPI();
          }}
          disabled={currentProgress < 100}
        >
          제출
        </button>
      );
    }
    return (
      <button type="button" className="btn-outline-primary" onClick={nextPage}>
        다음 &gt;
      </button>
    );
  }

  // 이전 버튼 컴포넌트
  function PreviousButton() {
    return (
      <button type="button" className="btn-outline-primary" onClick={previousPage}>
        &lt; 이전
      </button>
    );
  }

  // 페이지 이동 버튼 컴포넌트
  function ShiftingButton() {
    if (currentPage === 1) {
      return (
        <>
          <StartButton />
        </>
      );
    } else if (currentPage === 2) {
      return (
        <>
          <PreviousButton />
          <StartButton />
        </>
      );
    } else {
      return (
        <>
          <PreviousButton />
          <NextButton />
        </>
      );
    }
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
              placeholder="홍길동"
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
          <ShiftingButton />
        </div>
      </div>
      <div id="page2-example" style={{ display: currentPage === 2 ? 'block' : 'none' }}>
        <div className="header-container">
          <div className="title">
            <div>
              <h2>검사 예시</h2>
            </div>
            <div className="progress-num">
              <h3>{currentProgress}%</h3>
            </div>
          </div>
          <div className="progress-bar">
            <ProgressBar />
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
          <ShiftingButton />
        </div>
      </div>
      <div id="page3-test" style={{ display: currentPage === 3 ? 'block' : 'none' }}>
        <div className="header-container">
          <div className="title">
            <div>
              <h2>검사 진행</h2>
            </div>
            <div className="progress-num">
              <h3>{currentProgress}%</h3>
            </div>
          </div>
          <div className="progress-bar">
            <ProgressBar />
          </div>
        </div>
        <div className="body-container" id="test-container" onChange={onProgressHandler}>
          {questionGroup.map((item, index) => {
            return (
              <>
                <div
                  className="question-group"
                  id={`questionGroup${index}`}
                  style={{ display: questionPage === index ? 'block' : 'none' }}
                >
                  {allocateQuestion(questionGroup[index])}
                </div>
              </>
            );
          })}
        </div>
        <div className="footer-container">
          <ShiftingButton />
        </div>
      </div>
    </div>
  );
}

export default Test;
