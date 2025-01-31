import { useNavigate } from "react-router-dom";
import { isEmail, useForm } from "@mantine/form";
import { Button, Errors, Input } from "@tableflowhq/ui-library";
import useSendPasswordResetEmail from "../../../api/useSendPasswordResetEmail";
import style from "../style/Form.module.scss";

export default function PasswordResetSendEmail() {
  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: isEmail("Invalid email"),
    },
  });

  const { mutate, isLoading, error, isSuccess } = useSendPasswordResetEmail();

  const onSubmit = (values: any) => {
    mutate(values);
  };

  const navigate = useNavigate();

  if (isSuccess) {
    return (
      <div className={style.container}>
        <h2 className={style.title}>Reset Password</h2>
        <p role="heading" className={style.intro}>
          Request received successfully! If an account with the provided email address exists, you'll receive and email with a reset link soon.
        </p>
        <div className={style.actions}>
          <Button type="submit" variants={["primary", "noMargin", "fullWidth"]} className={style.button} onClick={() => navigate("/")}>
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={style.container}>
      <div className={style.top}>
        <h2>Reset Password</h2>

        <p role="heading" className={style.intro}>
          Enter your email address to reset your password
        </p>
      </div>

      <form onSubmit={form.onSubmit(onSubmit)} aria-disabled={isLoading}>
        <Input label="Email" placeholder="your@email.com" name="email" {...form.getInputProps("email")} required />

        <div className={style.actions}>
          <Button type="submit" variants={["primary", "noMargin", "fullWidth"]} className={style.button} disabled={isLoading}>
            {isLoading ? "Please Wait" : "Send Reset Email"}
          </Button>
        </div>

        <Errors error={error} />
      </form>
    </div>
  );
}
