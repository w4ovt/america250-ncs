'use client';

import { useState, useEffect } from 'react';
import styles from './PollWidget.module.css';

interface Poll {
  id: number;
  title: string;
  description?: string;
  question: string;
  options: string[];
  allowMultiple: boolean;
  displayOrder: number;
}

interface PollWidgetProps {
  pollType: 'visitor' | 'volunteer';
  volunteerId?: number;
  onComplete?: () => void;
  className?: string;
}

export default function PollWidget({ pollType, volunteerId, onComplete, className }: PollWidgetProps) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentPollIndex, setCurrentPollIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [textResponse, setTextResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch active polls
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch(`/api/polls?type=${pollType}`);
        if (response.ok) {
          const data = await response.json();
          setPolls(data);
        } else {
          setError('Failed to load polls');
        }
      } catch {
        setError('Network error loading polls');
      }
    };

    fetchPolls();
  }, [pollType]);

  // Reset state when poll changes
  useEffect(() => {
    setSelectedOptions([]);
    setTextResponse('');
    setError(null);
  }, [currentPollIndex]);

  const handleOptionToggle = (optionIndex: number) => {
    if (polls[currentPollIndex]?.allowMultiple) {
      setSelectedOptions(prev => 
        prev.includes(optionIndex)
          ? prev.filter(i => i !== optionIndex)
          : [...prev, optionIndex]
      );
    } else {
      setSelectedOptions([optionIndex]);
    }
  };

  const handleSubmit = async () => {
    if (!polls[currentPollIndex]) return;

    const currentPoll = polls[currentPollIndex];
    const hasSelection = selectedOptions.length > 0 || textResponse.trim().length > 0;

    if (!hasSelection) {
      setError('Please select an option or provide a response');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/polls/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pollId: currentPoll.id,
          selectedOptions: selectedOptions.length > 0 ? selectedOptions : undefined,
          textResponse: textResponse.trim() || undefined,
          volunteerId,
        }),
      });

      if (response.ok) {
        // Move to next poll or complete
        if (currentPollIndex < polls.length - 1) {
          setCurrentPollIndex(prev => prev + 1);
        } else {
          setIsCompleted(true);
          onComplete?.();
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit response');
      }
          } catch {
        setError('Network error submitting response');
      } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (currentPollIndex < polls.length - 1) {
      setCurrentPollIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      onComplete?.();
    }
  };

  if (polls.length === 0) {
    return null; // No polls to show
  }

  if (isCompleted) {
    return (
      <div className={`${styles.pollWidget} ${className || ''}`}>
        <div className={styles.completed}>
          <h3>Thank you for your feedback!</h3>
          <p>Your responses help us improve our service.</p>
        </div>
      </div>
    );
  }

  const currentPoll = polls[currentPollIndex];
  if (!currentPoll) {
    return null; // Safety check
  }
  
  const isLastPoll = currentPollIndex === polls.length - 1;

  return (
    <div className={`${styles.pollWidget} ${className || ''}`}>
      <div className={styles.header}>
        <h3>{currentPoll.title}</h3>
        {currentPoll.description && (
          <p className={styles.description}>{currentPoll.description}</p>
        )}
        <div className={styles.progress}>
          Poll {currentPollIndex + 1} of {polls.length}
        </div>
      </div>

      <div className={styles.question}>
        <h4>{currentPoll.question}</h4>
      </div>

      <div className={styles.options}>
        {currentPoll.options.map((option, index) => (
          <label key={index} className={styles.option}>
            <input
              type={currentPoll.allowMultiple ? 'checkbox' : 'radio'}
              name={`poll-${currentPoll.id}`}
              value={index}
              checked={selectedOptions.includes(index)}
              onChange={() => handleOptionToggle(index)}
            />
            <span className={styles.optionText}>{option}</span>
          </label>
        ))}
      </div>

      {/* Text response field for additional feedback */}
      <div className={styles.textResponse}>
        <label htmlFor="text-response">Additional comments (optional):</label>
        <textarea
          id="text-response"
          value={textResponse}
          onChange={(e) => setTextResponse(e.target.value)}
          placeholder="Share any additional thoughts..."
          rows={3}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Submitting...' : (isLastPoll ? 'Submit' : 'Next')}
        </button>
        
        {pollType === 'visitor' && (
          <button
            type="button"
            onClick={handleSkip}
            disabled={isSubmitting}
            className={styles.skipButton}
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
} 