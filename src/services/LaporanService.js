import config from "../config";
import { helperHandlerExportResponse } from "../utils/helpers";
import AuthService from "./AuthService";
import HTTPService from "./HTTPService";

const ReportingService = {};

ReportingService.reportListGaji = (data) => {
    return new Promise((resolve, reject) => {
        HTTPService({
            url: `/gaji/gaji-excel`,
            method: "POST",
            responseType: "blob",
            headers: {
                "x-access-token": AuthService.getToken(),
            },
            data,
        })
            .then((response) => {
                helperHandlerExportResponse(response, resolve, "REPORTING-PEMBELIAN");
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
            headers: {
                "x-access-token": AuthService.getToken(),
            },
            data,
        })
            .then((response) => {
                helperHandlerExportResponse(response, resolve, "REPORTING-PEMBELIAN");
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
            headers: {
                "x-access-token": AuthService.getToken(),
            },
            data,
        })
            .then((response) => {
                helperHandlerExportResponse(response, resolve, "REPORTING-PEMBELIAN");
            })
            .catch((error) => {
                reject(error);
            });
    });
};
ReportingService.reportslipgaji = (data) => {
    return new Promise((resolve, reject) => {
        HTTPService({
            url: `/gaji/:ID_Gaji/slip-excel`,
            method: "POST",
            responseType: "blob",
            headers: {
                "x-access-token": AuthService.getToken(),
            },
            data,
        })
            .then((response) => {
                helperHandlerExportResponse(response, resolve, "REPORTING-PEMBELIAN");
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export default ReportingService;

