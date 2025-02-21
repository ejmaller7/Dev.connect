import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { useUser } from "../context/Auth.jsx"; 
import '../css/Footer.css';

const Footer = () => {
  const { isAuthenticated } = useUser(); 

  // If the user is not authenticated, don't render the footer
  if (!isAuthenticated) {
    return null;
  }

  return (
    <footer className="footer">
      {/* Ethan Footer */}
      <div className="developer developer-ethan">
        <h1 className="developer-name">Ethan Maller</h1>
        <div className="social-links">
          <a
            href="https://github.com/ejmaller7"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <FontAwesomeIcon icon={faGithub} size="2x" />
          </a>
          <a
            href="https://www.linkedin.com/in/ethan-maller/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <FontAwesomeIcon icon={faLinkedin} size="2x" />
          </a>
          <a
            href="https://x.com/ejmaller7"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </a>
        </div>
      </div>

      {/* Justin Footer */}
      <div className="developer developer-justin">
        <h1 className="developer-name">Justin Miller</h1>
        <div className="social-links">
          <a
            href="https://github.com/JPMill"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <FontAwesomeIcon icon={faGithub} size="2x" />
          </a>
          <a
            href="https://www.linkedin.com/in/justin-miller-05047b293/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <FontAwesomeIcon icon={faLinkedin} size="2x" />
          </a>
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </a>
        </div>
      </div>

      {/* Brian Footer */}
      <div className="developer developer-brian">
        <h1 className="developer-name">Brian Solano</h1>
        <div className="social-links">
          <a
            href="https://github.com/brolano"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <FontAwesomeIcon icon={faGithub} size="2x" />
          </a>
          <a
            href="https://www.linkedin.com/in/brian-solano-214751343/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <FontAwesomeIcon icon={faLinkedin} size="2x" />
          </a>
          <a
            href="https://x.com/ejmaller7"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

