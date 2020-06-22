import React, { useState, useCallback, useEffect } from 'react';
import { useWindowWidth } from '../../Hook';
import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear';
import styles from './Navbar.module.css';

const Menu = ({ setOpen, mobile = null }) => {
  const handleClick = useCallback(() => {
    setOpen(false)
  }, []); // eslint-disable-line 
  return (
    <div>
      <a href='#map' onClick={mobile && handleClick}>Cases</a>
      <a href='#history' onClick={mobile && handleClick}>Cases comparison</a>
    </div>
  );
};

const Navbar = () => {
  const windowWidth = useWindowWidth();
  const [open, setOpen] = useState(false);
  const [nav, setNav] = useState({ show: true, scroll: 0 });
  const mobileOpen = windowWidth < 600 && open;

  const handleOpen = useCallback(() => {
    setOpen(!open);
  }, [open]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.body.getBoundingClientRect().top
      setNav({
        scroll: scrollTop,
        show: scrollTop > nav.scroll,
      });
      setOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [nav.scroll]);

  return (
    <nav
      className={nav.show ? styles.active : styles.hidden}
      style={{
        height: mobileOpen && 112,
        flexDirection: mobileOpen && 'column',
      }}
    >
      <div className={styles.container}>
        <div>
          <img src={process.env.PUBLIC_URL + '/images/icon.png'} alt='logo' />
          <h3>Coronavirus Tracker</h3>
        </div>
        {windowWidth < 600 
          ? (<span onClick={handleOpen}>
              {open ? <ClearIcon /> : <MenuIcon />}
            </span>) 
          : (<Menu setOpen={setOpen} />)}
      </div>
      {open && (<Menu setOpen={setOpen} mobile />)}
    </nav>
  );
};

export default Navbar;