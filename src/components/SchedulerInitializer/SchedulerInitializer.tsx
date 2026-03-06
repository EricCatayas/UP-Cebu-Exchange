'use client';
import { useEffect } from 'react';

export default function SchedulerInitializer() {
  useEffect(() => {
    // Initialize the scheduler when the component mounts
    const initializeScheduler = async () => {
      try {
        const response = await fetch('/api/scheduler/init', {
          method: 'POST',
        });
        if (response.ok) {
          console.log('Scheduler initialized successfully');
        } else {
          console.error('Failed to initialize scheduler:', await response.text());
        }
      } catch (error) {
        console.error('Error initializing scheduler:', error);
      }
    };

    initializeScheduler();
  }, []); // Empty dependency array ensures this runs once on mount

  return null; // This component doesn't render anything
}
