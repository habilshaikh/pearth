import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, Image } from 'lucide-react';
import { homeAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function AdminHomePage() {
  const [content, setContent] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_image: '',
    about_text: '',
    about_image: '',
    cta_text: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await homeAPI.get();
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching home content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await homeAPI.update(content);
      toast.success('Home content updated successfully!');
    } catch (error) {
      toast.error('Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div data-testid="admin-home-page">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Poppins']">Home Content</h1>
          <p className="text-[#6E7A85] mt-1">Manage your homepage content</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#FF6B00] hover:bg-[#e55f00] flex items-center gap-2"
          data-testid="save-home-btn"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-card p-6"
        >
          <h2 className="text-xl font-bold text-white font-['Poppins'] mb-6 flex items-center gap-2">
            <Image size={20} className="text-[#FF6B00]" />
            Hero Section
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#A0AAB2] mb-2">Hero Title</label>
              <Input
                name="hero_title"
                value={content.hero_title || ''}
                onChange={handleChange}
                placeholder="Precision CNC Machining"
                className="bg-[#2E2E2E]/60 border-white/10"
                data-testid="hero-title-input"
              />
            </div>

            <div>
              <label className="block text-sm text-[#A0AAB2] mb-2">Hero Subtitle</label>
              <Textarea
                name="hero_subtitle"
                value={content.hero_subtitle || ''}
                onChange={handleChange}
                rows={3}
                placeholder="Engineering Excellence Since 1998"
                className="bg-[#2E2E2E]/60 border-white/10 resize-none"
                data-testid="hero-subtitle-input"
              />
            </div>

            <div>
              <label className="block text-sm text-[#A0AAB2] mb-2">Hero Image URL</label>
              <Input
                name="hero_image"
                value={content.hero_image || ''}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="bg-[#2E2E2E]/60 border-white/10"
                data-testid="hero-image-input"
              />
              {content.hero_image && (
                <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
                  <img
                    src={content.hero_image}
                    alt="Hero Preview"
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="admin-card p-6"
        >
          <h2 className="text-xl font-bold text-white font-['Poppins'] mb-6 flex items-center gap-2">
            <Image size={20} className="text-[#FF6B00]" />
            About Section
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#A0AAB2] mb-2">About Text</label>
              <Textarea
                name="about_text"
                value={content.about_text || ''}
                onChange={handleChange}
                rows={5}
                placeholder="Tell visitors about your company..."
                className="bg-[#2E2E2E]/60 border-white/10 resize-none"
                data-testid="about-text-input"
              />
            </div>

            <div>
              <label className="block text-sm text-[#A0AAB2] mb-2">About Image URL</label>
              <Input
                name="about_image"
                value={content.about_image || ''}
                onChange={handleChange}
                placeholder="https://example.com/about.jpg"
                className="bg-[#2E2E2E]/60 border-white/10"
                data-testid="about-image-input"
              />
              {content.about_image && (
                <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
                  <img
                    src={content.about_image}
                    alt="About Preview"
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="admin-card p-6 lg:col-span-2"
        >
          <h2 className="text-xl font-bold text-white font-['Poppins'] mb-6 flex items-center gap-2">
            <Image size={20} className="text-[#FF6B00]" />
            Call to Action
          </h2>

          <div>
            <label className="block text-sm text-[#A0AAB2] mb-2">CTA Text</label>
            <Input
              name="cta_text"
              value={content.cta_text || ''}
              onChange={handleChange}
              placeholder="Get Your Custom Quote Today"
              className="bg-[#2E2E2E]/60 border-white/10 max-w-xl"
              data-testid="cta-text-input"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
