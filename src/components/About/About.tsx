import './About.scss';
import viteIcon from 'assets/vite.svg';
import reactIcon from 'assets/react.svg';
import typescriptIcon from 'assets/typescript.svg';
import sassIcon from 'assets/sass.svg';

const About = () => {
    return (
        <div className="About container">
            <h1>About</h1>
            <p>made by Timon Kobusch</p>
            <div className="iconContainer">
                <a href="https://vitejs.dev/" target="_blank">
                    <img src={viteIcon} alt="vite" />
                </a>
                <a href="https://reactjs.org/" target="_blank">
                    <img src={reactIcon} alt="react" />
                </a>
                <a href="https://www.typescriptlang.org/" target="_blank">
                    <img src={typescriptIcon} alt="typescript" />
                </a>
                <a href="https://sass-lang.com/" target="_blank">
                    <img src={sassIcon} alt="sass" />
                </a>
            </div>
        </div>
    );
};

export default About;
