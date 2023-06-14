const helperDuplicatedInArrayObject = (item, by, array) => {
    let isDuplicate = false;
    for (let obj of array) {
        if (item[by] === obj[by]) {
            isDuplicate = true;
        }
    }

    return isDuplicate;
};

const helperReadableCurrency = (num) => {
    let n = parseInt(num).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
    });
    return n;
};
const helperHandlerExportResponse = (response, resolve, filename) => {
    const href = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("donwload", `${filename}-${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    resolve(true);
};
const helperHandleZero = (name, value, index, values, key) => {
    const result = [...values];
    if (value * result[index][key] <= 0) {
        alert("Jumlah pembelian jangan sampai 0");
    } else {
        result[index].subtotal = value * result[index][key];
        result[index][name] = parseInt(value);
    }

    return result;
};

const helperReadableDate = (date) => {
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    let d = new Date(Date.parse(date));
    return d.toLocaleDateString("id-ID", {
        timeZone: "Asia/Jakarta",
        ...options,
    });
};

export {
    helperReadableCurrency,
    helperDuplicatedInArrayObject,
    helperHandlerExportResponse,
    helperReadableDate,
    helperHandleZero,
};