import useTheme from "@/stores/ThemeStore";
import toast from "react-hot-toast";

interface IToast {
  type: "success" | "loading" | "error";
  message: string;
}
export const FireToast = ({ type, message }: IToast) => {
  const theme = useTheme.getState().theme;

  return toast[type](message, {
    style: {
      backgroundColor: theme === "dark" ? "#1d232a" : undefined,
      color: theme === "dark" ? "#a6adbb" : undefined,
      border: theme === "dark" ? "1px solid  #a6adbb" : undefined,
    },
  });
};
