// 전체 앱의 흐름과 상태를 관리하는 메인 컴포넌트

import { useState } from "react";
import FuelTypeSelect from "./components/FuelTypeSelect";
import BrandSearch from "./components/BrandSearch";
import ModelSearch from "./components/ModelSearch";
import PageButtons from "./components/PageButtons";
import CarTable from "./components/CarTable";
import StatusMessage from "./components/StatusMessage";
import CompareSection from "./components/CompareSection";

// 문자열을 비교하기 쉽게 정리하는 함수
// 대소문자와 공백 차이를 없애서 비교를 쉽게 만든다.
const normalizeText = (text) =>
  String(text || "").toLowerCase().replace(/\s+/g, "").trim();

// 택시 모델인지 확인하는 함수
// 모델명이나 등급명에 택시가 들어가면 비교/조회에서 제외한다.
const isTaxiModel = (car) =>
  (car.MODEL_NM || "").includes("택시") || (car.GRADE || "").includes("택시");

// 연료명을 기준으로 전기차인지 확인하는 함수
const isElectricFuel = (fuelName = "") => fuelName.includes("전기");

// 연료명을 기준으로 하이브리드인지 확인하는 함수
const isHybridFuel = (fuelName = "") => fuelName.includes("하이브리드");

// 연료명을 기준으로 내연기관 차량인지 확인하는 함수
const isInternalCombustionFuel = (fuelName = "") =>
  fuelName.includes("휘발유") ||
  fuelName.includes("경유") ||
  fuelName.includes("LPG") ||
  fuelName.includes("CNG") ||
  fuelName.includes("천연가스");

// 선택한 연료 구분과 차량의 연료가 맞는지 확인하는 함수
const matchesFuelType = (fuelType, car) => {
  const fuelName = car.FUEL_NM || "";

  if (!fuelType) return true;
  if (fuelType === "전기") return isElectricFuel(fuelName);
  if (fuelType === "하이브리드") return isHybridFuel(fuelName);
  if (fuelType === "내연기관") return isInternalCombustionFuel(fuelName);

  return true;
};

function App() {
  // step: 1=연료구분 선택, 2=브랜드 선택, 3=모델 조회
  const [step, setStep] = useState(1);

  // 조회에 사용하는 선택값 상태
  const [selectedFuelType, setSelectedFuelType] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  // 조회 검색 조건 상태
  const [model, setModel] = useState("");
  const [grade, setGrade] = useState("");
  const [year, setYear] = useState("");

  // 조회 결과 및 화면 상태
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  // 비교 입력 상태
  const [leftCompareBrand, setLeftCompareBrand] = useState("");
  const [leftCompareModel, setLeftCompareModel] = useState("");
  const [rightCompareBrand, setRightCompareBrand] = useState("");
  const [rightCompareModel, setRightCompareModel] = useState("");

  // 비교 결과 상태
  const [leftCompareCar, setLeftCompareCar] = useState(null);
  const [rightCompareCar, setRightCompareCar] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState("");

  // 연료구분을 선택하면 브랜드 선택 화면으로 넘어간다.
  const handleFuelTypeSelect = (fuelType) => {
    setSelectedFuelType(fuelType);
    setSelectedBrand("");
    setModel("");
    setGrade("");
    setYear("");
    setCars([]);
    setError("");
    setPage(1);
    setStep(2);
  };

  // 브랜드를 선택하면 모델 조회 화면으로 넘어간다.
  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setModel("");
    setGrade("");
    setYear("");
    setCars([]);
    setError("");
    setPage(1);
    setStep(3);
  };

  // 연료구분 선택 화면으로 되돌아가는 함수
  const handleBackToFuelType = () => {
    setStep(1);
    setSelectedFuelType("");
    setSelectedBrand("");
    setCars([]);
    setError("");
    setPage(1);
  };

  // 브랜드 선택 화면으로 되돌아가는 함수
  const handleBackToBrand = () => {
    setStep(2);
    setSelectedBrand("");
    setCars([]);
    setError("");
    setPage(1);
  };

  // API 호출 후 공통적으로 사용할 결과 정리 함수
  // 배열화, 택시 제외, 연료구분 필터를 한 번에 처리한다.
  const cleanCars = (items, fuelType) => {
    const normalizedItems = Array.isArray(items) ? items : [items];

    return normalizedItems.filter(
      (car) => !isTaxiModel(car) && matchesFuelType(fuelType, car)
    );
  };

  // 자동차 목록을 조회하는 함수
  const fetchCars = async (pageNumber) => {
    try {
      setLoading(true);
      setError("");
      setCars([]);

      // 공공데이터 API 요청 파라미터를 구성한다.
      const params = new URLSearchParams({
        serviceKey:
          "780866664e85d6cfdc3d110bcd33324a280b2360dfabe3e1321f57ce0144149a",
        pageNo: pageNumber,
        numOfRows: 100,
        apiType: "JSON",
      });

      // 선택된 검색 조건이 있을 때만 파라미터에 추가한다.
      if (selectedBrand) params.append("q1", selectedBrand);
      if (model) params.append("q2", model);
      if (grade) params.append("q3", grade);
      if (year) params.append("q4", year);

      const response = await fetch(`/api/cars?${params}`);

      if (!response.ok) {
        throw new Error("조회 실패");
      }

      const data = await response.json();
      const items = data?.response?.body?.items?.item || [];

      setCars(cleanCars(items, selectedFuelType));
      setPage(pageNumber);
    } catch (err) {
      console.error(err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 비교용 차량 1대를 찾는 함수
  // 비교는 브랜드만 API에 보내고, 모델명은 프론트에서 널널하게 찾는다.
  const fetchCompareCar = async (brand, modelName) => {
    const params = new URLSearchParams({
      serviceKey:
        "780866664e85d6cfdc3d110bcd33324a280b2360dfabe3e1321f57ce0144149a",
      pageNo: 1,
      numOfRows: 100,
      apiType: "JSON",
    });

    if (brand) params.append("q1", brand);

    const response = await fetch(`/api/cars?${params}`);

    if (!response.ok) {
      throw new Error("비교 조회 실패");
    }

    const data = await response.json();
    const items = data?.response?.body?.items?.item || [];
    const filteredCars = cleanCars(items, selectedFuelType);
    const inputModelName = normalizeText(modelName);

    return (
      filteredCars.find((car) =>
        normalizeText(car.MODEL_NM).includes(inputModelName)
      ) || null
    );
  };

  // 비교 버튼을 눌렀을 때 실행되는 함수
  const handleCompare = async () => {
    try {
      // 비교에 필요한 입력값이 모두 있는지 확인한다.
      if (
        !leftCompareBrand.trim() ||
        !leftCompareModel.trim() ||
        !rightCompareBrand.trim() ||
        !rightCompareModel.trim()
      ) {
        alert("비교할 두 차량의 브랜드와 모델명을 모두 입력해주세요.");
        return;
      }

      setCompareLoading(true);
      setCompareError("");
      setLeftCompareCar(null);
      setRightCompareCar(null);

      const [leftCar, rightCar] = await Promise.all([
        fetchCompareCar(leftCompareBrand, leftCompareModel),
        fetchCompareCar(rightCompareBrand, rightCompareModel),
      ]);

      if (!leftCar && !rightCar) {
        setCompareError("비교할 차량 정보를 찾지 못했습니다.");
      }

      setLeftCompareCar(leftCar);
      setRightCompareCar(rightCar);
    } catch (err) {
      console.error(err);
      setCompareError("비교 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setCompareLoading(false);
    }
  };

  // 조회 버튼을 누르면 1페이지부터 다시 조회한다.
  const handleSearch = () => fetchCars(1);

  // 페이지 버튼을 누르면 해당 페이지를 조회한다.
  const handlePageChange = (pageNumber) => fetchCars(pageNumber);

  return (
    <div className="container">
      <h1>자동차 표시연비 조회</h1>

      {step === 1 && (
        <div>
          <div className="compare-section">
            <h2>자동차 조회</h2>
            <FuelTypeSelect onSelectFuelType={handleFuelTypeSelect} />
          </div>

          <CompareSection
            title="자동차 비교"
            leftCompareBrand={leftCompareBrand}
            setLeftCompareBrand={setLeftCompareBrand}
            leftCompareModel={leftCompareModel}
            setLeftCompareModel={setLeftCompareModel}
            rightCompareBrand={rightCompareBrand}
            setRightCompareBrand={setRightCompareBrand}
            rightCompareModel={rightCompareModel}
            setRightCompareModel={setRightCompareModel}
            onCompare={handleCompare}
            compareLoading={compareLoading}
            compareError={compareError}
            leftCompareCar={leftCompareCar}
            rightCompareCar={rightCompareCar}
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="selected-brand-box">
            <p>선택한 구분: {selectedFuelType}</p>
            <button onClick={handleBackToFuelType}>연료 구분 다시 선택</button>
          </div>

          <BrandSearch onSelectBrand={handleBrandSelect} />
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="selected-brand-box">
            <p>
              선택한 구분: {selectedFuelType} / 선택한 브랜드: {selectedBrand}
            </p>

            <div className="selected-brand-actions">
              <button onClick={handleBackToFuelType}>연료 구분 다시 선택</button>
              <button onClick={handleBackToBrand}>브랜드 다시 선택</button>
            </div>
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