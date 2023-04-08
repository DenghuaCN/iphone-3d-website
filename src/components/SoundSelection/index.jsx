import React from 'react';

const SoundSelection = () => {

  const handleLearnMore = () => {
    // const element = document.querySelector('.display-section');
    // window.scrollTo({
    //   top: element.getBoundingClientRect().bottom,
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
    <div className="sound-section wrapper">
      <div className="body">
        <div className="sound-section-content content">
          <h2 className="title">New Sound System</h2>
          <p className="text">Tell the base.</p>
          <span className="description">
            From $41.62/mo. for 24 mo. or $999 before train-in
          </span>
          <ul className="links">
            <li>
              <button className="button" onClick={handleLearnMore}>Click Me</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SoundSelection;