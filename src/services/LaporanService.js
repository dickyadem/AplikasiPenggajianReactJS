import { helperHandlerExportResponse } from "../utils/helpers";
import HTTPService from "./HTTPService";

const ReportingService = {};

ReportingService.reportListGaji = (data) => {
    return new Promise((resolve, reject) => {
        HTTPService({
            url: `/gaji/gaji-excel`,
            method: "POST",
            responseType: "blob",
            data,
        })
            .then((response) => {
                helperHandlerExportResponse(response, resolve, "LAPORAN-GAJI");
            })
            .catch((error) => {
                reject(error);
            });
    });
};

ReportingService.reportPPh = (data) => {
    return new Promise((resolve, reject) => {
        HTTPService({
            url: `/gaji/pph-excel`,
            method: "POST",
            responseType: "blob",
            data,
        })
            .then((response) => {
                helperHandlerExportResponse(response, resolve, "LAPORAN-PPH");
            })
            .catch((error) => {
                reject(error);
            });
    });
};

ReportingService.reportBPJS = (data) => {
    return new Promise((resolve, reject) => {
        HTTPService({
            url: `/gaji/bpjs-excel`,
            method: "POST",
            responseType: "blob",
            data,
        })
            .then((response) => {
                helperHandlerExportResponse(response, resolve, "LAPORAN-BPJS");
            })
            .catch((error) => {
                reject(error);
            });
    });
};

ReportingService.reportslipgaji = (ID_Gaji, data) => {
    return new Promise((resolve, reject) => {
        HTTPService({
            url: `/gaji/${ID_Gaji}/slip-excel`,
            method: "POST",
            responseType: "blob",
            data,
        })
            .then((response) => {
                helperHandlerExportResponse(response, resolve, "SLIP-GAJI");
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export default ReportingService;
