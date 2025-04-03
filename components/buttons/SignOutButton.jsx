import { logout } from "@/_actions/authActions";
import Button from "./buttons/Button";

export default function SignOutButton() {
  return (
    <Button 
      text={"Sign out"}
      onClick={logout}
      btnStyle={"btn-primary"}
    />
  )
}
