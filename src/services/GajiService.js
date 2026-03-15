import HTTPService from "./HTTPService";
import { helperHandlerExportResponse } from "../utils/helpers";

const GajiService = {};

GajiService.list = (query) => {
    return HTTPService.get(`/gaji`, { params: query });
};

GajiService.create = (gaji) => {
    return HTTPService.post(`/gaji`, gaji);
};

GajiService.get = (ID_Gaji) => {
    return HTTPService.get(`/gaji/${ID_Gaji}`);
};

GajiService.ID_GajiPrint = (ID_Gaji) => {
    return new Promise((resolve, reject) => {
        HTTPService({
            url: `/gaji/${ID_Gaji}/slip-excel`,
            method: "POST",
            responseType: "blob",
        })
            .then((response) => {
                helperHandlerExportResponse(response, resolve, "GAJI");
            })
            .catch((error) => reject(error));
    });
};

GajiService.delete = (ID_Gaji) => {
    return HTTPService.delete(`/gaji/${ID_Gaji}`);
};

export default GajiService;
