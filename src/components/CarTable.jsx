// 조회 결과를 모델 단위로 묶어서 보여주는 컴포넌트

import { useState } from "react";

// 숫자를 안전하게 변환하는 함수
const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

// 천원 단위로 반올림하는 함수
const roundToThousand = (value) => Math.round(value / 1000) * 1000;

// 전기차 여부를 확인하는 함수
const isElectricCar = (car) => car.FUEL_NM === "전기";

// 모델명을 묶기 좋게 정리하는 함수
// 타이어/연식/옵션 관련 꼬리 문구를 제거한다.
const normalizeModelName = (modelName) => {
  if (!modelName) return "모델명 없음";

  return modelName
    .replace(/\([^)]*\)/g, "")
    .replace(/_?\d{2}MY/gi, "")
    .replace(/_/g, " ")
    .replace(/\d+\s*인치/gi, "")
    .replace(/\d+\s*인치\s*타이어/gi, "")
    .replace(/올시즌타이어/gi, "")
    .replace(/타이어/gi, "")
    .replace(/스포츠패키지/gi, "")
    .replace(/\s+/g, " ")
    .trim() || "모델명 없음";
};

// 차량 1대의 평균 연비/전비를 계산하는 함수
const getAverageEfficiencyValue = (car) => {
  const urbanEff = toNumber(car.URBAN_EFF);
  const highwayEff = toNumber(car.HIGHWAY_EFF);

  return urbanEff > 0 && highwayEff > 0 ? (urbanEff + highwayEff) / 2 : 0;
};

// 차량 1대의 연비/전비를 문자열로 만드는 함수
const getAverageEfficiencyText = (car) => {
  const avg = getAverageEfficiencyValue(car);
  if (avg <= 0) return "-";

  return isElectricCar(car)
    ? `${avg.toFixed(1)}km/kWh`
    : `${avg.toFixed(1)}km/L`;
};

// 차량 여러 대의 평균 연비/전비를 계산하는 함수
const getGroupAverageEfficiencyText = (modelCars) => {
  const validValues = modelCars
    .map(getAverageEfficiencyValue)
    .filter((value) => value > 0);

  if (validValues.length === 0) return "-";

  const avg =
    validValues.reduce((sum, value) => sum + value, 0) / validValues.length;

  return modelCars.some(isElectricCar)
    ? `${avg.toFixed(1)}km/kWh`
    : `${avg.toFixed(1)}km/L`;
};

// 도심 연비/전비 문자열 함수
const getUrbanEfficiencyText = (car) => {
  const urbanEff = toNumber(car.URBAN_EFF);
  if (urbanEff <= 0) return "-";

  return isElectricCar(car) ? `${urbanEff}km/kWh` : `${urbanEff}km/L`;
};

// 고속 연비/전비 문자열 함수
const getHighwayEfficiencyText = (car) => {
  const highwayEff = toNumber(car.HIGHWAY_EFF);
  if (highwayEff <= 0) return "-";

  return isElectricCar(car) ? `${highwayEff}km/kWh` : `${highwayEff}km/L`;
};

// 차량 1대의 월 예상유지비를 계산하는 함수
const getMonthlyFuelCostValue = (car) => {
  const avg = getAverageEfficiencyValue(car);
  if (avg <= 0) return 0;

  const rawCost = isElectricCar(car) ? (2000 / avg) * 330 : (2000 / avg) * 2000;

  return roundToThousand(rawCost);
};

// 차량 1대의 월 예상유지비 문자열 함수
const getMonthlyFuelCostText = (car) => {
  const cost = getMonthlyFuelCostValue(car);
  return cost > 0 ? `${cost.toLocaleString()}원` : "-";
};

// 차량 여러 대의 평균 월 예상유지비 문자열 함수
const getGroupMonthlyFuelCostText = (modelCars) => {
  const validCosts = modelCars
    .map(getMonthlyFuelCostValue)
    .filter((value) => value > 0);

  if (validCosts.length === 0) return "-";

  const avg =
    validCosts.reduce((sum, value) => sum + value, 0) / validCosts.length;

  return `${roundToThousand(avg).toLocaleString()}원`;
};

// 배기량을 L 단위로 보여주는 함수
const getEngineDisplacement = (value) => {
  const engine = toNumber(value);
  return engine > 0 ? `${(engine / 1000).toFixed(1)}L` : "-";
};

function CarTable({ cars }) {
  // 어떤 모델의 상세를 펼쳤는지 저장하는 상태
  const [openModel, setOpenModel] = useState(null);

  // 같은 모델끼리 묶어주는 객체
  const groupedCars = cars.reduce((acc, car) => {
    const baseModelName = normalizeModelName(car.MODEL_NM);
    if (!acc[baseModelName]) acc[baseModelName] = [];
    acc[baseModelName].push(car);
    return acc;
  }, {});

  // 객체를 표에서 돌리기 쉽게 배열로 변환한다.
  const groupedList = Object.entries(groupedCars);

  // 상세보기 열기/닫기 함수
  const toggleDetail = (modelName) => {
    setOpenModel((prev) => (prev === modelName ? null : modelName));
  };

  return (
    <div className="table-section">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>제조사</th>
              <th>모델명</th>
              <th>연료종류</th>
              <th>세부 개수</th>
              <th>대표 연비/전비</th>
              <th>대표 월 예상유지비</th>
              <th>상세보기</th>
            </tr>
          </thead>

          <tbody>
            {groupedList.map(([modelName, modelCars], index) => {
              const firstCar = modelCars[0];

              return (
                <FragmentGroup key={index}>
                  <tr>
                    <td>{firstCar.COMP_NM || "-"}</td>
                    <td>{modelName}</td>
                    <td>{firstCar.FUEL_NM || "-"}</td>
                    <td>{modelCars.length}개</td>
                    <td>{getGroupAverageEfficiencyText(modelCars)}</td>
                    <td>{getGroupMonthlyFuelCostText(modelCars)}</td>
                    <td>
                      <button
                        className="detail-button"
                        onClick={() => toggleDetail(modelName)}
                      >
                        {openModel === modelName ? "닫기" : "상세보기"}
                      </button>
                    </td>
                  </tr>

                  {openModel === modelName && (
                    <tr>
                      <td colSpan="7">
                        <div className="detail-table">
                          <table>
                            <thead>
                              <tr>
                                <th>원본 모델명</th>
                                <th>등급</th>
                                <th>출시년도</th>
                                <th>차량유형</th>
                                <th>연료종류</th>
                                <th>연비/전비</th>
                                <th>도심 연비/전비</th>
                                <th>고속 연비/전비</th>
                                <th>배기량</th>
                                <th>월 예상유지비</th>
                              </tr>
                            </thead>

                            <tbody>
                              {modelCars.map((car, detailIndex) => (
                                <tr key={detailIndex}>
                                  <td>{car.MODEL_NM || "-"}</td>
                                  <td>{car.GRADE || "-"}</td>
                                  <td>{car.YEAR || "-"}</td>
                                  <td>{car.CAR_TYPE || "-"}</td>
                                  <td>{car.FUEL_NM || "-"}</td>
                                  <td>{getAverageEfficiencyText(car)}</td>
                                  <td>{getUrbanEfficiencyText(car)}</td>
                                  <td>{getHighwayEfficiencyText(car)}</td>
                                  <td>
                                    {isElectricCar(car)
                                      ? "-"
                                      : getEngineDisplacement(car.ENGINE_DISPLACEMENT)}
                                  </td>
                                  <td>{getMonthlyFuelCostText(car)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </FragmentGroup>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 테이블 안에서 여러 줄을 묶기 위한 보조 컴포넌트
function FragmentGroup({ children }) {
  return <>{children}</>;
}

export default CarTable;