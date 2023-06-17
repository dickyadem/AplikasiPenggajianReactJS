import config from "../config";
import AuthService from "./AuthService";
import HTTPService from "./HTTPService";
import { helperHandlerExportResponse } from "../utils/helpers";

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

GajiService.ID_GajiPrint = (ID_Gaji) => {
    CONFIG_HTTP.query = null;

    return new Promise((resolve, reject) => {
        HTTPService({
            url: `${config.BASE_URL}/gaji/${ID_Gaji}/slip-excel`,
            method: "POST",
            responseType: "blob",
            headers: CONFIG_HTTP.headers,
        })
            .then((response) => {
                helperHandlerExportResponse(response, resolve, "GAJI");
            })
            .catch((error) => reject(error));
    });
};


export default GajiService;
