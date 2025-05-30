import Button from "../buttons/Button";

import { loginGitHub, loginGoogle } from "@/_actions/authActions";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";

export default function LogInProviders() {
    return (
        <div className="flex flex-col gap-3">
            <Button 
                icon={<FaGoogle />}
                text={"Log in with Google"}
                btnStyle={"btn-primary"}
                onClick={loginGoogle}
            />
            {/*<Button 
                text="Log in with GitHub"
                icon={<FaGithub />}
                btnStyle={"btn-primary"}
                onClick={loginGitHub}
            />*/}
        </div>
    );
}