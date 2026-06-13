// 두 차량을 좌우로 비교하는 컴포넌트

function CompareSection({
  title = "비교",
  leftCompareBrand,
  setLeftCompareBrand,
  leftCompareModel,
  setLeftCompareModel,
  rightCompareBrand,
  setRightCompareBrand,
  rightCompareModel,
  setRightCompareModel,
  onCompare,
  compareLoading,
  compareError,
  leftCompareCar,
  rightCompareCar,
}) {
  // 숫자 변환 보조 함수
  const toNumber = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  // 전기차 여부를 판단하는 함수
  const isElectricCar = (car) => (car?.FUEL_NM || "") === "전기";

  // 도심/고속 평균으로 연비/전비를 계산하는 함수
  const getAverageEfficiencyValue = (car) => {
    if (!car) return 0;

    const urbanEff = toNumber(car.URBAN_EFF);
    const highwayEff = toNumber(car.HIGHWAY_EFF);

    return urbanEff > 0 && highwayEff > 0 ? (urbanEff + highwayEff) / 2 : 0;
  };

  // 표시용 연비/전비 문자열을 만드는 함수
  const getAverageEfficiencyText = (car) => {
    const avg = getAverageEfficiencyValue(car);
    if (avg <= 0) return "-";

    return isElectricCar(car)
      ? `${avg.toFixed(1)}km/kWh`
      : `${avg.toFixed(1)}km/L`;
  };

  // 표시용 월 예상유지비 문자열을 만드는 함수
  const getMonthlyCostText = (car) => {
    if (!car) return "-";

    const avg = getAverageEfficiencyValue(car);
    if (avg <= 0) return "-";

    const rawCost = isElectricCar(car)
      ? (2000 / avg) * 330
      : (2000 / avg) * 2000;

    return `${(Math.round(rawCost / 1000) * 1000).toLocaleString()}원`;
  };

  // 배기량을 L 단위로 표시하는 함수
  const getEngineDisplacement = (value, car) => {
    if (!car || isElectricCar(car)) return "-";

    const engine = toNumber(value);
    return engine > 0 ? `${(engine / 1000).toFixed(1)}L` : "-";
  };

  return (
    <div className="compare-section">
      <h2>{title}</h2>

      <div className="compare-input-grid">
        <div className="compare-input-box">
          <h3>왼쪽 차량</h3>
          <input
            type="text"
            placeholder="브랜드 예: 현대"
            value={leftCompareBrand}
            onChange={(e) => setLeftCompareBrand(e.target.value)}
          />
          <input
            type="text"
            placeholder="모델 예: 투싼"
            value={leftCompareModel}
            onChange={(e) => setLeftCompareModel(e.target.value)}
          />
        </div>

        <div className="compare-input-box">
          <h3>오른쪽 차량</h3>
          <input
            type="text"
            placeholder="브랜드 예: 기아"
            value={rightCompareBrand}
            onChange={(e) => setRightCompareBrand(e.target.value)}
          />
          <input
            type="text"
            placeholder="모델 예: 스포티지"
            value={rightCompareModel}
            onChange={(e) => setRightCompareModel(e.target.value)}
          />
        </div>
      </div>

      <div className="compare-action">
        <button onClick={onCompare}>비교하기</button>
      </div>

      {compareLoading && <p className="status-text">비교 불러오는 중...</p>}
      {compareError && <p className="status-text">{compareError}</p>}

      {(leftCompareCar || rightCompareCar) && (
        <div className="compare-result-grid">
          <div className="compare-card">
            <h3>왼쪽 차량</h3>
            {leftCompareCar ? (
              <>
                <p><strong>제조사</strong> : {leftCompareCar.COMP_NM || "-"}</p>
                <p><strong>모델명</strong> : {leftCompareCar.MODEL_NM || "-"}</p>
                <p><strong>연료종류</strong> : {leftCompareCar.FUEL_NM || "-"}</p>
                <p><strong>연비/전비</strong> : {getAverageEfficiencyText(leftCompareCar)}</p>
                <p><strong>출시년도</strong> : {leftCompareCar.YEAR || "-"}</p>
                <p><strong>등급</strong> : {leftCompareCar.GRADE || "-"}</p>
                <p><strong>배기량</strong> : {getEngineDisplacement(leftCompareCar.ENGINE_DISPLACEMENT, leftCompareCar)}</p>
                <p><strong>월 예상유지비</strong> : {getMonthlyCostText(leftCompareCar)}</p>
              </>
            ) : (
              <p>차량 정보를 찾지 못했습니다.</p>
            )}
          </div>

          <div className="compare-card">
            <h3>오른쪽 차량</h3>
            {rightCompareCar ? (
              <>
                <p><strong>제조사</strong> : {rightCompareCar.COMP_NM || "-"}</p>
                <p><strong>모델명</strong> : {rightCompareCar.MODEL_NM || "-"}</p>
                <p><strong>연료종류</strong> : {rightCompareCar.FUEL_NM || "-"}</p>
                <p><strong>연비/전비</strong> : {getAverageEfficiencyText(rightCompareCar)}</p>
                <p><strong>출시년도</strong> : {rightCompareCar.YEAR || "-"}</p>
                <p><strong>등급</strong> : {rightCompareCar.GRADE || "-"}</p>
                <p><strong>배기량</strong> : {getEngineDisplacement(rightCompareCar.ENGINE_DISPLACEMENT, rightCompareCar)}</p>
                <p><strong>월 예상유지비</strong> : {getMonthlyCostText(rightCompareCar)}</p>
              </>
            ) : (
              <p>차량 정보를 찾지 못했습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CompareSection;