'use client'

import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import type { ContactRequest } from "@/types/seo"; // Assuming this path is correct

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data: Partial<ContactRequest> = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      message: formData.get("message") as string,
    };

    // Basic client-side validation
    if (!data.name || !data.email || !data.company || !data.message) {
      setError("Alla fält måste fyllas i.");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setError("Ogiltig e-postadress.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Något gick fel. Försök igen senare.");
      }

      setSuccess(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel. Försök igen senare.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <Input
        name="name"
        label="Namn"
        type="text"
        required
        placeholder="Ditt namn"
      />
      <Input
        name="email"
        label="E-post"
        type="email"
        required
        placeholder="din@email.se"
      />
      <Input
        name="company"
        label="Företag"
        type="text"
        required
        placeholder="Ditt företag"
      />
      <div className="w-full">
        <label htmlFor="message" className="block text-sm font-medium text-light mb-1">
          Meddelande
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Skriv ditt meddelande här..."
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {success && (
        <p className="text-green-500 text-sm">
          Tack för ditt meddelande! Vi återkommer så snart som möjligt.
        </p>
      )}

      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full"
      >
        Skicka meddelande
      </Button>
    </form>
  );
}