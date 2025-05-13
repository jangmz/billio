"use client";

export default function ModalCard({ icon, title, modalName, content }) {
    // open dialog
    function handleOpen() {
        document.getElementById(`${modalName}_modal`).showModal();
    }

    return (
        <>
            <div 
                className="card shadow-md transition-shadow rounded-box bg-primary text-primary-content hover:cursor-pointer hover:shadow-lg" 
                onClick={handleOpen}
            >
                <div className="card-body flex-row gap-0 justify-center items-center">
                    <p className="text-2xl font-bold">{icon}</p>
                    <p className="text-2xl font-bold">{title}</p>
                </div>
            </div>
            <dialog id={`${modalName}_modal`} className="modal">
                <div className="modal-box">
                    {content}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
        </>
    )
}
