import * as yup from "yup";

const resetPassWordValid = yup.object().shape({
  passWord: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#^]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
  comfirmPassWord: yup
    .string()
    .oneOf([yup.ref("passWord")], "Passwords must match")
    .required("Please confirm your password"),
});

export default resetPassWordValid;
