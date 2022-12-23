import { useSelector } from "react-redux";
import { RootState } from "../../../interfaces/RootState";

function Notification() {
    const notification = useSelector((state: RootState) => state.notification);
    return (
        <div className={`notification ${notification.error ? "error" : "success"}`}>
            {notification.message}
        </div>
    );
}

export default Notification;
