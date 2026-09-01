"use client";

import { useState, useRef, FormEvent } from "react";
import { portfolioData } from "@/data/portfolioData";

interface ContactPageProps {
  isActive: boolean;
}

export default function ContactPage({ isActive }: ContactPageProps) {
  const { contacts } = portfolioData.profile;
  const [formValid, setFormValid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = () => {
    if (formRef.current) {
      setFormValid(formRef.current.checkValidity());
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Form submission logic here
  };

  return (
    <article
      className={`contact${isActive ? " active" : ""}`}
      data-page="contact"
    >
      <header>
        <h2 className="h2 article-title">Contact</h2>
      </header>

      <section className="mapbox">
        <figure>
          <iframe
            src={contacts.mapEmbedUrl}
            width="400"
            height="300"
            loading="lazy"
            title={`Google Maps - ${contacts.location}`}
          ></iframe>
        </figure>
      </section>

      <section className="contact-form">
        <h3 className="h3 form-title">Contact Form</h3>

        <form
          action="#"
          className="form"
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <div className="input-wrapper">
            <input
              type="text"
              name="fullname"
              className="form-input"
              placeholder="Full name"
              required
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Email address"
              required
              onChange={handleInputChange}
            />
          </div>

          <textarea
            name="message"
            className="form-input"
            placeholder="Your Message"
            required
            onChange={handleInputChange}
          ></textarea>

          <button
            className="form-btn"
            type="submit"
            disabled={!formValid}
          >
            <ion-icon name="paper-plane"></ion-icon>
            <span>Send Message</span>
          </button>
        </form>
      </section>
    </article>
  );
}
