var date = new Date();

function getDay() {
    return date.getDate();
}
function getMonth() {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let m = date.getMonth();
    return month[m];
}
function getYear() {
    return date.getFullYear();
}
function getTime() {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
export { getDay, getMonth, getYear, getTime }