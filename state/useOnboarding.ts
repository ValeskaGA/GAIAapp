import { useState } from 'react';
import { useAuth } from './AuthContext';

/** Returns a per-user localStorage key so each account has its own onboarding flag. */
const onboardingKey = (userId: string) => `gaia_onboarding_completed_${userId}`;

/** Reads the onboarding flag synchronously for the given userId. */
const readFlag = (userId: string | null): boolean => {
    if (!userId) return false;
    try {
        return localStorage.getItem(onboardingKey(userId)) === 'true';
    } catch {
        return false;
    }
};

export const useOnboarding = () => {
    const { user } = useAuth();
    const userId = user?.id ?? null;

    // Computed synchronously on every render — no useEffect needed.
    // This avoids the race condition where isOnboardingCompleted is still false
    // at the moment of redirect (before the useEffect had a chance to run).
    const isOnboardingCompleted = readFlag(userId);

    // Local state only used to trigger a re-render after completeOnboarding / resetOnboarding
    const [, forceUpdate] = useState(0);

    const completeOnboarding = () => {
        if (!userId) return;
        try {
            localStorage.setItem(onboardingKey(userId), 'true');
            forceUpdate(n => n + 1); // trigger re-render so callers see the updated value
        } catch (error) {
            console.error('Failed to save onboarding state:', error);
        }
    };

    const resetOnboarding = () => {
        if (!userId) return;
        try {
            localStorage.removeItem(onboardingKey(userId));
            forceUpdate(n => n + 1);
        } catch (error) {
            console.error('Failed to reset onboarding state:', error);
        }
    };

    return {
        isOnboardingCompleted,
        completeOnboarding,
        resetOnboarding,
    };
};
