import { useState } from "react";
import { Link } from "react-router-dom";
import { isEmail, useForm } from "@mantine/form";
import { Button, capitalize, Errors, Input, Modal, Tableflow, useModal, usePassword, useThemeStore, validatePassword } from "@tableflowhq/ui-library";
import NoPassword from "../../messages/NoPassword";
import oauthSignInUpHandler from "../../../api/oauthSignInUpHandler";
import useLogin from "../../../api/useLogin";
import style from "../style/Form.module.scss";

export default function Login() {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: isEmail("Invalid email"),
      password: (value) => (value && !validatePassword(value)[0] ? validatePassword(value)[1] : null),
    },
  });
  const { mutate, isLoading, error } = useLogin();
  const onSubmit = (values: any) => {
    mutate(values);
  };
  const passwordProps = usePassword();
  const modal = useModal();
  const theme = useThemeStore((state) => state.theme);
  const [isLoadingSSO, setIsLoadingSSO] = useState(false);
  const [ssoError, setSsoError] = useState("");

  return (
    <div className={style.container}>
      <div className={style.logo}>
        <Tableflow color size="big" />
      </div>

      <p role="heading" className={style.welcome}>
        Welcome back! Please enter your details.
      </p>

      <div className={style.oauthButtons}>
        {["google", "github"].map((provider) => {
          return (
            <Button
              key={provider}
              icon={provider as any}
              variants={["noFill", "fullWidth"]}
              disabled={isLoading || isLoadingSSO}
              onClick={() => {
                setIsLoadingSSO(true);
                oauthSignInUpHandler(provider).then((err) => {
                  if (err) {
                    setSsoError(err);
                    setIsLoadingSSO(false);
                  }
                });
              }}>
              Login with {capitalize(provider)}
            </Button>
          );
        })}
      </div>

      <div className={style.separator}>Or</div>

      <form onSubmit={form.onSubmit(onSubmit)} aria-disabled={isLoading || isLoadingSSO}>
        <fieldset disabled={isLoading || isLoadingSSO}>
          <Input label="Email" placeholder="your@email.com" name="email" {...form.getInputProps("email")} />

          <Input label="Password" name="password" {...form.getInputProps("password")} {...passwordProps}>
            <Link className={isLoading || isLoadingSSO ? style.disabledLink : ""} to="/auth/reset-password">
              Forgot password?
            </Link>
          </Input>
        </fieldset>

        <div className={style.actions}>
          <Button type="submit" variants={["primary", "fullWidth"]} className={style.button} disabled={isLoading || isLoadingSSO}>
            Login
          </Button>
        </div>

        <Errors error={error || ssoError} />
      </form>

      <p className={style.footer}>
        Don’t have an account?{" "}
        <Link className={isLoading || isLoadingSSO ? style.disabledLink : ""} to="/signup">
          Sign up
        </Link>
      </p>

      {modal.openDelayed && (
        <Modal {...modal}>
          <NoPassword handleClose={modal.handleClose} />
        </Modal>
      )}
    </div>
  );
}
