import config from "../config";
import AuthService from "./AuthService";
import HTTPService from "./HTTPService";

const PotonganDetailService = {};
const CONFIG_HTTP = {
    headers: {
        "x-access-token": AuthService.getToken(),
    },
};

PotonganDetailService.list = (query) => {
    CONFIG_HTTP.params = query;
    return HTTPService.get(`/potongandetail`, CONFIG_HTTP);
};

PotonganDetailService.get = (ID_gaji) => {
    CONFIG_HTTP.params = null;
    return HTTPService.get(
        `/potongandetail/${ID_gaji}`,
        CONFIG_HTTP
    );
};
PotonganDetailService.create = (potongandetail) => {
    return HTTPService.post(`/potongandetail`, potongandetail, CONFIG_HTTP);
};



export default PotonganDetailService;
