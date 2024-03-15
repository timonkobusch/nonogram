import { IoLogoGithub, IoMdHelpCircle, IoMdTrophy } from "react-icons/io";
import Help from "../Help/Help";
import "./AppHeader.scss";
import { useState } from "react";
import Records from "components/Records/Records";

const AppHeader = () => {
    const [showHelp, setShowHelp] = useState(false);
    const [showRecord, setShowRecord] = useState(false);
    return (
        <div className="App-header" id="Header">
            <div>nonogramm</div>
            <div className="buttonContainer">
                <div onClick={() => setShowHelp(!showHelp)}>
                    <IoMdHelpCircle size={"50px"} color="rgb(71, 71, 71)" />
                </div>
                |
                <div onClick={() => setShowRecord(!showRecord)}>
                    <IoMdTrophy size={"50px"} color="rgb(71, 71, 71)" />
                </div>
                |
                <a
                    href="https://github.com/timonkobusch/nonogram"
                    target="_blank"
                >
                    <IoLogoGithub size={"50px"} />
                </a>
            </div>

            {showHelp && <Help handleAbort={() => setShowHelp(false)} />}
            {showRecord && <Records handleAbort={() => setShowRecord(false)} />}
        </div>
    );
};

export default AppHeader;
