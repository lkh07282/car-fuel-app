// 1페이지부터 3페이지까지 이동하는 버튼 컴포넌트

function PageButtons({ currentPage, onPageChange }) {
  return (
    <div className="page-section">
      <div className="page-buttons">
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
          1페이지
        </button>
        <button onClick={() => onPageChange(2)} disabled={currentPage === 2}>
          2페이지
        </button>
        <button onClick={() => onPageChange(3)} disabled={currentPage === 3}>
          3페이지
        </button>
      </div>

      <p className="page-info">현재 페이지: {currentPage}</p>
    </div>
  );
}

export default PageButtons;