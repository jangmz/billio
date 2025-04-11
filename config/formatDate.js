export function formatDate(date) {
    const timestamp = new Date(date);
    const formatedDate = timestamp.getDate() + ". " + (timestamp.getMonth() + 1) + ". " + timestamp.getFullYear();
    return formatedDate;
}

export function formatDateWithTime(date) {
    const timestamp = new Date(date);
    const formatedDate = timestamp.getDate() + ". " + (timestamp.getMonth() + 1) + ". " + timestamp.getFullYear() + " (" + timestamp.getHours() + ":" + timestamp.getMinutes() + ")";
    return formatedDate;
}