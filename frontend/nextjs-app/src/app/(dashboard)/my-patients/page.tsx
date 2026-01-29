'use client';

import { useState, useEffect } from 'react';
import { sessionRequestsApi } from '@/lib/api/session-requests.api';
import { chatsApi } from '@/lib/api/chats.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { GlassCard } from '@/components/shared/GlassCard';
import { GradientButton } from '@/components/ui/gradient-button';
import { useRouter } from 'next/navigation';
import { MessageSquare, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function MyPatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'Psychologist') {
      router.push('/dashboard');
      return;
    }
    loadPatients();
  }, [user]);

  const loadPatients = async () => {
    if (!user?.profileId) return;

    try {
      // Get all accepted requests for this psychologist
      const response = await sessionRequestsApi.getByPsychologist(user.profileId);

      const acceptedRequests = response.data.filter(
        (req: any) => req.status === 'Accepted'
      );

      setPatients(acceptedRequests);
    } catch (error) {
      console.error('Failed to load patients:', error);
      toast.error('Failed to load patients list');
    } finally {
      setLoading(false);
    }
  };

  const openChat = async (request: any) => {
    try {
      const chatResponse = await chatsApi.getBySessionRequest(request.id);
      router.push(`/chat/${chatResponse.data.id}`);
    } catch (error) {
      console.error('Failed to open chat:', error);
      toast.error('Could not find chat for this patient');
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          My Patients
      </h1>

      {patients.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <p className="text-gray-400">No active patient sessions yet.</p>
        </GlassCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {patients.map(patient => (
            <GlassCard key={patient.id} className="p-6">
              <div className="flex flex-col h-full justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-2 text-lg text-white">Patient Session</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                        Started: {new Date(patient.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {patient.initialMessage && (
                    <p className="text-sm text-gray-300 line-clamp-2 bg-white/5 p-2 rounded">
                        "{patient.initialMessage}"
                    </p>
                  )}
                </div>

                <GradientButton
                  onClick={() => openChat(patient)}
                  className="w-full"
                >
                  <div className="flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Open Chat
                  </div>
                </GradientButton>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
