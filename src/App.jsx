import { useState } from "react";
import BrandSearch from "./components/BrandSearch";
import ModelSearch from "./components/ModelSearch";
import PageButtons from "./components/PageButtons";
import CarTable from "./components/CarTable";
import StatusMessage from "./components/StatusMessage";

function App() {
  // 현재 화면 단계
  // 1 = 브랜드 선택 화면
  // 2 = 모델 조회 화면
  const [step, setStep] = useState(1);

  // 선택 완료된 브랜드
  const [selectedBrand, setSelectedBrand] = useState("");

  // 두 번째 화면에서 사용하는 검색 조건들
  const [model, setModel] = useState("");
  const [grade, setGrade] = useState("");
  const [year, setYear] = useState("");

  // 조회 결과 상태
  const [cars, setCars] = useState([]);

  // 로딩 상태
  const [loading, setLoading] = useState(false);

  // 에러 메시지 상태
  const [error, setError] = useState("");

  // 현재 페이지 상태
  const [page, setPage] = useState(1);

  // 브랜드 버튼 클릭 시 두 번째 화면으로 이동
  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setModel("");
    setGrade("");
    setYear("");
    setCars([]);
    setError("");
    setPage(1);
    setStep(2);
  };

  // 다시 브랜드 선택 화면으로 돌아가기
  const handleBackToBrand = () => {
    setStep(1);
    setCars([]);
    setError("");
    setPage(1);
  };

  // 자동차 조회 함수
  const fetchCars = async (pageNumber) => {
    try {
      setLoading(true);
      setError("");
      setCars([]);

      const params = new URLSearchParams({
        serviceKey:
          "780866664e85d6cfdc3d110bcd33324a280b2360dfabe3e1321f57ce0144149a",
        pageNo: pageNumber,
        numOfRows: 100,
        apiType: "JSON",
      });

      // 선택한 브랜드는 항상 포함
      if (selectedBrand) params.append("q1", selectedBrand);

      // 추가 검색 조건
      if (model) params.append("q2", model);
      if (grade) params.append("q3", grade);
      if (year) params.append("q4", year);

      const response = await fetch(`/api/cars?${params}`);

      if (!response.ok) {
        throw new Error("조회 실패");
      }

      const data = await response.json();
      console.log("응답 데이터:", data);

      const items = data?.response?.body?.items?.item || [];
      const normalizedItems = Array.isArray(items) ? items : [items];

      setCars(normalizedItems);
      setPage(pageNumber);
    } catch (err) {
      console.error(err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 조회 버튼 클릭 시 1페이지부터 조회
  const handleSearch = () => {
    fetchCars(1);
  };

  // 페이지 이동
  const handlePageChange = (pageNumber) => {
    fetchCars(pageNumber);
  };

  return (
    <div className="container">
      <h1>자동차 표시연비 조회</h1>

      {/* 1단계: 브랜드 버튼 선택 화면 */}
      {step === 1 && <BrandSearch onSelectBrand={handleBrandSelect} />}

      {/* 2단계: 선택한 브랜드 기준 모델 조회 화면 */}
      {step === 2 && (
        <div>
          <div className="selected-brand-box">
            <p>선택한 브랜드: {selectedBrand}</p>
            <button onClick={handleBackToBrand}>브랜드 다시 선택</button>
          </div>

          <ModelSearch
            model={model}
            setModel={setModel}
            grade={grade}
            setGrade={setGrade}
            year={year}
            setYear={setYear}
            onSearch={handleSearch}
          />

          <PageButtons currentPage={page} onPageChange={handlePageChange} />

          <StatusMessage loading={loading} error={error} cars={cars} />

          {cars.length > 0 && <CarTable cars={cars} />}
        </div>
      )}
    </div>
  );
}

export default App;