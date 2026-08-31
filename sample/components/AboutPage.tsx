"use client";

import { useState } from "react";

interface TestimonialData {
  name: string;
  avatar: string;
  text: string;
}

const testimonials: TestimonialData[] = [
  {
    name: "Daniel lewis",
    avatar: "/images/avatar-1.png",
    text: "Richard was hired to create a corporate identity. We were very pleased with the work done. She has a lot of experience and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.",
  },
  {
    name: "Jessica miller",
    avatar: "/images/avatar-2.png",
    text: "Richard was hired to create a corporate identity. We were very pleased with the work done. She has a lot of experience and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.",
  },
  {
    name: "Emily evans",
    avatar: "/images/avatar-3.png",
    text: "Richard was hired to create a corporate identity. We were very pleased with the work done. She has a lot of experience and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.",
  },
  {
    name: "Henry william",
    avatar: "/images/avatar-4.png",
    text: "Richard was hired to create a corporate identity. We were very pleased with the work done. She has a lot of experience and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.",
  },
];

interface ServiceData {
  icon: string;
  iconAlt: string;
  title: string;
  text: string;
}

const services: ServiceData[] = [
  {
    icon: "/images/icon-design.svg",
    iconAlt: "design icon",
    title: "Web design",
    text: "The most modern and high-quality design made at a professional level.",
  },
  {
    icon: "/images/icon-dev.svg",
    iconAlt: "Web development icon",
    title: "Web development",
    text: "High-quality development of sites at the professional level.",
  },
  {
    icon: "/images/icon-app.svg",
    iconAlt: "mobile app icon",
    title: "Mobile apps",
    text: "Professional development of applications for iOS and Android.",
  },
  {
    icon: "/images/icon-photo.svg",
    iconAlt: "camera icon",
    title: "Photography",
    text: "I make high-quality photos of any category at a professional level.",
  },
];

interface ClientData {
  logo: string;
}

const clients: ClientData[] = [
  { logo: "/images/logo-1-color.png" },
  { logo: "/images/logo-2-color.png" },
  { logo: "/images/logo-3-color.png" },
  { logo: "/images/logo-4-color.png" },
  { logo: "/images/logo-5-color.png" },
  { logo: "/images/logo-6-color.png" },
];

interface AboutPageProps {
  isActive: boolean;
}

export default function AboutPage({ isActive }: AboutPageProps) {
  const [modalActive, setModalActive] = useState(false);
  const [modalData, setModalData] = useState<TestimonialData | null>(null);

  const openModal = (testimonial: TestimonialData) => {
    setModalData(testimonial);
    setModalActive(true);
  };

  const closeModal = () => {
    setModalActive(false);
  };

  return (
    <>
      <article className={`about${isActive ? " active" : ""}`} data-page="about">
        <header>
          <h2 className="h2 article-title">About me</h2>
        </header>

        <section className="about-text">
          <p>
            I&apos;m Creative Director and UI/UX Designer from Sydney, Australia,
            working in web development and print media. I enjoy turning complex
            problems into simple, beautiful and intuitive designs.
          </p>
          <p>
            My job is to build your website so that it is functional and
            user-friendly but at the same time attractive. Moreover, I add
            personal touch to your product and make sure that is eye-catching and
            easy to use. My aim is to bring across your message and identity in
            the most creative way. I created web design for many famous brand
            companies.
          </p>
        </section>

        {/* service */}
        <section className="service">
          <h3 className="h3 service-title">What i&apos;m doing</h3>

          <ul className="service-list">
            {services.map((service) => (
              <li className="service-item" key={service.title}>
                <div className="service-icon-box">
                  <img
                    src={service.icon}
                    alt={service.iconAlt}
                    width="40"
                  />
                </div>
                <div className="service-content-box">
                  <h4 className="h4 service-item-title">{service.title}</h4>
                  <p className="service-item-text">{service.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* testimonials */}
        <section className="testimonials">
          <h3 className="h3 testimonials-title">Testimonials</h3>

          <ul className="testimonials-list has-scrollbar">
            {testimonials.map((t) => (
              <li className="testimonials-item" key={t.name}>
                <div
                  className="content-card"
                  onClick={() => openModal(t)}
                >
                  <figure className="testimonials-avatar-box">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      width="60"
                    />
                  </figure>
                  <h4 className="h4 testimonials-item-title">{t.name}</h4>
                  <div className="testimonials-text">
                    <p>{t.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* testimonials modal */}
        <div className={`modal-container${modalActive ? " active" : ""}`}>
          <div
            className={`overlay${modalActive ? " active" : ""}`}
            onClick={closeModal}
          ></div>

          <section className="testimonials-modal">
            <button className="modal-close-btn" onClick={closeModal}>
              <ion-icon name="close-outline"></ion-icon>
            </button>

            <div className="modal-img-wrapper">
              <figure className="modal-avatar-box">
                <img
                  src={modalData?.avatar || "/images/avatar-1.png"}
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
              <time dateTime="2021-06-14">14 June, 2021</time>
              <div>
                <p>{modalData?.text || ""}</p>
              </div>
            </div>
          </section>
        </div>

        {/* clients */}
        <section className="clients">
          <h3 className="h3 clients-title">Clients</h3>

          <ul className="clients-list has-scrollbar">
            {clients.map((client, i) => (
              <li className="clients-item" key={i}>
                <a href="#">
                  <img src={client.logo} alt="client logo" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </>
  );
}
