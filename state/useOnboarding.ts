import { useState, useEffect } from 'react';

const GAIA_ONBOARDING_KEY = 'gaia_onboarding_completed';

export const useOnboarding = () => {
    const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(() => {
        try {
            const stored = localStorage.getItem(GAIA_ONBOARDING_KEY);
            return stored === 'true';
        } catch {
            return false;
        }
    });

    const completeOnboarding = () => {
        try {
            localStorage.setItem(GAIA_ONBOARDING_KEY, 'true');
            setIsOnboardingCompleted(true);
        } catch (error) {
            console.error('Failed to save onboarding state:', error);
        }
    };

    const resetOnboarding = () => {
        try {
            localStorage.removeItem(GAIA_ONBOARDING_KEY);
            setIsOnboardingCompleted(false);
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
