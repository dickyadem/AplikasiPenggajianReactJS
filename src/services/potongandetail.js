import HTTPService from "./HTTPService";

const PotonganDetailService = {};

PotonganDetailService.list = (query) => {
    return HTTPService.get(`/potongandetail`, { params: query });
};

PotonganDetailService.get = (ID_gaji) => {
    return HTTPService.get(`/potongandetail/${ID_gaji}`);
};

PotonganDetailService.create = (potongandetail) => {
    return HTTPService.post(`/potongandetail`, potongandetail);
};

export default PotonganDetailService;
