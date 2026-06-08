import { useState } from "react";

function CarTable({ cars }) {
  // 어떤 모델의 상세를 펼쳤는지 저장하는 상태
  const [openModel, setOpenModel] = useState(null);

  // 월 주행거리와 리터당 연료 가격 고정값
  const MONTH_DISTANCE = 2000;
  const FUEL_PRICE = 2000;

  // 숫자로 안전하게 변환하는 함수
  const toNumber = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  // 천원 단위 반올림 함수
  const roundToThousand = (value) => {
    return Math.round(value / 1000) * 1000;
  };

  // 도심연비와 고속도로연비 평균으로 복합연비 계산
  const getAverageEfficiencyValue = (car) => {
    const urbanEff = toNumber(car.URBAN_EFF);
    const highwayEff = toNumber(car.HIGHWAY_EFF);

    if (urbanEff > 0 && highwayEff > 0) {
      return (urbanEff + highwayEff) / 2;
    }

    return 0;
  };

  // 화면에 표시할 복합연비 문자열
  const getAverageEfficiencyText = (car) => {
    const avg = getAverageEfficiencyValue(car);

    if (avg > 0) {
      return `${avg.toFixed(1)}km/L`;
    }

    return "-";
  };

  // 월 예상연료비 계산
  const getMonthlyFuelCostValue = (car) => {
    const avg = getAverageEfficiencyValue(car);

    if (avg > 0) {
      const rawCost = (MONTH_DISTANCE / avg) * FUEL_PRICE;
      return roundToThousand(rawCost);
    }

    return 0;
  };

  // 화면에 표시할 월 예상연료비 문자열
  const getMonthlyFuelCostText = (car) => {
    const cost = getMonthlyFuelCostValue(car);

    if (cost > 0) {
      return `${cost.toLocaleString()}원`;
    }

    return "-";
  };

  // 배기량을 L 단위로 변환
  const getEngineDisplacement = (value) => {
    const engine = toNumber(value);

    if (engine <= 0) {
      return "-";
    }

    return `${(engine / 1000).toFixed(1)}L`;
  };

  // 모델명 기준으로 데이터 묶기
  const groupedCars = cars.reduce((acc, car) => {
    const modelName = car.MODEL_NM || "모델명 없음";

    if (!acc[modelName]) {
      acc[modelName] = [];
    }

    acc[modelName].push(car);
    return acc;
  }, {});

  // 객체를 배열로 변환
  const groupedList = Object.entries(groupedCars);

  // 상세 열기/닫기
  const toggleDetail = (modelName) => {
    if (openModel === modelName) {
      setOpenModel(null);
    } else {
      setOpenModel(modelName);
    }
  };

  return (
    <div className="table-section">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>제조사</th>
              <th>모델명</th>
              <th>세부 개수</th>
              <th>대표 복합연비</th>
              <th>대표 월 예상연료비</th>
              <th>상세보기</th>
            </tr>
          </thead>

          <tbody>
            {groupedList.map(([modelName, modelCars], groupIndex) => {
              const 대표차량 = modelCars[0];

              return (
                <>
                  <tr key={`group-${groupIndex}`}>
                    <td>{대표차량.COMP_NM || "-"}</td>
                    <td>{modelName}</td>
                    <td>{modelCars.length}개</td>
                    <td>{getAverageEfficiencyText(대표차량)}</td>
                    <td>{getMonthlyFuelCostText(대표차량)}</td>
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
                    <tr key={`detail-${groupIndex}`}>
                      <td colSpan="6">
                        <div className="detail-table">
                          <table>
                            <thead>
                              <tr>
                                <th>등급</th>
                                <th>출시년도</th>
                                <th>차량유형</th>
                                <th>연료종류</th>
                                <th>복합연비</th>
                                <th>도심연비</th>
                                <th>고속도로연비</th>
                                <th>배기량</th>
                                <th>월 예상연료비</th>
                              </tr>
                            </thead>

                            <tbody>
                              {modelCars.map((car, detailIndex) => (
                                <tr key={`detail-row-${groupIndex}-${detailIndex}`}>
                                  <td>{car.GRADE || "-"}</td>
                                  <td>{car.YEAR || "-"}</td>
                                  <td>{car.CAR_TYPE || "-"}</td>
                                  <td>{car.FUEL_NM || "-"}</td>
                                  <td>{getAverageEfficiencyText(car)}</td>
                                  <td>{car.URBAN_EFF ? `${car.URBAN_EFF}km/L` : "-"}</td>
                                  <td>
                                    {car.HIGHWAY_EFF ? `${car.HIGHWAY_EFF}km/L` : "-"}
                                  </td>
                                  <td>{getEngineDisplacement(car.ENGINE_DISPLACEMENT)}</td>
                                  <td>{getMonthlyFuelCostText(car)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CarTable;