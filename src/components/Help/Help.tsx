import { IoIosCloseCircleOutline } from "react-icons/io";
import "./Help.scss";
import { useEffect } from "react";
const Help = ({ handleAbort }: { handleAbort: () => void }) => {
    useEffect(() => {
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                handleAbort();
            }
        });
    }, [handleAbort]);
    return (
        <div className="helpPopup">
            <div className="helpContainer">
                <div className="closeButton" onClick={handleAbort}>
                    <IoIosCloseCircleOutline size={"30px"} />
                </div>
                <h1>Help</h1>
                <p>
                    nonogramm is a puzzle game where you have to{" "}
                    <strong>paint the fields according to the numbers</strong>{" "}
                    at the edge of the field.
                </p>
                <p>
                    The numbers indicate how many fields are to be painted in a
                    row or column.{" "}
                    <strong>
                        Each number represents a group of painted fields
                    </strong>
                    . The{" "}
                    <strong>
                        groups are separated by at least one empty field.
                    </strong>
                </p>
                <p>The game is over when all fields are painted correctly.</p>
                <p>
                    Press the <strong>'F' key</strong> to toggle between marking
                    mode and painting mode.
                </p>
                <p>Have fun!</p>
            </div>
        </div>
    );
};
export default Help;
