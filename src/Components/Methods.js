import Firebase from '../../Firebase';
export function GetCurrentDate(sp) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //As January is 0.
    var yyyy = today.getFullYear() + 543;

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return (mm + sp + dd + sp + yyyy);
}

export const isEmptyValue = (value) => {
    if (value === '' || value === null || value === undefined) {
        return true
    } else {
        return false
    }
}

