import { useState } from "react";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });

  const [success, setSuccess] = useState("");

  const emailPattern = /\S+@\S+\.\S+/;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const isValid = {
    name: form.name.trim().length > 0,
    email: emailPattern.test(form.email),
    message: form.message.trim().length > 0,
  };

  const getBorderClass = (field) => {
    if (!touched[field]) return "border-slate-200";

    return isValid[field]
      ? "border-green-500 focus:border-green-500"
      : "border-red-500 focus:border-red-500";
  };

  const hasStartedTyping =
    form.name.trim() !== "" ||
    form.email.trim() !== "" ||
    form.message.trim() !== "";

  const getSuggestion = () => {
    const missing = [];

    if (!form.name.trim()) missing.push("Name required");
    if (!emailPattern.test(form.email)) missing.push("Valid email required");
    if (!form.message.trim()) missing.push("Message required");

    return missing.length === 0
      ? "All fields valid ✔ Ready to send"
      : "Missing: " + missing.join(", ");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValid.name || !isValid.email || !isValid.message) {
      alert("Please fix errors before submitting.");
      return;
    }

    setSuccess("Your message has been sent successfully!");
    alert("Message sent successfully!");

    setForm({ name: "", email: "", message: "" });
    setTouched({ name: false, email: false, message: false });

    setTimeout(() => setSuccess(""), 3000);
  };

  // ✅ CANCEL FUNCTION
  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel your message?",
    );

    if (confirmCancel) {
      setForm({ name: "", email: "", message: "" });
      setTouched({ name: false, email: false, message: false });
      setSuccess("");
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold">Contact sales</h1>

      <p className="mt-3 text-slate-600">
        Reach out for quotes, bulk orders, and enterprise setups.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full rounded-2xl border px-4 py-3 ${getBorderClass(
            "name",
          )}`}
          placeholder="Name"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full rounded-2xl border px-4 py-3 ${getBorderClass(
            "email",
          )}`}
          placeholder="Email"
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full rounded-2xl border px-4 py-3 ${getBorderClass(
            "message",
          )}`}
          placeholder="Message"
          rows={6}
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="inline-flex rounded-full bg-orange-500 px-6 py-3 text-white"
          >
            Send
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex rounded-full bg-red-500 px-6 py-3 text-white"
          >
            Cancel
          </button>
        </div>

        {/* Bottom suggestion */}
        {hasStartedTyping && (
          <p className="mt-3 text-sm text-slate-600">{getSuggestion()}</p>
        )}

        {/* Success message */}
        {success && (
          <p className="mt-3 font-medium text-green-600">{success}</p>
        )}
      </form>
    </div>
  );
}

export default Contact;
