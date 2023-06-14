import { Pagination } from "react-bootstrap";

const Paginator = ({paginate, callbackPaginator}) => {
    return(
        <Pagination>
            <Pagination.First disabled={!paginate.prev} onClick={() => callbackPaginator(paginate.prev)}/>
            <Pagination.Last disabled={!paginate.next} onClick={() => callbackPaginator(paginate.next)}/>
        </Pagination>
    );
};


export default Paginator;
