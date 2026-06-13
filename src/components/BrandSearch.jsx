// 브랜드를 버튼 또는 직접 입력으로 선택하는 컴포넌트

import { useState } from "react";

function BrandSearch({ onSelectBrand }) {
  // 화면에 표시할 기본 브랜드 목록
  const brandList = ["현대", "기아", "벤츠", "BMW", "아우디", "포르쉐"];

  // 사용자가 직접 입력하는 브랜드 상태
  const [customBrand, setCustomBrand] = useState("");

  // 직접 입력한 브랜드를 선택하는 함수
  const handleCustomBrand = () => {
    if (!customBrand.trim()) {
      alert("브랜드를 입력해주세요.");
      return;
    }

    onSelectBrand(customBrand);
    setCustomBrand("");
  };

  return (
    <div className="brand-section">
      <h2>브랜드를 선택하세요</h2>

      <div className="brand-buttons">
        {brandList.map((brand) => (
          <button key={brand} onClick={() => onSelectBrand(brand)}>
            {brand}
          </button>
        ))}
      </div>

      <hr className="section-line" />

      <h3>없는 브랜드 직접 검색</h3>

      <div className="custom-brand-box">
        <input
          type="text"
          placeholder="브랜드 직접 입력 예: 렉서스"
          value={customBrand}
          onChange={(e) => setCustomBrand(e.target.value)}
        />
        <button onClick={handleCustomBrand}>직접 검색</button>
      </div>
    </div>
  );
}

export default BrandSearch;