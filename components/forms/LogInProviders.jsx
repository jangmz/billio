import Button from "../buttons/Button";

import { loginGitHub } from "@/_actions/authActions";

export default function LogInProviders() {
    return (
        <div className="flex flex-col gap-3">
            <Button 
                text="Log in with GitHub"
                btnStyle={"btn-primary"}
                onClick={loginGitHub}
            />
            <Button 
                text={"Log in with Google"}
            />
        </div>
    );
}