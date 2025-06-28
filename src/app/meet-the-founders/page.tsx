import Image from 'next/image';
import Navigation from '../../components/Navigation';

export default function MeetTheFoundersPage() {
  return (
    <>
      <Navigation />
      <main className="parchment-bg">
        <div className="container" style={{ marginTop: '2rem' }}>
          {/* Page Header with Quill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingBottom: '2rem',
            borderBottom: '2px solid var(--bronze)'
          }}>
            <h1 style={{
              fontFamily: 'librebaskerville-bold, serif',
              fontSize: '3rem',
              color: 'var(--mahogany)',
              margin: 0,
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(104, 63, 27, 0.1)'
            }}>
              Declaration of Independence
            </h1>
            <Image
              src="/inkwell.webp"
              alt="Ornate Quill and Inkwell"
              width={100}
              height={125}
              style={{ 
                height: 'auto',
                filter: 'drop-shadow(2px 2px 4px rgba(104, 63, 27, 0.3))'
              }}
            />
            <div style={{
              fontFamily: 'librebaskerville-bold, serif',
              fontSize: '1.5rem',
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
              <h3 style={{ 
                fontFamily: 'librebaskerville-bold, serif',
                color: 'var(--mahogany)',
                marginBottom: '1rem',
                fontSize: '1.4rem',
                borderBottom: '1px solid var(--bronze)',
                paddingBottom: '0.5rem'
              }}>
                📜 Signing Surprises
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ lineHeight: '1.6', fontSize: '1.05rem' }}>
                  <strong>Not Signed on July 4th:</strong> Although the Declaration was adopted on July 4, 1776, most signers did not actually sign it until August 2, with some adding their names in the following weeks.
                </div>
                <div style={{ lineHeight: '1.6', fontSize: '1.05rem' }}>
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
                <h4 style={{ 
                  fontFamily: 'librebaskerville-bold, serif',
                  color: 'var(--mahogany)',
                  marginBottom: '1rem',
                  fontSize: '1.2rem'
                }}>
                  👥 Ages & Origins
                </h4>
                <div style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                  <strong>Youngest Signers:</strong> Edward Rutledge and Thomas Lynch Jr., both just 26 years old from South Carolina.
                </div>
                <div style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                  <strong>Oldest Signer:</strong> Benjamin Franklin, at 70.
                </div>
                <div style={{ fontSize: '1rem', lineHeight: '1.6' }}>
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
                <h4 style={{ 
                  fontFamily: 'librebaskerville-bold, serif',
                  color: 'var(--mahogany)',
                  marginBottom: '1rem',
                  fontSize: '1.2rem'
                }}>
                  💼 Diverse Professions
                </h4>
                <div style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                  While many signers were lawyers, the group included businessmen, farmers, teachers, and even a minister—John Witherspoon of New Jersey, the only active clergyman to sign.
                </div>
                <div style={{ fontSize: '1rem', lineHeight: '1.6' }}>
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
              <h3 style={{ 
                fontFamily: 'librebaskerville-bold, serif',
                color: 'var(--mahogany)',
                marginBottom: '1rem',
                fontSize: '1.4rem',
                borderBottom: '1px solid var(--bronze)',
                paddingBottom: '0.5rem'
              }}>
                🎭 Remarkable Lives & Legacies
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.25rem'
              }}>
                <div style={{ lineHeight: '1.6', fontSize: '1rem' }}>
                  <strong>Musical Inventors:</strong> Francis Hopkinson invented the &quot;Bellarmonic,&quot; and Benjamin Franklin created the &quot;glass armonica&quot;—instruments that never caught on.
                </div>
                <div style={{ lineHeight: '1.6', fontSize: '1rem' }}>
                  <strong>Brothers in Liberty:</strong> Francis Lightfoot Lee and Richard Henry Lee of Virginia were one of only two pairs of brothers to sign.
                </div>
                <div style={{ lineHeight: '1.6', fontSize: '1rem' }}>
                  <strong>Political Dynasty:</strong> Benjamin Harrison was the father and great-grandfather of two future U.S. presidents: William Henry Harrison and Benjamin Harrison.
                </div>
                <div style={{ lineHeight: '1.6', fontSize: '1rem' }}>
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
               boxShadow: '0 2px 8px rgba(104, 63, 27, 0.1)',
               marginBottom: '2rem'
             }}>
               <div style={{
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '1rem',
                 marginBottom: '1rem',
                 flexWrap: 'wrap'
               }}>
                 {/* Betsy Ross Flag Placeholder */}
                 <div style={{
                   width: '60px',
                   height: '40px',
                   background: 'linear-gradient(to right, #1f3a93 0%, #1f3a93 50%, #ffffff 50%, #ffffff 60%, #c41e3a 60%)',
                   borderRadius: '4px',
                   boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                   transform: 'skew(-10deg)',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   fontSize: '0.7rem',
                   color: 'white',
                   fontWeight: 'bold'
                 }}>
                   ⭐13⭐
                 </div>
                 
                 <h3 style={{ 
                   fontFamily: 'librebaskerville-bold, serif',
                   color: 'var(--mahogany)',
                   margin: 0,
                   fontSize: '1.4rem',
                   borderBottom: '1px solid var(--bronze)',
                   paddingBottom: '0.5rem'
                 }}>
                   ⚔️ The Price of Freedom
                 </h3>
                 
                 {/* British Union Jack Flag Placeholder */}
                 <div style={{
                   width: '60px',
                   height: '40px',
                   background: 'linear-gradient(45deg, #1f3a93 25%, #c41e3a 25%, #c41e3a 50%, #1f3a93 50%, #1f3a93 75%, #c41e3a 75%)',
                   borderRadius: '4px',
                   boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                   transform: 'skew(10deg)',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   fontSize: '0.7rem',
                   color: 'white',
                   fontWeight: 'bold'
                 }}>
                   🇬🇧
                 </div>
               </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ lineHeight: '1.6', fontSize: '1.05rem' }}>
                  <strong>Tragic Fates:</strong> Nine signers died before American independence was officially won.
                </div>
                <div style={{ lineHeight: '1.6', fontSize: '1.05rem' }}>
                  <strong>Personal Sacrifices:</strong> Several signers, such as William Floyd and Francis Lewis, had their homes and estates destroyed by the British during the war.
                </div>
                <div style={{ lineHeight: '1.6', fontSize: '1.05rem' }}>
                  <strong>From Captive to Governor:</strong> George Walton, a signer from Georgia, was captured by the British during the war, later became governor of Georgia, and helped found what would become the University of Georgia.
                </div>
                <div style={{ lineHeight: '1.6', fontSize: '1.05rem' }}>
                  <strong>Last Survivor:</strong> Charles Carroll of Carrollton was the last surviving signer, dying at age 95 in 1832—linking the founding generation to the era of Andrew Jackson.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 