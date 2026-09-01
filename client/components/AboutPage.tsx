"use client";

import { useState } from "react";
import { portfolioData, Achievement } from "@/data/portfolioData";

interface AboutPageProps {
  isActive: boolean;
}

export default function AboutPage({ isActive }: AboutPageProps) {
  const { about } = portfolioData;
  const [modalActive, setModalActive] = useState(false);
  const [modalData, setModalData] = useState<Achievement | null>(null);

  const openModal = (achievement: Achievement) => {
    setModalData(achievement);
    setModalActive(true);
  };

  const closeModal = () => {
    setModalActive(false);
  };

  const achievementsList = about.achievements || [];

  return (
    <>
      <article className={`about${isActive ? " active" : ""}`} data-page="about">
        <header>
          <h2 className="h2 article-title">About me</h2>
        </header>

        <section className="about-text">
          {about.paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </section>

        <section className="service">
          <h3 className="h3 service-title">What i&apos;m doing</h3>

          <ul className="service-list">
            {about.services.map((service) => (
              <li className="service-item" key={service.id || service.title}>
                <div className="service-icon-box">
                  <ion-icon name={service.icon}></ion-icon>
                </div>
                <div className="service-content-box">
                  <h4 className="h4 service-item-title">{service.title}</h4>
                  <p className="service-item-text">{service.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="testimonials">
          <h3 className="h3 testimonials-title">Achievements</h3>

          <ul className="testimonials-list">
            {achievementsList.map((item) => (
              <li className="testimonials-item" key={item.id || item.name}>
                <div
                  className="content-card"
                  onClick={() => openModal(item)}
                >
                  <figure className="testimonials-avatar-box">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      width="60"
                    />
                  </figure>
                  <h4 className="h4 testimonials-item-title">{item.name}</h4>
                  <div className="testimonials-text">
                    <p>{item.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className={`modal-container${modalActive ? " active" : ""}`}>
          <div
            className={`overlay${modalActive ? " active" : ""}`}
            onClick={closeModal}
          ></div>

          <section className="testimonials-modal">
            <button className="modal-close-btn" onClick={closeModal} aria-label="Close modal">
              <ion-icon name="close-outline"></ion-icon>
            </button>

            <div className="modal-img-wrapper">
              <figure className="modal-avatar-box">
                <img
                  src={modalData?.avatar || "/images/avatar.png"}
                  alt={modalData?.name || ""}
                  width="80"
                />
              </figure>
              <img src="/images/icon-quote.svg" alt="quote icon" />
            </div>

            <div className="modal-content">
              <h4 className="h3 modal-title">
                {modalData?.name || ""}
              </h4>
              {modalData?.date && (
                <time dateTime={modalData.date}>{modalData.date}</time>
              )}
              <div>
                <p>{modalData?.text || ""}</p>
              </div>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
