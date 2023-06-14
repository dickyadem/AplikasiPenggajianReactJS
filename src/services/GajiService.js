import config from "../config";
import AuthService from "./AuthService";
import HTTPService from "./HTTPService";

const GajiService = {};
const CONFIG_HTTP = {
    headers: {
        "x-access-token": AuthService.getToken(),
    },
};

GajiService.list = (query) => {
    CONFIG_HTTP.params = query;
    return HTTPService.get(`${config.BASE_URL}/gaji`, CONFIG_HTTP);
};

GajiService.create = (gaji) => {
    return HTTPService.post(`${config.BASE_URL}/gaji`, gaji, CONFIG_HTTP);
};

GajiService.get = (ID_Gaji) => {
    CONFIG_HTTP.params = null;
    return HTTPService.get(
        `${config.BASE_URL}/gaji/${ID_Gaji}`,
        CONFIG_HTTP
    );
};

GajiService.edit = (ID_Gaji, gaji) => {
    CONFIG_HTTP.params = null;
    return HTTPService.put(
        `${config.BASE_URL}/gaji/${ID_Gaji}`,
        gaji,
        CONFIG_HTTP
    );
};

GajiService.delete = (ID_Gaji) => {
    CONFIG_HTTP.params = null;
    return HTTPService.delete(
        `${config.BASE_URL}/gaji/${ID_Gaji}`,
        CONFIG_HTTP
    );
};

export default GajiService;
