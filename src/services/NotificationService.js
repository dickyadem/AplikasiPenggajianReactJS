import HTTPService from "./HTTPService";

const NotificationService = {};

NotificationService.list = () => {
    return HTTPService.get(`/notifications`);
};

NotificationService.markAsRead = (id) => {
    return HTTPService.patch(`/notifications/${id}/read`);
};

NotificationService.markAllAsRead = () => {
    return HTTPService.patch(`/notifications/read-all`);
};

export default NotificationService;
