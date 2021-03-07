import React, { useState, useEffect, useDebugValue } from 'react';
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
import './css/Result.css';

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
    });
  }

  useEffect(() => {
    let subjectData = [];
    let no = [];
    if (score != ' ') {
      for (var i = 0; i < score.length - 1; i++) {
        subjectData.push({
          subject: subject[i],
          A: parseInt(score[i].split('=')[1]) * 14.2,
          fullMark: 100,
        });
        no.push(parseInt(score[i].split('=')[1]));
      }

      setData(subjectData);
    }
  }, [score]);

  return (
    <>
      <div className="root">
        <div className="header-container">
          <div className="report-title">
            <h1>직업가치관검사 결과표</h1>
            <hr />
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
            <div className="radarChart-form">
              <RadarChart cx={300} cy={250} outerRadius={150} width={500} height={500} data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name={name} dataKey="A" stroke="#007bff" fill="#007bff" fillOpacity={0.6} />
              </RadarChart>
            </div>
            <br />
            <br />
            <div>
              <div className="description-form">
                <h3>
                  <strong>각각의 가치관이 갖는 의미는 다음과 같습니다.</strong>
                </h3>
              </div>
              <br />
              <div>
                <table class="type09">
                  <thead>
                    <tr>
                      <th scope="cols">능력발휘</th>
                      <th scope="cols"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">특징</th>
                      <td>나의 능력을 충분히 발휘할 수 있을 때 보람과 만족을 느낍니다.</td>
                    </tr>
                    <tr>
                      <th scope="row">직업선택</th>
                      <td>
                        나는 나의 능력을 충분히 발휘할 수 있는 기회와 가능성이 주어지는 직업을
                        선택할 것입니다.
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">직업생활</th>
                      <td>
                        직업생활에서의 경쟁은 나를 도전적으로 만들어주고, 어려운 일을 하나씩 해결해
                        나가는 과정에서 성취감을 느낄 것 입니다.
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <table class="type09">
                  <thead>
                    <tr>
                      <th scope="cols">자율성</th>
                      <th scope="cols"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">특징</th>
                      <td>나는 어떤 일을 할 때 규칙, 절차, 시간 등을 스스로 결정하길 원합니다.</td>
                    </tr>
                    <tr>
                      <th scope="row">직업선택</th>
                      <td>
                        나는 다른 것보다 일하는 방식과 스타일이 자유로운 직업을 선택할 것입니다.
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">직업생활</th>
                      <td>
                        나만의 방식에 맞게 자율적으로 일할 때 나의 능력을 더욱 효과적으로 발휘할 수
                        있습니다.
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <table class="type09">
                  <thead>
                    <tr>
                      <th scope="cols">보수</th>
                      <th scope="cols"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">특징</th>
                      <td>나의 충분한 경제적 보상이 매우 중요하다고 생각합니다.</td>
                    </tr>
                    <tr>
                      <th scope="row">직업선택</th>
                      <td>
                        나의 노력과 성과에 대해 충분한 경제적 보상이 주어지는 직업을 선택할
                        것입니다.
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">직업생활</th>
                      <td>
                        충분한 보수를 받는다면 일의 어려움과 힘겨움에 관계없이 최선을 다해 노력할
                        것입니다.
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <table class="type09">
                  <thead>
                    <tr>
                      <th scope="cols">안정성</th>
                      <th scope="cols"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">특징</th>
                      <td>나는 매사가 계획한대로 안정적으로 유지되는 것을 좋아합니다.</td>
                    </tr>
                    <tr>
                      <th scope="row">직업선택</th>
                      <td>나는 쉽게 해고되지 않고 오랫동안 일할 수 있는 직업을 선택할 것입니다.</td>
                    </tr>
                    <tr>
                      <th scope="row">직업생활</th>
                      <td>
                        안정적인 직업생활이 보장된다면 편안한 마음으로 더욱 열심히 일을 할 것입니다.
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <table class="type09">
                  <thead>
                    <tr>
                      <th scope="cols">사회적인정</th>
                      <th scope="cols"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">특징</th>
                      <td>나는 다른 사람들로부터 나의 능력과 성취를 충분히 인정받고 싶어합니다.</td>
                    </tr>
                    <tr>
                      <th scope="row">직업선택</th>
                      <td>
                        나는 많은 사람들로부터 주목받고 인정받을 수 있는 직업을 선택할 것입니다.
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">직업생활</th>
                      <td>
                        주변사람들이 나를 긍정적으로 평가하면 나의 능력발휘에 더욱 도움이 될
                        것입니다.
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <table class="type09">
                  <thead>
                    <tr>
                      <th scope="cols">사회봉사</th>
                      <th scope="cols"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">특징</th>
                      <td>나는 다른 사람을 돕고 더 나은 세상을 만들고 싶습니다.</td>
                    </tr>
                    <tr>
                      <th scope="row">직업선택</th>
                      <td>
                        나는 사람, 조직, 국가, 인류에 대한 봉사와 기여가 가능한 직업을 선택할
                        것입니다.
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">직업생활</th>
                      <td>
                        도움과 격려가 필요한 사람들에게 힘을 줄 수 있는 직업생활을 할 때 가치와
                        보람을 느낄 것입니다.
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <table class="type09">
                  <thead>
                    <tr>
                      <th scope="cols">자기계발</th>
                      <th scope="cols"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">특징</th>
                      <td>나는 항상 새로운 것을 배우고 스스로 발전해 나갈 때 만족을 느낍니다.</td>
                    </tr>
                    <tr>
                      <th scope="row">직업선택</th>
                      <td>
                        나는 나의 능력과 소질을 지속적으로 발전시킬 수 있는 직업을 선택할 것입니다.
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">직업생활</th>
                      <td>
                        나 스스로가 발전할 수 있는 기회가 충분히 주어지는 직업생활을 할 때 만족감을
                        느낄 것입니다.
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <table class="type09">
                  <thead>
                    <tr>
                      <th scope="cols">창의성</th>
                      <th scope="cols"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">특징</th>
                      <td>
                        나는 예전부터 해오던 것 보다는 새로운 것을 만들어 내는 것을 매우 좋아합니다.
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">직업선택</th>
                      <td>
                        나는 늘 변화하고 혁신적인 아이디어를 내며, 창조적인 시도를 하는 직업을
                        선택하고 싶습니다.
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">직업생활</th>
                      <td>
                        나는 새롭고 독창적인 것을 만들어 내는 과정에서 능력을 충분히 발휘할 수 있을
                        것입니다.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <br />
          </div>
        </div>
        <br />
        <div className="footer-container">
          <div className="report-link">
            <a href={location.state.resultURL} target="_blank">
              <h5>더 자세한 정보를 확인하고 싶다면 Click!</h5>
            </a>
          </div>
          <br />
          <br />
          <div>
            <button
              type="button"
              className="btn-restart"
              onClick={() => {
                window.location.href = '#/';
              }}
            >
              다시 검사하기
            </button>
          </div>
          <br />
          <br />
          <br />
        </div>
      </div>
    </>
  );
}

export default Result;
