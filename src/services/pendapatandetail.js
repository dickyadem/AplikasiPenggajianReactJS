import config from "../config";
import AuthService from "./AuthService";
import HTTPService from "./HTTPService";

const PendapatanDetailService = {};
const CONFIG_HTTP = {
    headers: {
        "x-access-token": AuthService.getToken(),
    },
};

PendapatanDetailService.list = (query) => {
    CONFIG_HTTP.params = query;
    return HTTPService.get(`/pendapatandetail`, CONFIG_HTTP);
};

PendapatanDetailService.get = (ID_gaji) => {
    CONFIG_HTTP.params = null;
    return HTTPService.get(
        `/pendapatandetail/${ID_gaji}`,
        CONFIG_HTTP
    );
};
PendapatanDetailService.create = (pendapatandetail) => {
    return HTTPService.post(`/pendapatandetail`, pendapatandetail, CONFIG_HTTP);
};



export default PendapatanDetailService;
