"use client";

import { useState, useRef, FormEvent } from "react";
import { portfolioData } from "@/data/portfolioData";

interface ContactPageProps {
  isActive: boolean;
}

export default function ContactPage({ isActive }: ContactPageProps) {
  const { contacts } = portfolioData.profile;
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    formData.fullname.trim().length > 0 &&
    formData.email.trim().length > 3 &&
    formData.message.trim().length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setStatusMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullname.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setSubmitStatus("success");
        setStatusMessage(
          `Thank you, ${formData.fullname.trim()}! Your message has been sent directly to Vivek's inbox. He will reply shortly.`
        );
        setFormData({ fullname: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
        setStatusMessage(
          data.error ||
            `Could not send your message right now. Please email directly at ${contacts.email}.`
        );
      }
    } catch {
      setSubmitStatus("error");
      setStatusMessage(
        `Network connection failed. Please try again or reach out directly at ${contacts.email}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article
      id="contact"
      className={`contact${isActive ? " active" : ""}`}
      data-page="contact"
      role="tabpanel"
      aria-labelledby="tab-contact"
      tabIndex={0}
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

        {submitStatus === "success" && (
          <div className="form-status-alert success" role="alert">
            <ion-icon name="checkmark-circle-outline"></ion-icon>
            <span>{statusMessage}</span>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="form-status-alert error" role="alert">
            <ion-icon name="alert-circle-outline"></ion-icon>
            <span>{statusMessage}</span>
          </div>
        )}

        <form
          action="#"
          className="form"
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <div className="input-wrapper">
            <input
              type="text"
              id="contact-fullname"
              name="fullname"
              aria-label="Full name"
              autoComplete="name"
              className="form-input"
              placeholder="Full name"
              required
              value={formData.fullname}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            <input
              type="email"
              id="contact-email"
              name="email"
              aria-label="Email address"
              autoComplete="email"
              className="form-input"
              placeholder="Email address"
              required
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          <textarea
            id="contact-message"
            name="message"
            aria-label="Your message"
            className="form-input"
            placeholder="Your Message"
            required
            value={formData.message}
            onChange={handleInputChange}
            disabled={isSubmitting}
          ></textarea>

          <button
            className="form-btn"
            type="submit"
            disabled={!isFormValid || isSubmitting}
          >
            <ion-icon
              name={isSubmitting ? "hourglass-outline" : "paper-plane"}
            ></ion-icon>
            <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
          </button>
        </form>
      </section>
    </article>
  );
}
