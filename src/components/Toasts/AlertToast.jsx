import { toast } from "react-hot-toast";
import habitPiggyLogo from "../../assets/images/habit-piggy-logo.svg";

const AlertToast = (message) => {
  toast(message, {
    icon: <img src={habitPiggyLogo} alt="Habit Piggy Logo" style={{ width: "40px", height: "40px" }} />,
    style: {
      borderRadius: "16px",
      background: "#D14D28",
      color: "#fff",
    },
    duration: 3000,
  });
};

export default AlertToast;
