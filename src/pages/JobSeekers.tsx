import React, { useState, ChangeEvent, FormEvent } from 'react';
import JobSeekerService from "../components/JobSeekerServices"
import { motion, AnimatePresence } from 'framer-motion';

const FlipModal = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        {/* Modal */}
        <motion.div
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -90, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 flex flex-col"
          style={{
            transformOrigin: 'center bottom',
            perspective: '1000px',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
            aria-label="Close modal"
            type="button"
          >
            &times;
          </button>
          <div className="pt-2 pb-1 px-1 flex-1 flex flex-col gap-4">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const JobSeekers: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    resume: null as File | null,
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, resume: e.target.files![0] }));
      setAttachments([e.target.files[0]]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // handle form submission logic here
  };

  return (
    <div className="min-h-screen flex flex-col pt-32">

      <FlipModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="w-full" id="job-application-form">
          <h1 className="text-4xl md:text-5xl font-bold text-black text-center mb-8">WE ARE HIRING!</h1>
          <h2 className="text-2xl md:text-2xl text-black text-center mb-10">Join Our Team</h2>
          <p className="text-blue-600 bg-neutral-100 rounded px-4 py-2 text-center mb-8">
            If you're interested in one of our open positions, start by applying here and attaching your resume.
          </p>
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-0 md:p-0 flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-gray-100 text-black px-4 py-3 rounded-none border-0 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500"
              autoComplete="name"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full bg-gray-100 text-black px-4 py-3 rounded-none border-0 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500"
              autoComplete="tel"
            />
            <input
              type="email"
              name="email"
              placeholder="Email*"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 text-black px-4 py-3 rounded-none border-0 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500"
              autoComplete="email"
            />
            <textarea
              name="message"
              placeholder="Message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="w-full bg-gray-100 text-black px-4 py-3 rounded-none border-0 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 resize-y"
            />
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center text-gray-700 cursor-pointer">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828M7 7h.01" /></svg>
                Attach Resume
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <span className="text-gray-500 text-sm">Attachments ({attachments.length})</span>
            </div>
            <div className="mt-6 flex flex-col items-center">
              <button
                type="submit"
                className="bg-gray-900 text-white font-semibold px-8 py-3 rounded shadow hover:bg-gray-800 transition-colors w-full max-w-xs"
              >
                SUBMIT APPLICATION
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="mt-2 text-red-600 hover:underline"
              >
                Cancel
              </button>
              <p className="text-xs text-zinc-600 text-center mt-4">
                This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" className="hover:underline hover:text-blue-600">Privacy Policy</a> and <a href="https://policies.google.com/terms" className="hover:underline hover:text-blue-600">Terms of Service</a> apply.
              </p>
            </div>
          </form>
        </div>
      </FlipModal>

      {/* Job Seekers Directory Section */}
      <section className="job-seekers-directory w-full mt-16">
        {/* Hero Section */}
        <div className="directory-hero bg-blue-50 py-10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-black mb-4">Job Seekers</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Welcome to the Job Seekers section of PathMatch! - where your career journey begins. We're dedicated to transforming your job search into career success.
            </p>
            <div className="cta-buttons flex flex-col sm:flex-row justify-center gap-4">
              <a href="/job-seekers" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Browse Jobs</a>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Apply Here
              </button>
            </div>
          </div>
        </div>

        {/* Why Choose PathMatch */}
        <div className="why-section py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-black mb-12">Why Job Seekers Choose PathMatch</h2>

            <div className="benefits-grid justify-center grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Benefit 1 */}
              <div className="benefit-card text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="icon mx-auto mb-4 text-4xl text-blue-500">🔍</div>
                <h3 className="text-xl font-semibold mb-2">Smart Job Matching</h3>
                <p className="text-gray-600">
                  Our AI matches you to roles that fit your skills and goals - no more endless scrolling.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="benefit-card text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="icon mx-auto mb-4 text-4xl text-blue-500">📚</div>
                <h3 className="text-xl font-semibold mb-2">Career Development</h3>
                <p className="text-gray-600">
                  Access courses, certifications, and resources to advance your skills.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="benefit-card text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="icon mx-auto mb-4 text-4xl text-blue-500">🤝</div>
                <h3 className="text-xl font-semibold mb-2">Personalized Support</h3>
                <p className="text-gray-600">
                  Get resume reviews, interview prep, and 1:1 coaching from experts.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="benefit-card text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="icon mx-auto mb-4 text-4xl text-blue-500">🌐</div>
                <h3 className="text-xl font-semibold mb-2">Networking Events</h3>
                <p className="text-gray-600">
                  Connect with employers at virtual job fairs and industry meetups.
                </p>
              </div>
            </div>
            {/* Centered FIND OUT MORE button */}
            <div className="flex justify-center mt-8">
              <button
                type="button"
                className="bg-black text-white font-semibold px-10 py-3 rounded shadow hover:bg-gray-200 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => {
                  const form = document.getElementById('job-application-form');
                  if (form) form.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                FIND OUT MORE
              </button>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="how-it-works py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-black mb-12">Your Path to Success</h2>

            <div className="steps flex flex-col md:flex-row justify-between items-center">
              {/* Step 1 */}
              <div className="step text-center mb-8 md:mb-0">
                <div className="step-number bg-black text-white rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4 text-lg font-semibold">1</div>
                <h3 className="text-xl font-semibold mb-2">Submit Your Resume</h3>
                <p className="max-w-xs text-zinc-600">Send your resume to potential employers and get hired</p>
              </div>
              {/* Arrow */}
              <div className="hidden md:block text-3xl text-black">→</div>

              {/* Step 2 */}
              <div className="step text-center mb-8 md:mb-0">
                <div className="step-number bg-black text-white rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4 text-lg font-semibold">2</div>
                <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
                <p className="max-w-xs text-zinc-600">Receive personalized job recommendations</p>
              </div>

              {/* Arrow */}
              <div className="hidden md:block text-3xl text-black">→</div>

              {/* Step 3 */}
              <div className="step text-center">
                <div className="step-number bg-black text-white rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4 text-lg font-semibold">3</div>
                <h3 className="text-xl font-semibold mb-2">Land Your Role</h3>
                <p className="max-w-xs text-zinc-600">Apply with our support and start your new career</p>
              </div>
            </div>
          </div>
        </div>
        <JobSeekerService />


        {/* Final CTA */}
        <div className="final-cta py-16 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Career?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who found their dream roles through PathMatch
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <a href="/signup" className="bg-white text-black px-6 py-3 rounded-lg hover:text-white font-semibold hover:bg-blue-900 transition-colors">Get Started - It's Free</a>
              <button
                type="button"
                className="bg-transparent text-white px-6 py-3 rounded-lg font-semibold border border-white hover:bg-white hover:text-blue-900 transition-colors"
                onClick={() => {
                  const form = document.getElementById('job-application-form');
                  if (form) form.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Schedule a Meet
              </button>
            </div>
            <div className="stats flex flex-col sm:flex-row justify-center gap-8">
              <div className="stat">
                <p className="text-4xl font-bold">92%</p>
                <p className="text-blue-200">Job match success rate</p>
              </div>
              <div className="stat">
                <p className="text-4xl font-bold">24h</p>
                <p className="text-blue-200">Avg. first interview time</p>
              </div>
              <div className="stat">
                <p className="text-4xl font-bold">10k+</p>
                <p className="text-blue-200">Careers launched</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="w-full bg-neutral-900 py-8 px-10 flex flex-col items-center justify-center mt-auto">
        <p className="text-gray-400 text-sm text-center mb-4">Copyright © 2025 PathMatch- All Rights Reserved.</p>
        <div className="flex gap-6 text-gray-300 text-sm">
          <a href="#about" className="hover:underline hover:text-blue-400 transition-colors">About Us</a>
          <a href="#contact" className="hover:underline hover:text-blue-400 transition-colors">Contact</a>
          <a href="https://policies.google.com/privacy" className="hover:underline hover:text-blue-400">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default JobSeekers; 