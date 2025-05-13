import Button from "../buttons/Button";
import FormFieldsetRequired from "./FormFieldsetRequired";
import FormTextareaRequired from "./FormTextareaRequired";

export default function ContactForm() {
    return (
        <div className="card w-full max-w-lg bg-base-100">
            <div className="card-body">
                <h2 className="card-title text-xl font-bold">Contact support</h2>
                <p className="text-sm text-gray-500">Need help? Fill out the form below to contact our support team</p>
                <form className="flex-flex-col gap-4">
                    <FormFieldsetRequired 
                        title={"Your name"}
                        type={"text"}
                        name={"name"}
                        id={"name"}
                        value={""} /* grab name from session */
                        style={"w-full"}
                        onChange={""}
                    />
                    <FormFieldsetRequired 
                        title={"Your email"}
                        type={"email"}
                        name={"email"}
                        id={"email"}
                        value={""} /* grab email from session */
                        style={"w-full"}
                        onChange={""}
                    />
                    <FormTextareaRequired 
                        title={"Describe your issue or question"}
                        name={"message"}
                    />
                    <Button 
                        text={"Submit"}
                        btnStyle={"btn-primary w-full"}
                        type={"submit"}
                        onClick={""}
                    />
                </form>
            </div>
        </div>
    )
}
