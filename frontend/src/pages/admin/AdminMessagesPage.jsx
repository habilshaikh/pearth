import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Trash2, Eye, CheckCircle, FileText } from 'lucide-react';
import { contactAPI, resolveMediaUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const extractAttachment = (text) => {
  if (!text) return { cleanMessage: text, attachmentPath: null, attachmentName: null };

  // Pattern 1: "Attachment: filename.pdf (/uploads/inquiries/...pdf)"
  const match = text.match(/\n?📎?\s*\*?Attachment:?\*?\s+(.+?)\s+\(([^)]+\.pdf)\)/i);
  if (match) {
    const attachmentName = match[1].trim();
    const rawPath = match[2].trim();
    const attachmentPath = resolveMediaUrl(rawPath);
    const cleanMessage = text.replace(match[0], '').trim();
    return { cleanMessage, attachmentPath, attachmentName };
  }

  // Pattern 2: "Attachment: filename.pdf" — sirf naam, path nahi
  const nameOnly = text.match(/\n?📎?\s*\*?Attachment:?\*?\s+([^\n(]+\.pdf)/i);
  if (nameOnly) {
    const attachmentName = nameOnly[1].trim();
    const cleanMessage = text.replace(nameOnly[0], '').trim();
    return { cleanMessage, attachmentPath: null, attachmentName };
  }

  // Pattern 3: Sirf raw path
  const pathMatch = text.match(/\(?(\/uploads\/inquiries\/[^\s)]+\.pdf)\)?/i);
  if (pathMatch) {
    const rawPath = pathMatch[1];
    const attachmentPath = resolveMediaUrl(rawPath);
    const cleanMessage = text.replace(pathMatch[0], '').replace(/📎.*$/m, '').trim();
    return { cleanMessage, attachmentPath, attachmentName: 'Drawing.pdf' };
  }

  return { cleanMessage: text, attachmentPath: null, attachmentName: null };
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await contactAPI.getAll();
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await contactAPI.markRead(id);
      fetchMessages();
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await contactAPI.delete(id);
        toast.success('Message deleted!');
        setSelectedMessage(null);
        fetchMessages();
      } catch (error) {
        toast.error('Failed to delete message');
      }
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
    <div data-testid="admin-messages-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white font-['Poppins']">Messages</h1>
        <p className="text-[#6E7A85] mt-1">Contact form submissions</p>
      </div>

      {messages.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <Mail size={48} className="text-[#6E7A85] mx-auto mb-4" />
          <p className="text-[#6E7A85]">No messages yet</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-3">
            {messages.map((message, index) => {
              const attachmentFromFields = message.drawing_path
                ? {
                    cleanMessage: message.message,
                    attachmentPath: resolveMediaUrl(message.drawing_path),
                    attachmentName: message.drawing_name || message.drawing_path.split('/').pop() || 'Drawing.pdf',
                  }
                : null;
              const { cleanMessage, attachmentPath, attachmentName } = attachmentFromFields || extractAttachment(message.message);
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.is_read) handleMarkRead(message.id);
                  }}
                  className={`admin-card p-4 cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id ? 'border-[#FF6B00]/50' : ''
                  } ${!message.is_read ? 'border-l-4 border-l-[#FF6B00]' : ''}`}
                  data-testid={`message-item-${index}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-medium">{message.name}</p>
                      <p className="text-[#6E7A85] text-sm">{message.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {(attachmentPath || attachmentName) && (
                        <span className="flex items-center gap-1 bg-[#FF6B00]/15 text-[#FF6B00] text-xs px-2 py-0.5 rounded-full">
                          <FileText size={10} />
                          PDF
                        </span>
                      )}
                      {!message.is_read && (
                        <span className="w-2 h-2 bg-[#FF6B00] rounded-full"></span>
                      )}
                    </div>
                  </div>
                  <p className="text-[#A0AAB2] text-sm line-clamp-2">{cleanMessage}</p>
                  <p className="text-[#6E7A85] text-xs mt-2">
                    {new Date(message.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (() => {
              const attachmentFromFields = selectedMessage.drawing_path
                ? {
                    cleanMessage: selectedMessage.message,
                    attachmentPath: resolveMediaUrl(selectedMessage.drawing_path),
                    attachmentName: selectedMessage.drawing_name || selectedMessage.drawing_path.split('/').pop() || 'Drawing.pdf',
                  }
                : null;
              const { cleanMessage, attachmentPath, attachmentName } = attachmentFromFields || extractAttachment(selectedMessage.message);
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="admin-card p-6"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white font-['Poppins']">
                        {selectedMessage.name}
                      </h2>
                      <p className="text-[#A0AAB2]">{selectedMessage.email}</p>
                      {selectedMessage.phone && (
                        <p className="text-[#6E7A85] text-sm">{selectedMessage.phone}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {selectedMessage.is_read && (
                        <span className="flex items-center gap-1 text-green-400 text-sm">
                          <CheckCircle size={16} />
                          Read
                        </span>
                      )}
                      <Button
                        onClick={() => handleDelete(selectedMessage.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  {selectedMessage.subject && (
                    <div className="mb-4">
                      <p className="text-[#6E7A85] text-sm mb-1">Subject</p>
                      <p className="text-white">{selectedMessage.subject}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-[#6E7A85] text-sm mb-2">Message</p>
                    <div className="bg-[#2E2E2E]/50 rounded-lg p-4">
                      <p className="text-[#A0AAB2] whitespace-pre-wrap">{cleanMessage}</p>
                    </div>
                  </div>

                  {/* Attachment — path hai toh clickable, sirf naam hai toh disabled card */}
                  {(attachmentPath || attachmentName) && (
                    <div className="mt-4">
                      <p className="text-[#6E7A85] text-sm mb-2">Attachment</p>
                      {attachmentPath ? (
                        <a
                          href={attachmentPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 bg-[#FF6B00]/10 border border-[#FF6B00]/30 hover:bg-[#FF6B00]/20 transition-colors rounded-lg px-4 py-3 w-fit"
                        >
                          <div className="w-9 h-9 rounded-lg bg-[#FF6B00]/20 flex items-center justify-center flex-shrink-0">
                            <FileText size={18} className="text-[#FF6B00]" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">
                              {attachmentName || 'Drawing.pdf'}
                            </p>
                            <p className="text-[#6E7A85] text-xs">Click to open PDF</p>
                          </div>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#FF6B00] ml-2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </a>
                      ) : (
                        <div className="flex items-center gap-3 bg-[#2E2E2E]/50 border border-white/10 rounded-lg px-4 py-3 w-fit opacity-60">
                          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                            <FileText size={18} className="text-[#A0AAB2]" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{attachmentName}</p>
                            <p className="text-[#6E7A85] text-xs">File saved on server</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <p className="text-[#6E7A85] text-sm">
                      Received: {new Date(selectedMessage.created_at).toLocaleString()}
                    </p>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-[#FF6B00] text-sm hover:underline"
                    >
                      Reply via Email →
                    </a>
                  </div>
                </motion.div>
              );
            })() : (
              <div className="admin-card p-12 text-center">
                <Eye size={48} className="text-[#6E7A85] mx-auto mb-4" />
                <p className="text-[#6E7A85]">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
