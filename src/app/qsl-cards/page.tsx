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
            <div style={{
              background: 'linear-gradient(135deg, var(--mahogany) 0%, #5a3419 100%)',
              padding: '1rem 2rem',
              borderRadius: '8px',
              border: '3px solid var(--bronze)',
              boxShadow: '0 4px 12px rgba(104, 63, 27, 0.2)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-5px',
                left: '20px',
                right: '20px',
                height: '2px',
                background: 'var(--bronze)',
                borderRadius: '1px'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '-5px',
                left: '20px',
                right: '20px',
                height: '2px',
                background: 'var(--bronze)',
                borderRadius: '1px'
              }}></div>
              <h2 style={{
                fontFamily: 'librebaskerville-regular, serif',
                fontSize: '1.3rem',
                color: 'var(--linen)',
                fontStyle: 'italic',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                margin: 0,
                textAlign: 'center'
              }}>
                America&apos;s 250th Anniversary Commemorative Cards
              </h2>
            </div>
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
                         {/* Welcome Section for Non-Amateur Radio Visitors */}
             <div style={{
               background: 'rgba(199, 161, 89, 0.15)',
               padding: '1.5rem',
               borderRadius: '8px',
               border: '2px solid var(--bronze)',
               marginBottom: '1.5rem'
             }}>
               <h4 style={{ 
                 fontFamily: 'librebaskerville-bold, serif',
                 color: 'var(--mahogany)',
                 marginBottom: '1rem',
                 fontSize: '1.2rem',
                 textAlign: 'center'
               }}>
                 Welcome to our Guests who are not yet licensed Amateur Radio Operators
               </h4>
               <p style={{ lineHeight: '1.7', fontSize: '1.1rem', textAlign: 'center', fontStyle: 'italic' }}>
                 We invite you to become a licensed Amateur Radio operator. No fraternity on earth has the power and magic to bridge culture, nationality, distance, or disparate interests as Amateur Radio can do. Moreover, few other avocations offer the opportunity for personal development, technological advancement, or the camaraderie and sheer excitement of meeting fellow Hams nearby and across the world - consider becoming a Ham Radio operator...and become part of the &quot;Greatest Hobby on Earth!&quot;
               </p>
             </div>
             
             <p style={{ lineHeight: '1.7', fontSize: '1.1rem' }}>
               <strong>For our America250 volunteers and fellow Amateur Radio operators:</strong> These commemorative QSL cards serve as beautiful confirmations of your participation in this historic milestone celebration, supporting various amateur radio awards programs and preserving memories of America&apos;s 250th Anniversary.
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
                 Greensboro, NC 27408<br/>
                 <strong>marc@history.radio</strong>
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