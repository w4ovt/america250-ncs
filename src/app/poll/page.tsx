'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface FormData {
  pinEase: number;
  guideAccess: number;
  guideUsefulness: number;
  activationEase: number;
  dropboxUsefulness: number;
  techSupport: number;
  returnAvailability: 'YES' | 'MAYBE' | 'NO' | '';
  featuresSuggested: string;
  siteImprovementSuggestions: string;
  additionalComments: string;
}

export default function PollPage() {
  const [pin, setPin] = useState('');
  const [isPinValidated, setIsPinValidated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submissionResult, setSubmissionResult] = useState<{
    volunteerName: string;
    returnAvailability: string;
  } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    pinEase: 0,
    guideAccess: 0,
    guideUsefulness: 0,
    activationEase: 0,
    dropboxUsefulness: 0,
    techSupport: 0,
    returnAvailability: '',
    featuresSuggested: '',
    siteImprovementSuggestions: '',
    additionalComments: '',
  });

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Just validate PIN format for now - actual validation will happen on form submit
      if (!/^\d{4}$/.test(pin)) {
        setError('PIN must be exactly 4 digits');
        return;
      }
      
      setIsPinValidated(true);
    } catch (err) {
      setError('Failed to validate PIN');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate all required fields
    if (!formData.pinEase || !formData.guideAccess || !formData.guideUsefulness || 
        !formData.activationEase || !formData.dropboxUsefulness || !formData.techSupport) {
      setError('Please rate all questions from 1-7');
      setIsLoading(false);
      return;
    }

    if (!formData.returnAvailability) {
      setError('Please select your return availability');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/poll/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pin,
          ...formData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmissionResult({
          volunteerName: result.volunteerName,
          returnAvailability: result.returnAvailability,
        });
        setIsSubmitted(true);
      } else {
        setError(result.error || 'Failed to submit feedback');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikertChange = (field: keyof FormData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (field: keyof FormData, value: string) => {
    if (value.length <= 250) {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const getReturnMessage = (availability: string) => {
    switch (availability) {
      case 'YES':
        return 'Thank you for confirming your availability for future events!';
      case 'MAYBE':
        return 'We appreciate your conditional availability and will keep you informed!';
      case 'NO':
        return 'Thank you for your honest feedback. Your past contributions have been invaluable!';
      default:
        return '';
    }
  };

  if (isSubmitted && submissionResult) {
    const firstName = submissionResult.volunteerName.split(' ')[0];
    return (
      <main className={`parchment-bg ${styles.pollPage}`}>
        <h1 className={styles.title}>Thank you {firstName}!</h1>
        <div className={styles.container}>
          <div className={styles.successMessage}>
            <p>Your feedback has been submitted successfully.</p>
            <p className={styles.returnMessage}>
              {getReturnMessage(submissionResult.returnAvailability)}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!isPinValidated) {
    return (
      <main className={`parchment-bg ${styles.pollPage}`}>
        <h1 className={styles.title}>Volunteer Feedback Poll</h1>
        <div className={styles.container}>
          <p className={styles.subtitle}>Please enter your 4-digit PIN to begin</p>
          
          <form onSubmit={handlePinSubmit} className={styles.pinForm}>
            <div className={styles.pinInput}>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                className={styles.pinField}
              />
            </div>
            
            {error && <div className={styles.error}>{error}</div>}
            
            <button
              type="submit"
              disabled={isLoading || pin.length !== 4}
              className={styles.submitButton}
            >
              {isLoading ? 'Validating...' : 'Continue'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className={`parchment-bg ${styles.pollPage}`}>
      <h1 className={styles.title}>Volunteer Feedback Poll</h1>
      <div className={styles.container}>
        <p className={styles.subtitle}>Your feedback helps us improve the America250 experience</p>
        
        <form onSubmit={handleFormSubmit} className={styles.pollForm}>
          {/* Likert Scale Questions */}
          <h2 className={styles.sectionHeader}>Please rate the following aspects (1 = Poor, 7 = Excellent):</h2>
          <div className={styles.section}>
            
            {[
              { key: 'pinEase', label: 'How easy was it to use your PIN?' },
              { key: 'guideAccess', label: 'How easy was it to access the volunteer guide?' },
              { key: 'guideUsefulness', label: 'How useful was the volunteer guide?' },
              { key: 'activationEase', label: 'How easy was it to start/manage activations?' },
              { key: 'dropboxUsefulness', label: 'How useful was the K4A log dropbox?' },
              { key: 'techSupport', label: 'How would you rate the technical support?' },
            ].map(({ key, label }) => (
              <div key={key} className={styles.likertQuestion}>
                <label className={styles.questionLabel}>{label}</label>
                <div className={styles.likertScale}>
                  {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                    <label key={value} className={styles.likertOption}>
                      <input
                        type="radio"
                        name={key}
                        value={value}
                        checked={formData[key as keyof FormData] === value}
                        onChange={() => handleLikertChange(key as keyof FormData, value)}
                        className={styles.likertInput}
                      />
                      <span className={styles.likertLabel}>{value}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Return Availability */}
          <h2 className={styles.sectionHeader}>Would you be available for future America250 events?</h2>
          <div className={styles.section}>
            <div className={styles.availabilityOptions}>
              {[
                { value: 'YES', label: 'Yes, I am available' },
                { value: 'MAYBE', label: 'Maybe, depending on circumstances' },
                { value: 'NO', label: 'No, I am not available' },
              ].map(({ value, label }) => (
                <label key={value} className={styles.availabilityOption}>
                  <input
                    type="radio"
                    name="returnAvailability"
                    value={value}
                    checked={formData.returnAvailability === value}
                    onChange={(e) => setFormData(prev => ({ ...prev, returnAvailability: e.target.value as 'YES' | 'MAYBE' | 'NO' }))}
                    className={styles.availabilityInput}
                  />
                  <span className={styles.availabilityLabel}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Text Feedback */}
          <h2 className={styles.sectionHeader}>Additional Feedback (Optional)</h2>
          <div className={styles.section}>
            
            <div className={styles.textField}>
              <label className={styles.textLabel}>
                What features would you like to see added?
                <textarea
                  value={formData.featuresSuggested}
                  onChange={(e) => handleTextChange('featuresSuggested', e.target.value)}
                  placeholder="Suggestions for new features..."
                  className={styles.textarea}
                  rows={3}
                />
                <span className={styles.charCount}>
                  {formData.featuresSuggested.length}/250
                </span>
              </label>
            </div>

            <div className={styles.textField}>
              <label className={styles.textLabel}>
                How can we improve the website?
                <textarea
                  value={formData.siteImprovementSuggestions}
                  onChange={(e) => handleTextChange('siteImprovementSuggestions', e.target.value)}
                  placeholder="Suggestions for website improvements..."
                  className={styles.textarea}
                  rows={3}
                />
                <span className={styles.charCount}>
                  {formData.siteImprovementSuggestions.length}/250
                </span>
              </label>
            </div>

            <div className={styles.textField}>
              <label className={styles.textLabel}>
                Any additional comments?
                <textarea
                  value={formData.additionalComments}
                  onChange={(e) => handleTextChange('additionalComments', e.target.value)}
                  placeholder="Additional comments..."
                  className={styles.textarea}
                  rows={3}
                />
                <span className={styles.charCount}>
                  {formData.additionalComments.length}/250
                </span>
              </label>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}
          
          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </main>
  );
} 