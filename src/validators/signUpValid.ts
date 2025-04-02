import * as yup from "yup";

const signUpValid = yup.object().shape({
  userName: yup
    .string()
    .lowercase()
    .required("User name is required")
    .min(5, "User name must be longer than 4 characters"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
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
  comfirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export default signUpValid;
