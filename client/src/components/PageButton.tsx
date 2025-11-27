interface PageButtonProps {
    page: number | '<' | '>';
    currentPage: number;
    onClick: () => void;
}

export const PageButton = ({ page, currentPage, onClick }: PageButtonProps) => {
    if (page === currentPage) {
        return (
            <button className="pagination-link is-current"
                aria-label={`Page ${page}`} aria-current="page">
                {page}
            </button>
        );
    }
    if (page === '<' || page === '>') {
        return (
            <span className="pagination-ellipsis">
                &hellip;
            </span>
        );
    }
    return (
        <button className="pagination-link" aria-label={`Go to page ${page}`}
            onClick={onClick}>
            {page}
        </button>
    );
}