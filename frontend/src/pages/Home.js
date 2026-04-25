import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1>🌿 Eco Aware 🌿</h1>
          <p>
            Small actions today can create a greener tomorrow. Learn sustainable habits and reduce your carbon footprint.
          </p>
          <a href="/register">
            <button className="hero-btn">Start Your Eco Journey</button>
          </a>
        </div>
      </div>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <h2>About Eco Aware</h2>
          <p>
            Eco Aware is your companion in the journey towards a sustainable lifestyle. Our platform provides tools and resources to help you track your environmental impact, participate in eco-friendly challenges, and join community cleanup drives. Together, we can make a difference for our planet.
          </p>
          <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09" alt="Sustainable living" className="about-image" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Our Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f" alt="Carbon Calculator" />
              <h3>Carbon Footprint Calculator</h3>
              <p>Calculate your daily carbon emissions and get personalized tips to reduce them.</p>
              <a href="/calculator" className="feature-link">Try Calculator</a>
            </div>
            <div className="feature-card">
              <img src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3" alt="Eco Challenges" />
              <h3>Eco Challenges</h3>
              <p>Participate in fun challenges to adopt sustainable habits and earn rewards.</p>
              <a href="/challenges" className="feature-link">View Challenges</a>
            </div>
            <div className="feature-card">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64" alt="Cleanup Drives" />
              <h3>Cleanup Drives</h3>
              <p>Join or organize community cleanup events to keep our environment clean.</p>
              <a href="/CleanupDrive" className="feature-link">Join Drive</a>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Tips Section */}
      <section className="tips">
        <div className="container">
          <h2>Sustainability Tips</h2>
          <div className="tips-grid">
            <div className="tip">
              <h3>Reduce, Reuse, Recycle</h3>
              <p>Minimize waste by reducing consumption, reusing items, and recycling materials.</p>
            </div>
            <div className="tip">
              <h3>Conserve Energy</h3>
              <p>Turn off lights, unplug electronics, and use energy-efficient appliances.</p>
            </div>
            <div className="tip">
              <h3>Go Green Transport</h3>
              <p>Walk, cycle, or use public transport to reduce carbon emissions from vehicles.</p>
            </div>
            <div className="tip">
              <h3>Eat Sustainably</h3>
              <p>Choose local, seasonal foods and reduce meat consumption for a lower environmental impact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Make a Change?</h2>
          <p>Join thousands of eco-conscious individuals making a positive impact on our planet.</p>
          <a href="/register">
            <button className="cta-btn">Join Eco Aware Today</button>
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;