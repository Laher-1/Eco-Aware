import React from "react";
import "./About.css";
import founderImg from "../assets/founder.png";
import devImg from "../assets/developer.png";
import coordImg from "../assets/coordinator.png";


function About() {
  return (
    <div className="about-container">
      
      {/* Hero Section */}
      <section className="about-hero">
        <h1>About Us</h1>
        <p>Creating awareness for a sustainable future 🌱</p>
      </section>

      {/* Content Section */}
      <section className="about-content">
        <div className="about-text">
          <h2>Who We Are</h2>
          <p>
            EcoAware is a sustainability awareness platform focused on helping
            individuals understand their environmental impact. We provide tools
            like carbon footprint calculators and organize cleanup drives.
          </p>
        </div>

        <div className="about-text">
          <h2>Our Mission</h2>
          <p>
            Our mission is to make sustainability simple and actionable. We aim
            to empower people with knowledge and tools to reduce their carbon
            footprint.
          </p>
        </div>

        <div className="about-text">
          <h2>What We Do</h2>
          <ul>
            <li>🌍 Carbon Footprint Calculator</li>
            <li>🧹 Cleanup Drives</li>
            <li>📢 Awareness Campaigns</li>
            <li>🤝 Community Engagement</li>
          </ul>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <h2>Our Team</h2>
        <div className="team-container">
          <div className="team-card">
            <img src={founderImg} alt="Founder" />
            <h3>Member Name</h3>
            <p>Founder</p>
          </div>

          <div className="team-card">
            <img src={devImg} alt="Developer" />
            <h3>Member Name</h3>
            <p>Developer</p>
          </div>

          <div className="team-card">
            <img src={coordImg} alt="Coordinator" />
            <h3>Member Name</h3>
            <p>Coordinator</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="about-footer">
        <p>© 2026 EcoAware | All Rights Reserved</p>
      </section>

    </div>
  );
}

export default About;