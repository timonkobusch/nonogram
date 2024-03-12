// insert new record if not exists or if faster
export const insertRecord = (grid: string, time: number): boolean => {
    const records = loadRecords();
    console.log(records);
    const record = records.find((r) => r.grid === grid);
    if (!record || time < record.time) {
        const newRecords = records.filter((r) => r.grid !== grid);
        newRecords.push({ grid, time });
        localStorage.setItem("records", JSON.stringify(newRecords));
        console.log(records);
        return true;
    }
    console.log(records);
    return false;
};
// load array of records from local storage
export const loadRecords = (): { grid: string; time: number }[] => {
    const records = localStorage.getItem("records");
    if (records) {
        return JSON.parse(records);
    }
    return [];
};
