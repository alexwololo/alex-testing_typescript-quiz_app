import React from "react";

type NotificationProps = {
    message: string;
    error: boolean;
};
function Notification({ message, error }: NotificationProps) {
    return <div className={`notification ${error ? "error" : "success"}`}>{message}</div>;
}

export default Notification;
