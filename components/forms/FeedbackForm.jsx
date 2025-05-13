import Button from "../buttons/Button";
import FormFieldset from "./FormFieldset";
import FormTextareaRequired from "./FormTextareaRequired";

export default function ContactForm() {
    return (
        <div className="card w-full max-w-lg bg-base-100">
            <div className="card-body">
                <h2 className="card-title text-xl font-bold">Feedback & Suggestions</h2>
                <p className="text-sm text-gray-500">We value your feedback! Let us know how we can improve.</p>
                <form className="flex-flex-col gap-4">
                    <FormFieldset
                        title={"Your name (optional)"}
                        type={"text"}
                        name={"name"}
                        id={"name"}
                        value={""} /* grab name from session */
                        style={"w-full"}
                        onChange={""}
                    />
                    <FormTextareaRequired 
                        title={"Share your thoughts and suggestions"}
                        name={"message"}
                    />
                    <Button 
                        text={"Submit Feedback"}
                        btnStyle={"btn-primary w-full"}
                        type={"submit"}
                        onClick={""}
                    />
                </form>
            </div>
        </div>
    )
}
