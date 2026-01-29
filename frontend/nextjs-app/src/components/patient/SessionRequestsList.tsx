'use client';

import { useEffect, useState } from 'react';
import { sessionRequestsApi, SessionRequest } from '@/lib/api/session-requests.api';
import { chatsApi } from '@/lib/api/chats.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { GlassCard } from '@/components/shared/GlassCard';
import { Badge } from '@/components/ui/badge';
import { GradientButton } from '@/components/ui/gradient-button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function SessionRequestsList() {
    const { user } = useAuthStore();
    const [requests, setRequests] = useState<SessionRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (user?.profileId) {
            loadRequests();
        }
    }, [user?.profileId]);

    const loadRequests = async () => {
        try {
            const response = await sessionRequestsApi.getByPatient(user!.profileId!);
            // Sort by date desc
            const sorted = response.data.sort((a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setRequests(sorted);
        } catch (error) {
            console.error('Failed to load requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnterChat = async (requestId: string) => {
        try {
            const response = await chatsApi.getBySessionRequest(requestId);
            const chat = response.data;
            if (chat && chat.id) {
                router.push(`/chat/${chat.id}`);
            } else {
                toast.error('Chat session has not been initialized yet.');
            }
        } catch (error) {
            console.error('Failed to get chat:', error);
            toast.error('Failed to enter chat. Please try again.');
        }
    };

    if (loading) return <div className="text-white/50 text-sm">Loading sessions...</div>;

    // Only show the header if there are requests? No, let's just return nothing or a placeholder?
    // User requirements say "Patient Waits for Response... Shows status".
    // If empty, we can just return null so it doesn't clutter.
    if (requests.length === 0) return null;

    return (
        <div className="space-y-4">
             <h2 className="text-xl font-bold mb-4 text-white">My Sessions & Requests</h2>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {requests.map(req => (
                    <GlassCard key={req.id} className="p-4 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <Badge
                                    variant="secondary"
                                    className={`${
                                        req.status === 'Accepted' ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' :
                                        req.status === 'Rejected' ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' :
                                        'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'
                                    }`}
                                >
                                    {req.status}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                    {new Date(req.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                                {req.initialMessage}
                            </p>
                        </div>

                        <div className="mt-auto pt-2">
                            {req.status === 'Accepted' ? (
                                <GradientButton
                                    onClick={() => handleEnterChat(req.id)}
                                    className="w-full"
                                >
                                    Enter Chat Room
                                </GradientButton>
                            ) : req.status === 'Rejected' ? (
                                <div className="text-center text-sm text-red-400">
                                    Request declined
                                </div>
                            ) : (
                                <div className="text-center text-sm text-yellow-500/70 italic flex items-center justify-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                    </span>
                                    Waiting for psychologist...
                                </div>
                            )}
                        </div>
                    </GlassCard>
                ))}
             </div>
        </div>
    );
}
