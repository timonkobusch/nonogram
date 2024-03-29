// insert new record if not exists or if faster
export const insertRecord = (grid: string, time: number): boolean => {
    const records = loadRecords();
    const record = records.find((r) => r.grid === grid);
    if (!record || time < record.time) {
        const newRecords = records.filter((r) => r.grid !== grid);
        newRecords.push({ grid, time });
        localStorage.setItem("records", JSON.stringify(newRecords));
        console.log(records);
        return true;
    }
    return false;
};
// load array of records from local storage
export const loadRecords = (): { grid: string; time: number }[] => {
    const records: string | null = localStorage.getItem("records");
    if (records) {
        return JSON.parse(records).sort(
            (
                a: { grid: string; time: number },
                b: { grid: string; time: number }
            ) => a.time - b.time
        );
    }
    return [];
};
