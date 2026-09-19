"use client";

import { useState } from "react";

export function MagazineContact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    county: "",
    intent: "investigation-tip",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email.trim() && formData.message.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="w-full bg-[#fbfaf6] text-[#111317]">
      {/* 1. HEADER */}
      <section className="border-b border-[#e4e0d4] pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="magazine-container">
          <div className="max-w-5xl">
            <span className="magazine-kicker">Newsroom Desk & Tip-Offs</span>
            <h1 className="magazine-headline-display mt-3">
              Contact the Editorial Bureau.
            </h1>
            <p className="magazine-deck mt-6 max-w-3xl">
              Submit confidential tips, propose grassroots story leads from your county,
              or reach out for institutional research partnerships with Budget Ndio Story.
            </p>

            <div className="magazine-byline mt-8">
              <span>Location: <strong>Nairobi, Kenya</strong></span>
              <span>Encrypted Whistleblower Tips Welcome</span>
              <span>Response Window: <strong>Within 48 Hours</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONTACT DESK FORM & BUREAU INFORMATION */}
      <section className="py-16 md:py-24 bg-[#ffffff]">
        <div className="magazine-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: The Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-[#fbfaf6] border border-[#e4e0d4] p-8 md:p-12">
                <span className="magazine-kicker">Direct Dispatch</span>
                <h2 className="font-serif text-2xl md:text-3xl font-black text-[#111317] mt-1">
                  Send a Message to the Editors
                </h2>

                {submitted ? (
                  <div className="mt-8 p-6 bg-[#ffffff] border border-[#111317]">
                    <h3 className="font-serif text-xl font-bold text-[#111317]">
                      Transmission Received
                    </h3>
                    <p className="mt-2 font-serif text-base text-[#525660]">
                      Your communication has been forwarded to the BNS investigations bureau.
                      If your tip requires physical ground verification, an auditor from our county desk will review the documentation.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-mono text-[11px] uppercase tracking-wider text-[#111317] font-bold mb-2">
                          Your Name (or Anonymous)
                        </label>
                        <input
                          type="text"
                          placeholder="Jane Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full border border-[#e4e0d4] bg-[#ffffff] px-4 py-3 font-mono text-sm text-[#111317] focus:outline-none focus:border-[#111317]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[11px] uppercase tracking-wider text-[#111317] font-bold mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="jane@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full border border-[#e4e0d4] bg-[#ffffff] px-4 py-3 font-mono text-sm text-[#111317] focus:outline-none focus:border-[#111317]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-mono text-[11px] uppercase tracking-wider text-[#111317] font-bold mb-2">
                          County Location
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Nakuru, Kisumu, Nairobi"
                          value={formData.county}
                          onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                          className="w-full border border-[#e4e0d4] bg-[#ffffff] px-4 py-3 font-mono text-sm text-[#111317] focus:outline-none focus:border-[#111317]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[11px] uppercase tracking-wider text-[#111317] font-bold mb-2">
                          Nature of Inquiry
                        </label>
                        <select
                          value={formData.intent}
                          onChange={(e) => setFormData({ ...formData, intent: e.target.value })}
                          className="w-full border border-[#e4e0d4] bg-[#ffffff] px-4 py-3 font-mono text-sm text-[#111317] focus:outline-none focus:border-[#111317]"
                        >
                          <option value="investigation-tip">Confidential Investigation Tip</option>
                          <option value="story-lead">County Story Lead</option>
                          <option value="partnership">Media / Research Partnership</option>
                          <option value="general">Editorial Inquiry</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-[#111317] font-bold mb-2">
                        Message or Evidence Details *
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Please include project name, budget year, and contractor or county details if known..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full border border-[#e4e0d4] bg-[#ffffff] p-4 font-mono text-sm text-[#111317] focus:outline-none focus:border-[#111317]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="magazine-btn magazine-btn-primary w-full sm:w-auto"
                    >
                      Transmit Dispatch to Newsroom
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Bureau Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="magazine-card">
                <span className="magazine-kicker">Nairobi Editorial Bureau</span>
                <h3 className="font-serif text-xl font-bold text-[#111317] mt-1">
                  Budget Ndio Story
                </h3>
                <dl className="mt-4 space-y-3 font-mono text-xs text-[#525660]">
                  <div>
                    <dt className="text-[#7a7e8a] uppercase">Desk Email</dt>
                    <dd className="font-bold text-[#111317] mt-0.5">info@budgetndiostory.org</dd>
                  </div>
                  <div>
                    <dt className="text-[#7a7e8a] uppercase">Civic Hotline</dt>
                    <dd className="font-bold text-[#111317] mt-0.5">+254 790 631 623</dd>
                  </div>
                  <div>
                    <dt className="text-[#7a7e8a] uppercase">Editorial Lead</dt>
                    <dd className="font-bold text-[#111317] mt-0.5">House of Fiscal Wisdom, Nairobi</dd>
                  </div>
                </dl>
              </div>

              <div className="magazine-card magazine-card-featured">
                <span className="magazine-kicker">Whistleblower Guarantee</span>
                <h4 className="font-serif text-lg font-bold text-[#111317] mt-1">
                  Source Protection Protocol
                </h4>
                <p className="mt-3 text-sm font-serif leading-relaxed text-[#525660]">
                  Budget Ndio Story rigorously protects all confidential sources and civic whistleblowers.
                  We do not disclose informant identities under any commercial or administrative pressure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
