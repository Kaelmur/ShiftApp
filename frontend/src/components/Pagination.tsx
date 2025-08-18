interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  setCurrentPage: (page: number) => void;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  itemsPerPage,
  totalItems,
  setCurrentPage,
  currentPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginate = (pageNumber: number, e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage(pageNumber);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to get visible page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // how many numbers around current page

    if (totalPages <= 7) {
      // If few pages, show all
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      // Show left ellipsis
      if (currentPage > maxVisible - 1) {
        pages.push("...");
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Show right ellipsis
      if (currentPage < totalPages - (maxVisible - 2)) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center mt-6">
      <ul className="flex space-x-2 items-center">
        {/* Prev button */}
        <li>
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-md border transition-colors cursor-pointer ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {`<`}
          </button>
        </li>

        {getPageNumbers().map((number, idx) =>
          number === "..." ? (
            <li key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500">
              ...
            </li>
          ) : (
            <li key={number}>
              <button
                onClick={(e) => paginate(number as number, e)}
                className={`px-4 py-2 rounded-md border transition-colors cursor-pointer ${
                  currentPage === number
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {number}
              </button>
            </li>
          )
        )}

        {/* Next button */}
        <li>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-md border transition-colors cursor-pointer ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {`>`}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
