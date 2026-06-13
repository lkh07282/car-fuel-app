// 연료 구분을 선택하는 버튼 컴포넌트

function FuelTypeSelect({ onSelectFuelType }) {
  return (
    <div className="brand-section">
      <div className="brand-buttons">
        <button onClick={() => onSelectFuelType("전기")}>전기</button>
        <button onClick={() => onSelectFuelType("내연기관")}>내연기관</button>
        <button onClick={() => onSelectFuelType("하이브리드")}>하이브리드</button>
      </div>
    </div>
  );
}

export default FuelTypeSelect;