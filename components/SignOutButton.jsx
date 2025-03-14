import { logout } from "@/_actions/authActions";

export default function SignOutButton() {
  return (
    <button onClick={logout}>Sign Out</button>
  )
}
