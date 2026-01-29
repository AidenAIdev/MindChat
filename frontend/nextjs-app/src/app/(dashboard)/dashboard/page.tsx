"use client";

import { useAuthStore } from "@/lib/store/auth.store";
import { useEffect, useState } from "react";
import { PsychologistBrowser } from "@/components/patient/PsychologistBrowser";
import { PendingRequests } from "@/components/psychologist/PendingRequests";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import { SessionRequestsList } from "@/components/patient/SessionRequestsList";
import { PsychologistDebug } from "@/components/debug/PsychologistDebug";
import { patientsApi } from "@/lib/api/patients.api";
import { psychologistsApi } from "@/lib/api/psychologists.api";

export default function DashboardPage() {
  const { user, updateUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lazy load profile ID if missing
  useEffect(() => {
    const fetchProfile = async () => {
        if (!user || user.profileId || !user.userId) return;

        try {
            console.log('🔄 Lazy loading profile for user:', user.userId);
            let profileData: any;

            if (user.role === 'Patient' || user.userType === 'patient') {
                const response = await patientsApi.getByUserId(user.userId);
                profileData = response.data;
            } else {
                const response = await psychologistsApi.getByUserId(user.userId);
                profileData = response.data;
            }

            if (profileData && profileData.profileId) {
                console.log('✅ Profile loaded:', profileData.profileId);
                updateUser({
                    profileId: profileData.profileId,
                    firstName: profileData.firstName || user.firstName,
                    lastName: profileData.lastName || user.lastName
                });
            }
        } catch (error) {
            console.error('❌ Failed to load profile:', error);
        }
    };

    if (mounted && user) {
        fetchProfile();
    }
  }, [mounted, user, updateUser]);

  if (!mounted) return null;

  // Normalize role
  const isPsychologist = user?.role === 'Psychologist' || user?.userType === 'psychologist';
  const firstName = user?.firstName || 'Guest';

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, {firstName}
        </h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s your daily overview.
        </p>
      </div>

      {/* Debug Component - Helping to diagnose issues */}
      {/* <PsychologistDebug /> */}
      
      {isPsychologist ? (
        <div className="space-y-8">
            <PendingRequests />
            <AppointmentsList />
        </div>
      ) : (
        <div className="space-y-8">
            <SessionRequestsList />
            <AppointmentsList />
            <div>
                <h2 className="text-xl font-bold mb-4">Find a Psychologist</h2>
                <PsychologistBrowser />
            </div>
        </div>
      )}
    </div>
  );
}
