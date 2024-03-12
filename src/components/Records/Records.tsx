import { IoIosCloseCircleOutline } from "react-icons/io";
import { loadRecords } from "components/utils/recordHandler";
import "./Records.scss";
import { useEffect } from "react";

const Records = ({ handleAbort }: { handleAbort: () => void }) => {
    useEffect(() => {
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                handleAbort();
            }
        });
    });
    const records = loadRecords();
    return (
        <div className="recordPopup">
            <div className="recordContainer">
                <div className="closeButton" onClick={handleAbort}>
                    <IoIosCloseCircleOutline size={"30px"} />
                </div>
                <h1>Records</h1>
                <div className="recordList">
                    {records.length === 0 ? (
                        <p>No records yet</p>
                    ) : (
                        records.map((record, index) => (
                            <p key={index}>
                                {record.grid} - {record.time} seconds
                            </p>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Records;
