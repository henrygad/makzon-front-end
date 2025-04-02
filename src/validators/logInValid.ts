import * as yup from "yup";

const logInValid = yup.object().shape({
  identity: yup.string().lowercase().required("This field is required"),
  password: yup.string().required("Password is required"),
});

export default logInValid;
