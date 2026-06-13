// 모델명, 등급, 출시년도를 입력받는 검색 컴포넌트

function ModelSearch({
  model,
  setModel,
  grade,
  setGrade,
  year,
  setYear,
  onSearch,
}) {
  return (
    <div className="search-section">
      <div className="search-form">
        <input
          type="text"
          placeholder="모델명 예: G80"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        <input
          type="text"
          placeholder="등급 예: 2WD"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />

        <input
          type="text"
          placeholder="출시년도 예: 2024"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <button onClick={onSearch}>조회하기</button>
      </div>
    </div>
  );
}

export default ModelSearch;