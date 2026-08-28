"use client";

import { FormEvent, useState } from "react";

type Fields = "name" | "email" | "subject" | "message";
type FieldErrors = Partial<Record<Fields, string>>;

export function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("submitting");
    setErrors({});
    setMessage("Sending message...");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { ok?: boolean; message?: string; errors?: Record<string, string[]> };
      if (!response.ok || !result.ok) {
        const nextErrors: FieldErrors = {};
        for (const field of ["name", "email", "subject", "message"] as const) {
          if (result.errors?.[field]?.[0]) nextErrors[field] = result.errors[field][0];
        }
        setErrors(nextErrors);
        setState("error");
        setMessage(result.message ?? "Message could not be sent. Email Aldo directly at aldolimsaputra@gmail.com.");
        return;
      }
      form.reset();
      setState("success");
      setMessage("Message sent. Aldo will reply by email.");
    } catch {
      setState("error");
      setMessage("Message could not be sent. Email Aldo directly at aldolimsaputra@gmail.com.");
    }
  };

  return (
    <form className="form-grid" onSubmit={submit} noValidate>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {(["name", "email", "subject"] as const).map((field) => (
        <div className="field" key={field}>
          <label htmlFor={field}>{field}</label>
          <input id={field} name={field} type={field === "email" ? "email" : "text"} autoComplete={field === "name" ? "name" : field === "email" ? "email" : "off"} maxLength={field === "name" ? 80 : field === "email" ? 160 : 120} aria-invalid={Boolean(errors[field])} aria-describedby={`${field}-error`} />
          <p className="field-error" id={`${field}-error`}>{errors[field] ?? ""}</p>
        </div>
      ))}
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" maxLength={4000} aria-invalid={Boolean(errors.message)} aria-describedby="message-error" />
        <p className="field-error" id="message-error">{errors.message ?? ""}</p>
      </div>
      <div>
        <button className="button button-primary" type="submit" disabled={state === "submitting"}>{state === "submitting" ? "Sending..." : "Send Message"}</button>
      </div>
      <p className="form-status" data-state={state} role="status" aria-live="polite">{message}</p>
    </form>
  );
}
