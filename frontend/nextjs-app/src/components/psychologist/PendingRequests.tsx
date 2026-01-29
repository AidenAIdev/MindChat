'use client';

import { useState, useEffect } from 'react';
import { sessionRequestsApi, SessionRequest } from '@/lib/api/session-requests.api';
import { chatsApi } from '@/lib/api/chats.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { GlassCard } from '@/components/shared/GlassCard';
import { GradientButton } from '@/components/ui/gradient-button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Clock, MessageSquare, Loader2 } from 'lucide-react';

export function PendingRequests() {
  const [requests, setRequests] = useState<SessionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user?.profileId) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    if (!user?.profileId) return;

    setLoading(true);
    try {
      // Get requests assigned to this psychologist
      const response = await sessionRequestsApi.getByPsychologist(user.profileId);

      // Filter to only show pending ones
      const pendingRequests = response.data.filter(
        (req: SessionRequest) => req.status === 'Pending'
      );

      console.log('📋 Pending requests for this psychologist:', pendingRequests);
      setRequests(pendingRequests);

    } catch (error) {
      console.error('❌ Failed to load requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (request: SessionRequest) => {
    try {
      console.log('✅ Accepting request:', request.id);

      // Update status to Accepted
      await sessionRequestsApi.updateStatus(request.id, {
        status: 'Accepted'
      });

      toast.success('Request accepted! Chat is now available.');

      // Get the chat that was created (or should be created by backend upon acceptance)
      // The backend logic says "Backend automatically creates a Chat" in Journey 2 Step 3.
      // So we fetch it.

      // We might need to retry a few times if the backend is async, but assuming it's sync enough:
      try {
          const chatResponse = await chatsApi.getBySessionRequest(request.id);
          router.push(`/chat/${chatResponse.data.id}`);
      } catch (err) {
          console.error("Chat creation might be delayed or failed", err);
          toast.info("Request accepted. You can access the chat from 'My Patients' shortly.");
          loadRequests();
      }

    } catch (error) {
      console.error('❌ Failed to accept request:', error);
      toast.error('Failed to accept request');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await sessionRequestsApi.updateStatus(requestId, {
        status: 'Rejected'
      });

      toast.success('Request rejected');
      loadRequests(); // Refresh list

    } catch (error) {
      console.error('❌ Failed to reject request:', error);
      toast.error('Failed to reject request');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-purple-500 h-8 w-8" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">No Pending Requests</h3>
        <p className="text-gray-400">
          You don't have any pending session requests at the moment.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Pending Requests ({requests.length})</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {requests.map(request => (
          <GlassCard key={request.id} className="p-6">
            <div className="space-y-4">
              {/* Request Info */}
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(request.createdAt).toLocaleDateString()} at{' '}
                    {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-white leading-relaxed italic">
                    "{request.initialMessage}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <GradientButton
                  onClick={() => handleAccept(request)}
                  className="w-full"
                >
                  Accept & Start Chat
                </GradientButton>

                <button
                  onClick={() => handleReject(request.id)}
                  className="w-full py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20"
                >
                  Decline
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
