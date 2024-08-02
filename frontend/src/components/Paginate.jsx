import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ pages, page, role, keyword = '', currentPath = '' }) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => {
          const pageNumber = x + 1;
          let path = '';

          if (role === 'admin') {
            path = keyword ? `/bookings/search/${keyword}/page/${pageNumber}` : `/bookings/page/${pageNumber}`;
          } else {
            if (currentPath && currentPath.includes('/myorders')) {
              path = `/myorders/page/${x + 1}`;
            } else if (currentPath && currentPath.includes('/myloads')) {
              path = `/myloads/page/${x + 1}`;
            } else {
              path = `/myorders/page/${x + 1}`; // Default path for non-admin users
            }
          }

          return (
            <LinkContainer key={x + 1} to={path}>
              <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
            </LinkContainer>
          );
        })}
      </Pagination>
    )
  );
};

export default Paginate