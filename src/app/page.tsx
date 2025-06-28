import ActivationTable from '../components/ActivationTable';
import Navigation from '../components/Navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="parchment-bg">
        <div className="container" style={{ marginTop: '2rem' }}>
        {/* Header Image - positioned at the top with same width as Activation Table */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: '0.5em',
          padding: '50px 20px 0 20px',
          maxWidth: '100%'
        }}>
          <Image
            src="/america250-ncs-header-image.webp"
            alt="America250 NCS Header"
            width={800}
            height={400}
            style={{
              display: 'block',
              width: 'auto',
              height: 'auto',
              maxWidth: '100%',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(104, 63, 27, 0.15)'
            }}
            sizes="(max-width: 800px) 100vw, 800px"
            priority
          />
        </div>
        
        {/* Title and Subtitle - positioned below image with minimal spacing */}
        <h1 className="homepage-title" style={{ 
          fontSize: '3.5rem', 
          textAlign: 'center', 
          marginBottom: '0.1em',
          marginTop: '0.2em',
          color: 'var(--mahogany)',
          textShadow: '2px 2px 4px rgba(104, 63, 27, 0.1)'
        }}>
          AMERICA250
        </h1>
        <h2 className="homepage-subtitle" style={{ 
          textAlign: 'center',
          marginBottom: '1em',
          marginTop: '0',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontSize: '1.2rem',
          fontFamily: 'librebaskerville-bold, serif',
          fontWeight: 'bold'
        }}>
          Signaling the American Spirit
        </h2>
        
                <section style={{ marginTop: '2em' }}>
          <h3 className="activations-title">
            Live Activations
          </h3>
          <ActivationTable />
        </section>

        {/* Elegant Page Teasers */}
        <section style={{ marginTop: '3em', paddingTop: '2em', borderTop: '2px solid var(--bronze)' }}>
          <h3 className="activations-title" style={{ marginBottom: '2rem' }}>
            Explore America250
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* QSL Cards Teaser */}
            <Link href="/qsl-cards" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(247, 241, 226, 0.8)',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '2px solid var(--bronze)',
                boxShadow: '0 2px 8px rgba(104, 63, 27, 0.1)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                height: '100%'
              }}
              className="teaser-card"
              >
                <h4 style={{
                  fontFamily: 'librebaskerville-bold, serif',
                  color: 'var(--mahogany)',
                  fontSize: '1.4rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📡 K4A QSL Cards
                </h4>
                <p style={{
                  lineHeight: '1.6',
                  color: 'var(--mahogany)',
                  marginBottom: '1rem',
                  fontSize: '1.05rem'
                }}>
                  Discover our beautiful commemorative QSL cards featuring Independence Hall and the Declaration of Independence. 
                  Available as both donor and free options to celebrate America&apos;s 250th Anniversary.
                </p>
                <div style={{
                  fontFamily: 'librebaskerville-bold, serif',
                  color: 'var(--bronze)',
                  fontSize: '1rem'
                }}>
                  View QSL Card Gallery →
                </div>
              </div>
            </Link>

            {/* Meet the Founders Teaser */}
            <Link href="/meet-the-founders" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(247, 241, 226, 0.8)',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '2px solid var(--bronze)',
                boxShadow: '0 2px 8px rgba(104, 63, 27, 0.1)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              className="teaser-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <h4 style={{
                    fontFamily: 'librebaskerville-bold, serif',
                    color: 'var(--mahogany)',
                    fontSize: '1.4rem',
                    margin: 0
                  }}>
                    🖋️ Meet the Founders
                  </h4>
                  <Image
                    src="/inkwell.webp"
                    alt="Quill and Inkwell"
                    width={40}
                    height={50}
                    style={{ 
                      width: 'auto',
                      height: 'auto',
                      filter: 'drop-shadow(1px 1px 2px rgba(104, 63, 27, 0.3))'
                    }}
                  />
                </div>
                <p style={{
                  lineHeight: '1.6',
                  color: 'var(--mahogany)',
                  marginBottom: '1rem',
                  fontSize: '1.05rem',
                  flex: 1
                }}>
                  Uncover fascinating stories about the Declaration of Independence signers - from John Hancock&apos;s 
                  dramatic signature to musical inventors and political dynasties. History you never learned in school!
                </p>
                <div style={{
                  fontFamily: 'librebaskerville-bold, serif',
                  color: 'var(--bronze)',
                  fontSize: '1rem'
                }}>
                  Discover the Rest of the Story →
                </div>
              </div>
            </Link>
          </div>
        </section>
        </div>
      </main>
    </>
  );
}
