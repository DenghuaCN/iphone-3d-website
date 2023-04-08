import React from 'react';
// import PropTypes from 'prop-types';

const DisplaySection = () => {

  const handleScrollToFooter = () => {
    // const element = document.querySelector('.footer-section');
    // const topValue = element.getBoundingClientRect().bottom + element.getBoundingClientRect().height;
    // window.scrollTo({
    //   top: topValue,
    //   left: 0,
    //   behavior: 'smooth'
    // })
    window.scrollBy({
      top: window.innerHeight,
      left: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className="display-section wrapper">
      <h2 className="title">New</h2>
      <p className="text">Brilliant.</p>
      <span className="description">
        A display that&quot;s up to 2x brighter in the sun.
      </span>
      <button className="button" onClick={handleScrollToFooter}>Click Me</button>
    </div>
  )
}


export default DisplaySection;