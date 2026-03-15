import HTTPService from "./HTTPService";

const PendapatanDetailService = {};

PendapatanDetailService.list = (query) => {
    return HTTPService.get(`/pendapatandetail`, { params: query });
};

PendapatanDetailService.get = (ID_gaji) => {
    return HTTPService.get(`/pendapatandetail/${ID_gaji}`);
};

PendapatanDetailService.create = (pendapatandetail) => {
    return HTTPService.post(`/pendapatandetail`, pendapatandetail);
};

export default PendapatanDetailService;
