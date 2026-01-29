'use client';

import { useState } from 'react';
import { PsychologistProfile } from '@/lib/api/psychologists.api';
import { GlassCard } from '@/components/shared/GlassCard';
import { Badge } from '@/components/ui/badge';
import { ScheduleAppointmentButton } from '@/components/appointments/ScheduleAppointmentButton';
import { SessionRequestModal } from './SessionRequestModal';
import { Calendar, Award, GraduationCap } from 'lucide-react';

interface PsychologistCardProps {
  psychologist: PsychologistProfile;
}

export function PsychologistCard({ psychologist }: PsychologistCardProps) {
  const [showRequestModal, setShowRequestModal] = useState(false);

  const displayName = psychologist.name || (psychologist.firstName ? `${psychologist.firstName} ${psychologist.lastName}` : 'Psychologist');

  return (
    <>
      <GlassCard hover className="p-6 flex flex-col h-full">
        <div className="space-y-4 flex-grow">
          {/* Header */}
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {displayName}
            </h3>
            {psychologist.isVerified && (
              <div className="flex items-center gap-1 text-sm text-blue-400">
                <Award className="w-4 h-4" />
                <span>Verified Professional</span>
              </div>
            )}
          </div>

          {/* Bio */}
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
            {psychologist.bio || 'No bio available'}
          </p>

          {/* Education */}
          {psychologist.university && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <GraduationCap className="w-4 h-4" />
              <span>{psychologist.university}</span>
            </div>
          )}

          {/* Specializations */}
          {psychologist.tags && psychologist.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {psychologist.tags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/20 text-zinc-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-6">
            <ScheduleAppointmentButton
                psychologistId={psychologist.profileId}
                psychologistName={displayName}
            />

            <button
                onClick={() => setShowRequestModal(true)}
                className="w-full py-2 text-sm border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-white"
            >
                Request Chat Session
            </button>
        </div>
      </GlassCard>

      {/* Session Request Modal */}
      <SessionRequestModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        psychologist={{
          profileId: psychologist.profileId,
          name: displayName,
          bio: psychologist.bio || '',
          tags: psychologist.tags || []
        }}
      />
    </>
  );
}
