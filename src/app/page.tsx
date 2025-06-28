import ActivationTable from '../components/ActivationTable';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="parchment-bg">
      <div className="container">
        {/* Header Image - positioned at the top with same width as Activation Table */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: '0.5em',
          padding: '0 20px',
          maxWidth: '100%'
        }}>
          <Image
            src="/america250-ncs-header-image.webp"
            alt="America250 NCS Header"
            width={800}
            height={400}
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: '800px',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(104, 63, 27, 0.15)'
            }}
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

        {/* QSL Card Examples and Instructions */}
        <section style={{ marginTop: '3em', paddingTop: '2em', borderTop: '2px solid var(--bronze)' }}>
          <h3 className="activations-title">
            QSL Cards for America250
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gap: '2rem',
            marginTop: '1.5rem'
          }}>
            {/* QSL Card Information */}
            <div style={{
              background: 'rgba(247, 241, 226, 0.8)',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid var(--bronze)',
              boxShadow: '0 2px 8px rgba(104, 63, 27, 0.1)'
            }}>
              <h4 style={{ 
                fontFamily: 'librebaskerville-bold, serif',
                color: 'var(--mahogany)',
                marginBottom: '1rem',
                fontSize: '1.3rem'
              }}>
                What is a QSL Card?
              </h4>
              <p style={{ lineHeight: '1.7', marginBottom: '1rem' }}>
                QSL cards are confirmation postcards that amateur radio operators exchange to verify radio contact. 
                For America&apos;s 250th Anniversary, these cards become special commemorative keepsakes of this historic event.
              </p>
              <p style={{ lineHeight: '1.7' }}>
                <strong>As an America250 volunteer:</strong> You may receive QSL card requests from operators you contact. 
                These cards help confirm participation in this milestone celebration and support various amateur radio awards programs.
              </p>
            </div>

            {/* K4A QSL Card Examples - Stacked Display */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              alignItems: 'center'
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
                <h5 style={{ 
                  fontFamily: 'librebaskerville-bold, serif',
                  color: 'var(--mahogany)',
                  marginBottom: '1rem',
                  fontSize: '1.2rem'
                }}>
                  Limited Edition Donor Card
                </h5>
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
                <h5 style={{ 
                  fontFamily: 'librebaskerville-bold, serif',
                  color: 'var(--mahogany)',
                  marginBottom: '1rem',
                  fontSize: '1.2rem'
                }}>
                  Donor-Free Card
                </h5>
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
              boxShadow: '0 2px 8px rgba(104, 63, 27, 0.1)'
            }}>
              <h4 style={{ 
                fontFamily: 'librebaskerville-bold, serif',
                color: 'var(--mahogany)',
                marginBottom: '1rem',
                fontSize: '1.3rem'
              }}>
                How to Request K4A QSL Cards
              </h4>
              
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
                marginBottom: '1.5rem'
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
        </section>

                 {/* Declaration of Independence - The Rest of the Story */}
        <section style={{ marginTop: '3em', paddingTop: '2em', borderTop: '2px solid var(--bronze)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h3 className="activations-title" style={{ margin: 0, textAlign: 'center' }}>
              Declaration of Independence
            </h3>
            <Image
              src="/inkwell.webp"
              alt="Ornate Quill and Inkwell"
              width={80}
              height={100}
              style={{ 
                height: 'auto',
                filter: 'drop-shadow(2px 2px 4px rgba(104, 63, 27, 0.3))'
              }}
            />
                         <div style={{
               fontFamily: 'librebaskerville-bold, serif',
               fontSize: '1.3rem',
               color: 'var(--bronze)',
               fontStyle: 'italic',
               textAlign: 'center'
             }}>
               &quot;The Rest of the Story&quot;
             </div>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gap: '1.5rem',
            marginTop: '1.5rem',
            maxWidth: 'calc(100% - 40px)',
            margin: '0 auto'
          }}>
            {/* Signing Facts */}
            <div style={{
              background: 'rgba(247, 241, 226, 0.8)',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid var(--bronze)',
              boxShadow: '0 2px 8px rgba(104, 63, 27, 0.1)'
            }}>
              <h4 style={{ 
                fontFamily: 'librebaskerville-bold, serif',
                color: 'var(--mahogany)',
                marginBottom: '1rem',
                fontSize: '1.2rem',
                borderBottom: '1px solid var(--bronze)',
                paddingBottom: '0.5rem'
              }}>
                📜 Signing Surprises
              </h4>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ lineHeight: '1.6' }}>
                  <strong>Not Signed on July 4th:</strong> Although the Declaration was adopted on July 4, 1776, most signers did not actually sign it until August 2, with some adding their names in the following weeks.
                </div>
                <div style={{ lineHeight: '1.6' }}>
                                     <strong>The Signature That Became Famous:</strong> John Hancock&apos;s bold, oversized signature is the most famous. He was the first to sign and did so with dramatic flair, reportedly saying, &quot;I guess King George will be able to read that!&quot; The phrase &quot;John Hancock&quot; is now synonymous with &quot;signature.&quot;
                </div>
              </div>
            </div>

            {/* Age & Demographics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                background: 'rgba(247, 241, 226, 0.8)',
                padding: '1.25rem',
                borderRadius: '8px',
                border: '2px solid var(--bronze)',
                boxShadow: '0 2px 8px rgba(104, 63, 27, 0.1)'
              }}>
                <h5 style={{ 
                  fontFamily: 'librebaskerville-bold, serif',
                  color: 'var(--mahogany)',
                  marginBottom: '1rem',
                  fontSize: '1.1rem'
                }}>
                  👥 Ages & Origins
                </h5>
                <div style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                  <strong>Youngest Signers:</strong> Edward Rutledge and Thomas Lynch Jr., both just 26 years old from South Carolina.
                </div>
                <div style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                  <strong>Oldest Signer:</strong> Benjamin Franklin, at 70.
                </div>
                <div style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                  <strong>International Founders:</strong> Eight signers were born outside the American colonies, hailing from the British Isles—making the Declaration truly international.
                </div>
              </div>

              <div style={{
                background: 'rgba(247, 241, 226, 0.8)',
                padding: '1.25rem',
                borderRadius: '8px',
                border: '2px solid var(--bronze)',
                boxShadow: '0 2px 8px rgba(104, 63, 27, 0.1)'
              }}>
                <h5 style={{ 
                  fontFamily: 'librebaskerville-bold, serif',
                  color: 'var(--mahogany)',
                  marginBottom: '1rem',
                  fontSize: '1.1rem'
                }}>
                  💼 Diverse Professions
                </h5>
                <div style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                  While many signers were lawyers, the group included businessmen, farmers, teachers, and even a minister—John Witherspoon of New Jersey, the only active clergyman to sign.
                </div>
                <div style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                  <strong>College President:</strong> John Witherspoon was president of the College of New Jersey, which later became Princeton University.
                </div>
              </div>
            </div>

            {/* Fascinating Facts */}
            <div style={{
              background: 'rgba(247, 241, 226, 0.8)',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid var(--bronze)',
              boxShadow: '0 2px 8px rgba(104, 63, 27, 0.1)'
            }}>
              <h4 style={{ 
                fontFamily: 'librebaskerville-bold, serif',
                color: 'var(--mahogany)',
                marginBottom: '1rem',
                fontSize: '1.2rem',
                borderBottom: '1px solid var(--bronze)',
                paddingBottom: '0.5rem'
              }}>
                🎭 Remarkable Lives & Legacies
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.25rem'
              }}>
                <div style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
                                     <strong>Musical Inventors:</strong> Francis Hopkinson invented the &quot;Bellarmonic,&quot; and Benjamin Franklin created the &quot;glass armonica&quot;—instruments that never caught on.
                </div>
                <div style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
                  <strong>Brothers in Liberty:</strong> Francis Lightfoot Lee and Richard Henry Lee of Virginia were one of only two pairs of brothers to sign.
                </div>
                <div style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
                  <strong>Political Dynasty:</strong> Benjamin Harrison was the father and great-grandfather of two future U.S. presidents: William Henry Harrison and Benjamin Harrison.
                </div>
                <div style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
                  <strong>Survival Stories:</strong> Francis Lewis survived two shipwrecks before emigrating to America, while Thomas Lynch Jr. vanished at sea in 1779, never to be found.
                </div>
              </div>
            </div>

            {/* War Consequences */}
            <div style={{
              background: 'rgba(247, 241, 226, 0.8)',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid var(--bronze)',
              boxShadow: '0 2px 8px rgba(104, 63, 27, 0.1)'
            }}>
              <h4 style={{ 
                fontFamily: 'librebaskerville-bold, serif',
                color: 'var(--mahogany)',
                marginBottom: '1rem',
                fontSize: '1.2rem',
                borderBottom: '1px solid var(--bronze)',
                paddingBottom: '0.5rem'
              }}>
                ⚔️ The Price of Freedom
              </h4>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ lineHeight: '1.6' }}>
                  <strong>Tragic Fates:</strong> Nine signers died before American independence was officially won.
                </div>
                <div style={{ lineHeight: '1.6' }}>
                  <strong>Personal Sacrifices:</strong> Several signers, such as William Floyd and Francis Lewis, had their homes and estates destroyed by the British during the war.
                </div>
                <div style={{ lineHeight: '1.6' }}>
                  <strong>From Captive to Governor:</strong> George Walton, a signer from Georgia, was captured by the British during the war, later became governor of Georgia, and helped found what would become the University of Georgia.
                </div>
                <div style={{ lineHeight: '1.6' }}>
                  <strong>Last Survivor:</strong> Charles Carroll of Carrollton was the last surviving signer, dying at age 95 in 1832—linking the founding generation to the era of Andrew Jackson.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
