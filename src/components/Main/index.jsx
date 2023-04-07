import React from 'react';
import Iphone from '../../assets/images/iphone-14.jpg';
import HoldingIphone from '../../assets/images/iphone-hand.png';

const Main = () => {
  const handleScrollToMore = () => {
    const soundSection = document.querySelector('.sound-section');

    window.scrollTo({
      top: soundSection.getBoundingClientRect().top,
      left: 0,
      behavior: 'smooth'
    })
  };

  return (
    <div className='jumbotron-section wrapper'>
      <h2 className='title'>New</h2>
      <img src={Iphone} className='logo' alt="iPhone 14 Pro"  />
      <p className='text'>Big and bigger</p>

      <span className='description'>
        From $41.62/mo. for 24 mo. or $999 before trade-in
      </span>

      <ul className='links'>
        <li>
          <button className='button'>Buy</button>
        </li>
        <li>
          <a className='link' onClick={handleScrollToMore}>Learn More</a>
        </li>
      </ul>
      <img className='iphone-img' src={HoldingIphone} alt="iPhone" />
    </div>
  )
}

export default Main;