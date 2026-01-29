'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { GradientButton } from '@/components/ui/gradient-button';
import { sessionRequestsApi } from '@/lib/api/session-requests.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { toast } from 'sonner';

interface SessionRequestModalProps {
  open: boolean;
  onClose: () => void;
  psychologist: {
    profileId: string;
    name: string;
    bio: string;
    tags: string[];
  };
}

export function SessionRequestModal({
  open,
  onClose,
  psychologist
}: SessionRequestModalProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useAuthStore(state => state.user);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (!user?.profileId) {
      toast.error('User profile not found');
      return;
    }

    setLoading(true);

    try {
      console.log('📤 Creating session request:', {
        patientId: user.profileId,
        assignedPsychologistId: psychologist.profileId, // ✅ TARGET SPECIFIC PSYCHOLOGIST
        initialMessage: message
      });

      // Step 1: Create the request with target psychologist
      const createResponse = await sessionRequestsApi.create({
        patientId: user.profileId,
        initialMessage: message
      });

      const requestId = createResponse.data.id || createResponse.data;

      console.log('✅ Session request created:', requestId);

      // Step 2: Immediately assign the psychologist
      await sessionRequestsApi.assignPsychologist(requestId, {
        psychologistId: psychologist.profileId
      });

      console.log('✅ Psychologist assigned to request');

      toast.success(`Session request sent to ${psychologist.name}!`);
      setMessage('');
      onClose();

      // Optional: Refresh the requests list if we had one here, but we don't.

    } catch (error: any) {
      console.error('❌ Failed to create session request:', error);
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-xl bg-black/90 border border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Request Session with {psychologist.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Psychologist Info Preview */}
          <div className="p-4 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10">
            <p className="text-sm text-gray-300 mb-2 line-clamp-3">{psychologist.bio}</p>
            <div className="flex flex-wrap gap-2">
              {psychologist.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Why do you want to connect? <span className="text-red-400">*</span>
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the psychologist what you're looking for help with..."
              className="backdrop-blur-xl bg-white/10 border-white/20 text-white min-h-[120px]"
              rows={5}
            />
            <p className="text-xs text-gray-400 mt-1">
              This will be sent directly to {psychologist.name}
            </p>
          </div>

          {/* Submit Button */}
          <GradientButton
            onClick={handleSubmit}
            disabled={loading || !message.trim()}
            className="w-full"
          >
            {loading ? "Sending..." : `Send Request to ${psychologist.name}`}
          </GradientButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
