export default function DeleteBillButton({ icon, billId, apiUrl, sessionToken, onDeleteBill }) {
    async function handleDelete() {
        if(!confirm("Are you sure you want to delete this residence?")) {
            return;
        }

        //console.log(`Delete bill with ID: ${billId}`);

        try {
            // send request
            const response = await fetch(`${apiUrl}/bills/${billId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `authjs.session-token=${sessionToken}`
                }
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || "Unknown error when deleting data");
            }

            // callback to update data in parent component
            onDeleteBill(billId);
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to delete selected bill");
        }
    }
    
    return (
        <button type="button" onClick={handleDelete} className="btn btn-outline btn-error btn-xs">
            {icon}
        </button>
    )
}
