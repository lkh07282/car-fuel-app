// 로딩, 에러, 결과 없음 메시지를 출력하는 컴포넌트

function StatusMessage({ loading, error, cars }) {
  if (loading) {
    return <p className="status-text">불러오는 중...</p>;
  }

  if (error) {
    return <p className="status-text">{error}</p>;
  }

  if (cars.length === 0) {
    return <p className="status-text">조회 결과가 없습니다.</p>;
  }

  return null;
}

export default StatusMessage;