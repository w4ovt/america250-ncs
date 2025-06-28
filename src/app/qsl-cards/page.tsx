import Image from 'next/image';
import Navigation from '../../components/Navigation';

export default function QSLCardsPage() {
  return (
    <>
      <Navigation />
      <main className="parchment-bg">
        <div className="container" style={{ marginTop: '2rem' }}>
          {/* Page Header */}
          <div style={{ 
            textAlign: 'center',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '2px solid var(--bronze)'
          }}>
            <h1 style={{
              fontFamily: 'librebaskerville-bold, serif',
              fontSize: '3rem',
              color: 'var(--mahogany)',
              marginBottom: '0.5rem',
              textShadow: '2px 2px 4px rgba(104, 63, 27, 0.1)'
            }}>
              K4A QSL Cards
            </h1>
            <h2 style={{
              fontFamily: 'librebaskerville-regular, serif',
              fontSize: '1.3rem',
              color: 'var(--bronze)',
              fontStyle: 'italic',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              America&apos;s 250th Anniversary Commemorative Cards
            </h2>
          </div>

          {/* QSL Card Information */}
          <div style={{
            background: 'rgba(247, 241, 226, 0.8)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid var(--bronze)',
            boxShadow: '0 2px 8px rgba(104, 63, 27, 0.1)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ 
              fontFamily: 'librebaskerville-bold, serif',
              color: 'var(--mahogany)',
              marginBottom: '1rem',
              fontSize: '1.3rem'
            }}>
              What is a QSL Card?
            </h3>
            <p style={{ lineHeight: '1.7', marginBottom: '1rem', fontSize: '1.1rem' }}>
              QSL cards are confirmation postcards that amateur radio operators exchange to verify radio contact. 
              For America&apos;s 250th Anniversary, these cards become special commemorative keepsakes of this historic event.
            </p>
            <p style={{ lineHeight: '1.7', fontSize: '1.1rem' }}>
              <strong>As an America250 volunteer:</strong> You may receive QSL card requests from operators you contact. 
              These cards help confirm participation in this milestone celebration and support various amateur radio awards programs.
            </p>
          </div>

          {/* K4A QSL Card Examples - Stacked Display */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            {/* Limited Edition Donor Card - Top */}
            <div style={{
              background: 'rgba(247, 241, 226, 0.8)',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid var(--bronze)',
              textAlign: 'center',
              maxWidth: 'calc(100% - 40px)',
              width: '100%'
            }}>
              <h4 style={{ 
                fontFamily: 'librebaskerville-bold, serif',
                color: 'var(--mahogany)',
                marginBottom: '1rem',
                fontSize: '1.2rem'
              }}>
                Limited Edition Donor Card
              </h4>
              {/* K4A Donor Card Image */}
              <div style={{
                width: '100%',
                marginBottom: '1rem',
                borderRadius: '6px',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(104, 63, 27, 0.15)'
              }}>
                <Image
                  src="/k4a-donor-card.webp"
                  alt="K4A Limited Edition Donor QSL Card"
                  width={860}
                  height={553}
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>
              <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--mahogany)' }}>
                Premium commemorative card featuring Independence Hall and &quot;Signaling the American Spirit&quot; theme.
                Available with optional donation to support the America250 special event.
              </p>
            </div>

            {/* Donor-Free Card - Bottom */}
            <div style={{
              background: 'rgba(247, 241, 226, 0.8)',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid var(--bronze)',
              textAlign: 'center',
              maxWidth: 'calc(100% - 40px)',
              width: '100%'
            }}>
              <h4 style={{ 
                fontFamily: 'librebaskerville-bold, serif',
                color: 'var(--mahogany)',
                marginBottom: '1rem',
                fontSize: '1.2rem'
              }}>
                Donor-Free Card
              </h4>
              {/* K4A Free Card Image */}
              <div style={{
                width: '100%',
                marginBottom: '1rem',
                borderRadius: '6px',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(104, 63, 27, 0.15)'
              }}>
                <Image
                  src="/k4a-free-card.webp"
                  alt="K4A Donor-Free QSL Card"
                  width={860}
                  height={553}
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>
              <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--mahogany)' }}>
                Historic Declaration of Independence design commemorating America&apos;s 250th Anniversary.
                Available at no cost - simply send your QSL request with S.A.S.E.
              </p>
            </div>
          </div>

          {/* QSL Request Instructions */}
          <div style={{
            background: 'rgba(247, 241, 226, 0.8)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid var(--bronze)',
            boxShadow: '0 2px 8px rgba(104, 63, 27, 0.1)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ 
              fontFamily: 'librebaskerville-bold, serif',
              color: 'var(--mahogany)',
              marginBottom: '1rem',
              fontSize: '1.3rem'
            }}>
              How to Request K4A QSL Cards
            </h3>
            
            <div style={{
              background: 'var(--parchment)',
              padding: '1.25rem',
              borderRadius: '6px',
              border: '1px solid var(--bronze)',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <p style={{ 
                fontFamily: 'librebaskerville-bold, serif',
                fontSize: '1.1rem',
                marginBottom: '0.5rem',
                color: 'var(--mahogany)'
              }}>
                Mail QSL Request with S.A.S.E. and optional donation to:
              </p>
              <div style={{ 
                fontSize: '1.05rem',
                lineHeight: '1.4',
                color: 'var(--mahogany)'
              }}>
                <strong>Marc Bowen W4OVT</strong><br/>
                2006 Liberty Dr<br/>
                Greensboro, NC 27408
              </div>
            </div>

            <ul style={{ 
              lineHeight: '1.7',
              paddingLeft: '1.5rem',
              marginBottom: '1.5rem',
              fontSize: '1.05rem'
            }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>K4A QSL card costs are funded exclusively by optional donations</strong>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>S.A.S.E. required:</strong> Self-Addressed Stamped Envelope for card return
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Include contact details:</strong> Date, time (UTC), frequency, mode
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Donation option:</strong> If you believe what we are doing is important, and wish to donate, thank you in advance!
              </li>
            </ul>

            <div style={{
              fontSize: '0.9rem',
              fontStyle: 'italic',
              color: 'var(--mahogany)',
              borderTop: '1px solid var(--bronze)',
              paddingTop: '1rem'
            }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Donations may be tax deductible - IRS 501(c)(3) Non-Profit</strong>
              </p>
              <p>
                &quot;Friends of the Overmountain Victory Trail&quot; FEIN 47-3403543
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 