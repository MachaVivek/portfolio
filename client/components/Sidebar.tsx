"use client";

import { useState } from "react";
import { portfolioData } from "@/data/portfolioData";

export default function Sidebar() {
  const [isActive, setIsActive] = useState(true);
  const { profile } = portfolioData;

  return (
    <aside className={`sidebar${isActive ? " active" : ""}`}>
      <div className="sidebar-info">
        <figure className="avatar-box">
          <img
            src={profile.avatar}
            alt={profile.name}
            width="80"
          />
        </figure>

        <div className="info-content">
          <h1 className="name" title={profile.name}>
            {profile.name}
          </h1>
          <p className="title">{profile.title}</p>
        </div>

        <button
          className="info_more-btn"
          onClick={() => setIsActive(!isActive)}
          aria-label={isActive ? "Hide Contacts" : "Show Contacts"}
        >
          <span>{isActive ? "Hide Contacts" : "Show Contacts"}</span>
          <ion-icon name={isActive ? "chevron-up" : "chevron-down"}></ion-icon>
        </button>
      </div>

      <div className="sidebar-info_more">
        <div className="separator"></div>

        <ul className="contacts-list">
          <li className="contact-item">
            <div className="icon-box">
              <ion-icon name="mail-outline"></ion-icon>
            </div>
            <div className="contact-info">
              <p className="contact-title">Email</p>
              <a href={`mailto:${profile.contacts.email}`} className="contact-link">
                {profile.contacts.email}
              </a>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <ion-icon name="phone-portrait-outline"></ion-icon>
            </div>
            <div className="contact-info">
              <p className="contact-title">Phone</p>
              <a href={`tel:${profile.contacts.phone}`} className="contact-link">
                {profile.contacts.phone}
              </a>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <ion-icon name="calendar-outline"></ion-icon>
            </div>
            <div className="contact-info">
              <p className="contact-title">Birthday</p>
              <time dateTime={profile.contacts.birthday.iso}>
                {profile.contacts.birthday.display}
              </time>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <ion-icon name="document-text-outline"></ion-icon>
            </div>
            <div className="contact-info">
              <p className="contact-title">Resume</p>
              <a
                href={profile.contacts.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
                title="View Resume in Google Drive"
              >
                View Resume
              </a>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              <ion-icon name="location-outline"></ion-icon>
            </div>
            <div className="contact-info">
              <p className="contact-title">Location</p>
              <address>{profile.contacts.location}</address>
            </div>
          </li>
        </ul>

        <div className="separator"></div>

        <ul className="social-list">
          {profile.socials.map((social) => (
            <li className="social-item" key={social.name}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title={social.name}
              >
                <ion-icon name={social.icon}></ion-icon>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
