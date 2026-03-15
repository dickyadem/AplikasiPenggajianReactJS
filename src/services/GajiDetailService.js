import HTTPService from "./HTTPService";

const GajiDetailService = {};

GajiDetailService.list = (query) => {
  return HTTPService.get(`/gajidetail`, { params: query });
};

GajiDetailService.get = (ID_gaji) => {
  return HTTPService.get(`/gajidetail/${ID_gaji}`);
};

GajiDetailService.create = (gajidetail) => {
  return HTTPService.post(`/gajidetail`, gajidetail);
};

export default GajiDetailService;
