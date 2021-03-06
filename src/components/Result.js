import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

function Result() {
  const location = useLocation();
  const [name, setName] = useState(''); // 검사자 이름
  const [gender, setGender] = useState(''); // 검사자 성별
  const [date, setDate] = useState(''); // 검사일
  const [score, setScore] = useState([]); // 검사 결과 점수
  const [data, setData] = useState([]);
  const subject = [
    '능력발휘',
    '자율성',
    '보수',
    '안정성',
    '사회적 인정',
    '사회봉사',
    '자기개발',
    '창의성',
  ];

  useEffect(() => {
    getResultData();
  }, []);

  function getResultData() {
    const seq = location.state.resultURL.split('seq=').pop();
    const jsonReportURL = `https://inspct.career.go.kr/inspct/api/psycho/report?seq=${seq}`;
    axios.get(jsonReportURL).then((response) => {
      setName(response.data.user.name);

      if (response.data.inspct.sexdstn === 100323) {
        setGender('남성');
      } else if (response.data.inspct.sexdstn === 100324) {
        setGender('여성');
      } else {
        setGender('None');
      }

      switch (response.data.inspct.sexdstn) {
        case 100323:
          setGender('남성');
          break;
        case 100324:
          setGender('여성');
          break;
        default:
          setGender('None');
      }

      setDate(response.data.inspct.beginDtm.split('T')[0]);
      setScore(response.data.result.wonScore.split(' '));
      // score > 1=52=13=54=25=46=37=28=6
    });
  }

  useEffect(() => {
    let subjectData = [];
    if (score != ' ') {
      for (var i = 0; i < score.length - 1; i++) {
        subjectData.push({
          subject: subject[i],
          A: parseInt(score[i].split('=')[1]) * 20,
          fullMark: 100,
        });
      }
      setData(subjectData);
    }
  }, [score]);

  return (
    <>
      <div id="root">
        <div className="header-container">
          <div className="title">
            <h2>직업가치관검사 결과표</h2>
          </div>
          <br />
          <div className="description">
            직업가치관이란 직업을 선택할 때 영향을 끼치는 자신만의 믿음과 신념입니다. 따라서
            여러분의 직업생활과 관련하여 포기하지 않는 무게중심의 역할을 한다고 볼 수 있습니다.
            직업가치관검사는 여러분이 직업을 선택할 때 상대적으로 어떠한 가치를 중요하게
            생각하는지를 알려줍니다. 또한 본인이 가장 중요하게 생각하는 가치를 충족시켜줄 수 있는
            직업에 대해 생각해 볼 기회를 제공합니다.
          </div>
          <br />
          <br />
        </div>
        <div className="body-container">
          <div className="user-info">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">이름</th>
                  <th scope="col">성별</th>
                  <th scope="col">검사일</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{name}</td>
                  <td>{gender}</td>
                  <td>{date}</td>
                </tr>
              </tbody>
            </table>
            <br />
            <br />
            <div>
              <h3>직업가치관결과</h3>
            </div>
            <div>
              <RadarChart cx={300} cy={250} outerRadius={150} width={500} height={500} data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name={name} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </div>
            <br />
            <br />
            <div>
              <h3>가치관과 관련이 높은 직업</h3>
              <h3>{score}</h3>
            </div>
          </div>
        </div>
        <div className="footer-container">
          <div>
            <button
              type="button"
              className="btn-outline-primary"
              onClick={() => {
                window.location.href = '#/';
              }}
            >
              다시 검사하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Result;
