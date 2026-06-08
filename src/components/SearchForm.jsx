function SearchForm({
  company,
  setCompany,
  model,
  setModel,
  grade,
  setGrade,
  year,
  setYear,
  onSearch,
}) {
  return (
    <div>
      <input
        type="text"
        placeholder="업체명 예: 벤츠"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <input
        type="text"
        placeholder="모델명 예: 220 d"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      />

      <input
        type="text"
        placeholder="등급 예: 2등급"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
      />

      <input
        type="text"
        placeholder="출시년도 예: 2016"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />

      <button onClick={onSearch}>조회하기</button>
    </div>
  );
}

export default SearchForm;