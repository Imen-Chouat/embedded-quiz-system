import React from "react";
import './AboutUs.css'
const AboutUs = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <p className="pk" style={styles.description}>
            A teacher-first quiz platform that empowers educators to create engaging, customizable quizzes with multimedia, host them offline via Raspberry Pi for seamless student access, and instantly analyze results with intuitive dashboards to track performance and improve learning outcomes.
          </p>
        </div>

        <div style={styles.section}>
          <h3>Company</h3>
          <ul style={styles.list}>
            <li>About Us</li>
            <li>How it Works?</li>
            <li>Popular Courses</li>
            <li>Services</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h3>Support</h3>
          <ul style={styles.list}>
            <li>FAQ</li>
            <li>Help Center</li>
            <li>Careers</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h3>Contact Info</h3>
          <ul style={styles.list}>
            <li> +315 5573 73379</li>
            <li> Kuizu@jesi.dz</li>
            <li> 4808 Skinner Hollow Road, Days Creek, OR 97429</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#EDF2FA",
    color: "#333",
    padding: "40px 0",
    marginTop: "40px",
  },
  container: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    maxWidth: "1200px",
    margin: "auto",
    padding: "0 20px",
  },
  section: {
    flex: "1",
    padding: "10px 20px",
    minWidth: "200px",
  },
  description: {
    maxWidth: "400px",
    lineHeight: "1.6",
    fontSize: "14px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    lineHeight: "1.8",
    fontSize: "14px",
  },
};

export default AboutUs;
