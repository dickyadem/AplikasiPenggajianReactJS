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
    return HTTPService.get(`${config.BASE_URL}/potongandetail`, CONFIG_HTTP);
};

PotonganDetailService.get = (ID_gaji) => {
    CONFIG_HTTP.params = null;
    return HTTPService.get(
        `${config.BASE_URL}/potongandetail/${ID_gaji}`,
        CONFIG_HTTP
    );
};
PotonganDetailService.create = (potongandetail) => {
    return HTTPService.post(`${config.BASE_URL}/potongandetail`, potongandetail, CONFIG_HTTP);
};



export default PotonganDetailService;
