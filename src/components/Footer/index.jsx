import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({triggerPreview}) => {

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className="footer-section wrapper">
      <div className="body">
        <div className="footer-section content">

          <div className="box">
            <h2 className="common-title chip big">A15 Bionic chip</h2>
            <p className="common-text chip">Fast that lasts !</p>
            <span className="description">
              iPhone 14 has the same incredible chip.
            </span>
          </div>

          <div className="box">
            <h2 className="common-title battery middle">Battery</h2>
            <p className="common-text battery">The looongest</p>
            <span className="description">
              battery life on any iPhone.Ever
            </span>
          </div>

          <div className="box">
            <h2 className="common-title glass small">Glass</h2>
            <p className="common-text glass">Ceramic Shield</p>
            <span className="description">
              Tougher than any smartphone glass.
            </span>
          </div>

          <ul className="links">
            <li>
              <button className="button try-me" onClick={triggerPreview}>Preview Mode</button>
            </li>
            <li>
              <button className="back-button" onClick={handleScrollToTop}>top</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

Footer.propTypes = {
  triggerPreview: PropTypes.func
};


export default Footer;