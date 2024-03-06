import { IoLogoGithub } from 'react-icons/io';
import './AppHeader.scss';

const AppHeader = () => {
    return (
        <div className="App-header">
            <div>nonogramm</div>
            <a href="https://github.com/timonkobusch/nonogram-react-vite" target="_blank">
                <IoLogoGithub size={'50px'} />
            </a>
        </div>
    );
};

export default AppHeader;
