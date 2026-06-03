import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, CheckCircle, FileText } from 'lucide-react';
import { contactAPI } from '@/lib/api';
import { PageHeader, GlassCard, SectionTitle } from '@/components/ui-custom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [drawingFile, setDrawingFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed.');
      e.target.value = '';
      return;
    }
    setDrawingFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Backend pe data + file save karo
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
      if (drawingFile) {
        payload.append('drawing', drawingFile);
      }

      // ✅ FIX: Backend se saved file path lo
      let savedFilePath = null;
      let savedFileName = drawingFile?.name || null;

      try {
        const response = await contactAPI.submit(payload);
        // Backend se file path aata hai — response.data.drawing_path ya response.data.file_path
        savedFilePath = response?.data?.drawing_path
          || response?.data?.file_path
          || response?.data?.attachment_path
          || null;
        // Agar backend ne path diya toh use karo, warna original naam
        if (savedFilePath && !savedFileName) {
          savedFileName = savedFilePath.split('/').pop();
        }
      } catch (apiError) {
        console.warn('Backend save failed, proceeding to WhatsApp:', apiError);
      }

      // Step 2: WhatsApp pe message bhejo
      // ✅ FIX: Path ke saath attachment info include karo
      const attachmentInfo = drawingFile
        ? savedFilePath
          ? `\n\n📎 *Drawing Attached:* ${savedFileName} (${savedFilePath})`
          : `\n\n📎 *Drawing Attached:* ${drawingFile.name}\n_(Please check email/backend for the PDF file)_`
        : '';

      const whatsappMessage =
`*New Inquiry from Website* 🔧

*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone || 'Not provided'}
*Subject:* ${formData.subject || 'Not provided'}

*Message:*
${formData.message}${attachmentInfo}`;

      const encodedMessage = encodeURIComponent(whatsappMessage);
      window.open(`https://wa.me/919574007081?text=${encodedMessage}`, '_blank');

      setSubmitted(true);
      toast.success('Inquiry sent to WhatsApp!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setDrawingFile(null);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Reach Out Us',
      content: ['SAI TECH', 'Plot No. 28, POR GIDC, Ramangamdi,', 'Vadodara - 391243']
    },
    {
      icon: Phone,
      title: 'Inquiry WhatsApp',
      content: ['+91 95740 07081'],
      links: ['https://wa.me/919574007081']
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: ['shreeji_engg7822@yahoo.co.in'],
      link: 'mailto:shreeji_engg7822@yahoo.co.in'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: ['Mon - Sat: 9:00 AM - 6:00 PM', 'Sunday: Closed']
    }
  ];

  return (
    <div className="min-h-screen bg-[#121212]" data-testid="contact-page">
      <PageHeader
        title="Contact Us"
        subtitle="Get in touch for your precision machining needs"
        backgroundImage="https://images.unsplash.com/photo-1720036236632-fdb6211cf317?w=1920&q=80"
      />

      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionTitle subtitle="Send us a message">
                Get a Quote
              </SectionTitle>
              <p className="text-[#A0AAB2] mb-6">
                Fill the form below. Your inquiry will be sent directly to our WhatsApp. If you attach a PDF drawing, it will also be saved on our server.
              </p>

              {submitted ? (
                <GlassCard className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white font-['Poppins'] mb-4">
                    Thank You!
                  </h3>
                  <p className="text-[#A0AAB2] mb-6">
                    Your inquiry has been sent to our WhatsApp. We'll get back to you soon!
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    className="bg-[#FF6B00] hover:bg-[#e55f00]"
                  >
                    Send Another Message
                  </Button>
                </GlassCard>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-[#A0AAB2] mb-2">Full Name *</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="bg-[#2E2E2E]/60 border-white/10 focus:border-[#FF6B00]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#A0AAB2] mb-2">Email *</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="bg-[#2E2E2E]/60 border-white/10 focus:border-[#FF6B00]"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-[#A0AAB2] mb-2">Phone</label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="bg-[#2E2E2E]/60 border-white/10 focus:border-[#FF6B00]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#A0AAB2] mb-2">Subject</label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Quote Request"
                        className="bg-[#2E2E2E]/60 border-white/10 focus:border-[#FF6B00]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-[#A0AAB2] mb-2">Message *</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us about your project requirements..."
                      className="bg-[#2E2E2E]/60 border-white/10 focus:border-[#FF6B00] resize-none"
                    />
                  </div>

                  {/* PDF Upload */}
                  <div>
                    <label className="block text-sm text-[#A0AAB2] mb-2">Drawing PDF (Optional)</label>
                    <div className="rounded-xl border border-dashed border-white/15 bg-[#2E2E2E]/60 p-4">
                      <label className="flex cursor-pointer items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-sm text-[#A0AAB2]">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF6B00]/15">
                            <FileText size={18} className="text-[#FF6B00]" />
                          </div>
                          <div>
                            <p className="text-white">
                              {drawingFile ? drawingFile.name : 'Upload drawing in PDF format'}
                            </p>
                            <p className="text-xs text-[#A0AAB2]">
                              {drawingFile
                                ? `${(drawingFile.size / 1024 / 1024).toFixed(2)} MB — Ready to send`
                                : 'Optional, max size 10 MB'}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-md bg-[#FF6B00] px-4 py-2 text-sm font-medium text-white whitespace-nowrap">
                          {drawingFile ? 'Change File' : 'Choose File'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      {drawingFile && (
                        <button
                          type="button"
                          onClick={() => setDrawingFile(null)}
                          className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          ✕ Remove file
                        </button>
                      )}
                    </div>
                    {drawingFile && (
                      <p className="text-xs text-[#A0AAB2] mt-2">
                        📎 PDF will be saved on server. WhatsApp message will mention the file name.
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white py-6 text-lg font-semibold"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Send Inquiry on WhatsApp
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Contact Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionTitle subtitle="Contact Information">
                Reach Out to Us
              </SectionTitle>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {contactInfo.map((info, index) => (
                  <GlassCard key={index} className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#FF6B00]/20 flex items-center justify-center flex-shrink-0">
                        <info.icon size={22} className="text-[#FF6B00]" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">{info.title}</h4>
                        {info.content.map((line, i) => (
                          info.links ? (
                            <a
                              key={i}
                              href={info.links[i]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-[#A0AAB2] text-sm hover:text-[#FF6B00] transition-colors break-all"
                            >
                              {line}
                            </a>
                          ) : info.link ? (
                            <a
                              key={i}
                              href={info.link}
                              className="block text-[#A0AAB2] text-sm hover:text-[#FF6B00] transition-colors break-all"
                            >
                              {line}
                            </a>
                          ) : (
                            <p key={i} className="text-[#A0AAB2] text-sm">{line}</p>
                          )
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* Google Map */}
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.1!2d73.1926!3d22.3839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc1000dfa6e2d:0x8076974e96bcc2db!2sSAI+TECH!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SAI TECH Location"
                ></iframe>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
