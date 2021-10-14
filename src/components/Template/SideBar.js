import React from 'react';
import { Link } from 'react-router-dom';

import ContactIcons from '../Contact/ContactIcons';

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const SideBar = () => (
  <section id="sidebar">
    <section id="intro">
      <Link to="/" className="logo">
        <img src={`${PUBLIC_URL}/images/me.jpg`} alt="" />
      </Link>
      <header>
        <h2>Rishabh Karajgi</h2>
        <p><a href="mailto:rishabh.karajgi@gmail.com">rishabh.karajgi@gmail.com</a></p>
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>Hi, I&apos;m Rishabh. I like building things.
        I am a <a href="https://icme.stanford.edu/">NIT Warangal CSE</a> graduate, ISB TEP student, and
        the ex Co-founder and CTO of <a href="https://arthena.com">Ebooth</a>. I was also
        at <a href="https://udaan.com">Udaan</a>
        , <a href="https://yellow.ai">Yellow.ai</a>
        , <a href="https://capitalfloat.com">Capital Float</a>
      </p>
      <ul className="actions">
        <li>
          {!window.location.pathname.includes('/resume') ? <Link to="/resume" className="button">Learn More</Link> : <Link to="/about" className="button">About Me</Link>}
        </li>
      </ul>
    </section>

    <section id="footer">
      <ContactIcons />
      <p className="copyright">&copy; Michael D&apos;Angelo <Link to="/">mldangelo.com</Link>.</p>
    </section>
  </section>
);

export default SideBar;
