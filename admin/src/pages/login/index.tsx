import "./index.scss";
import ApiUser, { ILoginBody, IUser } from "@/api/ApiUser";
import FormGlobal, {
  FormItemGlobal,
  InputFormikGlobal,
  InputPasswordFormikGlobal,
} from "@/components/FormGlobal";
import { loginUser } from "@/redux/slices/UserSlice";
import { LoginValidation } from "@/utils/validation/login";
import { useMutation } from "@tanstack/react-query";
import { Button } from "antd";
import { Formik } from "formik";
import { useDispatch } from "react-redux";

export default function Login() {
  const dispatch = useDispatch();

  const loginMutation = useMutation(ApiUser.login);

  const handleLogin = (values: ILoginBody): void => {
    loginMutation.mutate(
      values,
      {
        onSuccess: (res: IUser) => {
          dispatch(loginUser({ ...res }));
          window.location.replace("/");
        },
      }
    );
  };

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={LoginValidation}
      onSubmit={handleLogin}
    >
      {({ handleSubmit }): JSX.Element => (
        <div className="login-page">
          <div className="login-card">
            <h2 className="text-center mb-3 text-3xl">LOGIN</h2>
            <FormGlobal onFinish={handleSubmit} className="container-sign-in">
              <FormItemGlobal name="username" label="Tài khoản" required>
                <InputFormikGlobal name="username" placeholder="Nhập tài khoản" />
              </FormItemGlobal>
              <FormItemGlobal name="password" label="Mật khẩu" required>
                <InputPasswordFormikGlobal
                  name="password"
                  placeholder="Nhập mật khẩu"
                />
              </FormItemGlobal>
              <Button
                className="mt-5 w-full"
                type="primary"
                onClick={() => handleSubmit()}
                loading={loginMutation.isLoading}
              >
                Đăng nhập
              </Button>
            </FormGlobal>
          </div>
        </div>
      )}
    </Formik>
  );
}
