"use client";

import { FormEvent, useState } from "react";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitted(false);
    setLoading(true);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const result = (await response.json().catch(() => null)) as { error?: string } | null;

    setLoading(false);

    if (!response.ok) {
      setError(result?.error ?? "We could not send your message right now.");
      return;
    }

    setSubmitted(true);
    setForm(initialForm);
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="contact-form-grid">
        <input
          className="text-input"
          placeholder="Your Name"
          required
          type="text"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <input
          className="text-input"
          placeholder="Your Email"
          required
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <input
          className="text-input"
          placeholder="Your Subject"
          required
          type="text"
          value={form.subject}
          onChange={(event) => setForm({ ...form, subject: event.target.value })}
        />
        <div className="contact-form-full">
          <textarea
            className="text-area"
            placeholder="Your Message"
            required
            rows={7}
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
          />
        </div>
      </div>
      {submitted ? (
        <p className="form-success">Thanks for your message. We will reply to you shortly.</p>
      ) : null}
      {error ? <p className="form-error">{error}</p> : null}
      <button className="primary-button" type="submit">
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
