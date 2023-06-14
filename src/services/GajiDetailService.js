import config from "../config";
import AuthService from "./AuthService";
import HTTPService from "./HTTPService";

const GajiDetailService = {};
const CONFIG_HTTP = {
    headers: {
        "x-access-token": AuthService.getToken(),
    },
};

GajiDetailService.list = (query) => {
    CONFIG_HTTP.params = query;
    return HTTPService.get(`${config.BASE_URL}/gajidetail`, CONFIG_HTTP);
};

GajiDetailService.get = (ID_gaji) => {
    CONFIG_HTTP.params = null;
    return HTTPService.get(
        `${config.BASE_URL}/gajidetail/${ID_gaji}`,
        CONFIG_HTTP
    );
};
GajiDetailService.create = (gajidetail) => {
    return HTTPService.post(`${config.BASE_URL}/gajidetail`, gajidetail, CONFIG_HTTP);
};



export default GajiDetailService;
