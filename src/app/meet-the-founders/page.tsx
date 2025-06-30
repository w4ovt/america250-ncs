'use client';

import Image from 'next/image';
import Navigation from '../../components/Navigation';

export default function MeetTheFoundersPage() {
  return (
    <>
      <Navigation />
      <main className="parchment-bg">
        <div className="container" style={{ 
          marginTop: '6rem',
          background: 'none !important',
          boxShadow: 'none !important',
          padding: '0 1rem',
          position: 'relative'
        }}>
          {/* Desktop opacity background that extends above header */}
          <div style={{
            position: 'absolute',
            top: '-2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '1600px',
            height: 'calc(100% + 4rem)',
            background: 'rgba(247, 241, 226, 0.6)',
            borderRadius: '8px',
            zIndex: -1,
            pointerEvents: 'none'
          }}></div>
          {/* Page Header with Quill */}
          <div style={{
            background: 'rgba(247, 241, 226, 0.9)',
            padding: '2rem',
            borderRadius: '12px',
            border: '3px solid var(--bronze)',
            boxShadow: '0 4px 12px rgba(104, 63, 27, 0.15)',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontFamily: 'librebaskerville-bold, serif',
              fontSize: 'clamp(2rem, 8vw, 3rem)',
              color: 'var(--mahogany)',
              margin: '0 0 1rem 0',
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(104, 63, 27, 0.1)',
              lineHeight: '1.2'
            }}>
              Declaration of Independence
            </h1>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '1rem',
              flexWrap: 'wrap'
            }}>
              <Image
                src="/inkwell.webp"
                alt="Ornate Quill and Inkwell"
                width={100}
                height={125}
                style={{ 
                  width: 'auto',
                  height: 'auto',
                  maxHeight: '100px',
                  filter: 'drop-shadow(2px 2px 4px rgba(104, 63, 27, 0.3))'
                }}
              />
              <div style={{
                fontFamily: 'librebaskerville-bold, serif',
                fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
                color: 'var(--bronze)',
                fontStyle: 'italic',
                textAlign: 'center'
              }}>
                &quot;The Rest of the Story&quot;
              </div>
            </div>
          </div>

          {/* Paul Harvey Video Section */}
          <div style={{
            background: 'rgba(247, 241, 226, 0.9)',
            padding: '2rem',
            borderRadius: '12px',
            border: '3px solid var(--bronze)',
            boxShadow: '0 4px 12px rgba(104, 63, 27, 0.15)',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontFamily: 'librebaskerville-bold, serif',
              fontSize: '2.2rem',
              color: 'var(--mahogany)',
              marginBottom: '1rem',
              textShadow: '2px 2px 4px rgba(104, 63, 27, 0.1)'
            }}>
              🎙️ Paul Harvey&apos;s &quot;Freedom to Die&quot;
            </h2>
            <p style={{
              fontSize: '1.2rem',
              lineHeight: '1.6',
              color: 'var(--mahogany)',
              marginBottom: '1.5rem',
              fontStyle: 'italic'
            }}>
              The legendary broadcaster&apos;s stirring tribute to the signers of the Declaration of Independence
            </p>
            
            <div style={{
              position: 'relative',
              display: 'inline-block',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(104, 63, 27, 0.3)',
              marginBottom: '1rem',
              width: '100%',
              maxWidth: '500px'
            }}>
                             <a 
                 href="https://youtu.be/_XJperPKQvA?si=WQqAClRKOfeOx9rw"
                 target="_blank"
                 rel="noopener noreferrer"
                style={{
                  display: 'block',
                  position: 'relative',
                  textDecoration: 'none'
                }}
              >
                                                  <Image
                   src="/books/paul-harvey-video.webp"
                   alt="Paul Harvey - Declaration of Independence: Freedom to Die"
                   width={500}
                   height={281}
                   style={{
                     width: '100%',
                     maxWidth: '500px',
                     height: 'auto',
                     display: 'block',
                     transition: 'transform 0.3s ease, filter 0.3s ease'
                   }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.filter = 'brightness(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.filter = 'brightness(1)';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}>
                  ▶️
                </div>
              </a>
            </div>
            
            <p style={{
              fontSize: '1rem',
              color: 'var(--bronze)',
              fontStyle: 'italic',
              margin: 0
            }}>
              Click to watch this powerful 4-minute tribute on YouTube
            </p>
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
               <h3 style={{ 
                 fontFamily: 'librebaskerville-bold, serif',
                 color: 'var(--mahogany)',
                 marginBottom: '1rem',
                 fontSize: '1.4rem',
                 borderBottom: '1px solid var(--bronze)',
                 paddingBottom: '0.5rem',
                 textAlign: 'center'
               }}>
                 🇺🇸 ⚔️ The Price of Freedom ⚔️ 🇺🇸
               </h3>
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

            {/* Adult Reading Section */}
            <div style={{
              background: 'rgba(247, 241, 226, 0.9)',
              padding: '2rem',
              borderRadius: '12px',
              border: '3px solid var(--bronze)',
              boxShadow: '0 4px 12px rgba(104, 63, 27, 0.15)',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontFamily: 'librebaskerville-bold, serif',
                fontSize: '2.5rem',
                color: 'var(--mahogany)',
                textAlign: 'center',
                marginBottom: '1rem',
                textShadow: '2px 2px 4px rgba(104, 63, 27, 0.1)'
              }}>
                📚 Suggested Reading
              </h2>
              <p style={{
                fontSize: '1.2rem',
                textAlign: 'center',
                color: 'var(--bronze)',
                fontStyle: 'italic',
                marginBottom: '2rem'
              }}>
                Deepen your understanding of America&apos;s founding with these essential books
              </p>
              
                             <div style={{
                 display: 'grid',
                 gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                 gap: '1.5rem',
                 justifyItems: 'center'
               }}>
                <div style={{ textAlign: 'center' }}>
                                     <Image
                     src="/books/american-scripture.webp"
                     alt="American Scripture by Pauline Maier"
                     width={200}
                     height={300}
                     style={{
                       width: '100%',
                       maxWidth: '200px',
                       height: 'auto',
                       aspectRatio: '2/3',
                       borderRadius: '8px',
                       boxShadow: '0 4px 15px rgba(104, 63, 27, 0.3)',
                       marginBottom: '1rem',
                       transition: 'transform 0.3s ease'
                     }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <h4 style={{
                    fontFamily: 'librebaskerville-bold, serif',
                    color: 'var(--mahogany)',
                    fontSize: '1.1rem',
                    marginBottom: '0.5rem'
                  }}>
                    American Scripture
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--bronze)', fontStyle: 'italic' }}>
                    by Pauline Maier
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                                     <Image
                     src="/books/global-history.webp"
                     alt="The Global History of the Declaration of Independence"
                     width={200}
                     height={300}
                     style={{
                       width: '100%',
                       maxWidth: '200px',
                       height: 'auto',
                       aspectRatio: '2/3',
                       borderRadius: '8px',
                       boxShadow: '0 4px 15px rgba(104, 63, 27, 0.3)',
                       marginBottom: '1rem',
                       transition: 'transform 0.3s ease'
                     }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <h4 style={{
                    fontFamily: 'librebaskerville-bold, serif',
                    color: 'var(--mahogany)',
                    fontSize: '1.1rem',
                    marginBottom: '0.5rem'
                  }}>
                    The Global History of the Declaration of Independence
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--bronze)', fontStyle: 'italic' }}>
                    by David Armitage
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Image
                    src="/books/our-lives.webp"
                    alt="Our Lives, Our Fortunes and Our Sacred Honor"
                    width={200}
                    height={300}
                    style={{
                      width: '100%',
                      maxWidth: '200px',
                      height: 'auto',
                      aspectRatio: '2/3',
                      borderRadius: '8px',
                      boxShadow: '0 4px 15px rgba(104, 63, 27, 0.3)',
                      marginBottom: '1rem',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <h4 style={{
                    fontFamily: 'librebaskerville-bold, serif',
                    color: 'var(--mahogany)',
                    fontSize: '1.1rem',
                    marginBottom: '0.5rem'
                  }}>
                    Our Lives, Our Fortunes and Our Sacred Honor
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--bronze)', fontStyle: 'italic' }}>
                    by Richard R. Beeman
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Image
                    src="/books/signing-lives.webp"
                    alt="Signing Their Lives Away"
                    width={200}
                    height={300}
                    style={{
                      width: '100%',
                      maxWidth: '200px',
                      height: 'auto',
                      aspectRatio: '2/3',
                      borderRadius: '8px',
                      boxShadow: '0 4px 15px rgba(104, 63, 27, 0.3)',
                      marginBottom: '1rem',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <h4 style={{
                    fontFamily: 'librebaskerville-bold, serif',
                    color: 'var(--mahogany)',
                    fontSize: '1.1rem',
                    marginBottom: '0.5rem'
                  }}>
                    Signing Their Lives Away
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--bronze)', fontStyle: 'italic' }}>
                    by Denise Kiernan & Joseph D&apos;Agnese
                  </p>
                </div>
              </div>
            </div>

            {/* Kids Corner Section */}
            <div style={{
              background: 'rgba(247, 241, 226, 0.9)',
              padding: '2rem',
              borderRadius: '12px',
              border: '3px solid var(--bronze)',
              boxShadow: '0 4px 12px rgba(104, 63, 27, 0.15)',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontFamily: 'librebaskerville-bold, serif',
                fontSize: '2.5rem',
                color: 'var(--mahogany)',
                textAlign: 'center',
                marginBottom: '1rem',
                textShadow: '2px 2px 4px rgba(104, 63, 27, 0.1)'
              }}>
                🎨 Kid&apos;s Corner
              </h2>
              <p style={{
                fontSize: '1.2rem',
                textAlign: 'center',
                color: 'var(--bronze)',
                fontStyle: 'italic',
                marginBottom: '2rem'
              }}>
                Fun and engaging books to help young patriots learn about America&apos;s founding
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                flexWrap: 'wrap'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <Image
                    src="/books/if-a-kid.webp"
                    alt="If a Kid Ran America"
                    width={180}
                    height={270}
                    style={{
                      width: '100%',
                      maxWidth: '180px',
                      height: 'auto',
                      aspectRatio: '2/3',
                      borderRadius: '8px',
                      boxShadow: '0 4px 15px rgba(104, 63, 27, 0.3)',
                      marginBottom: '1rem',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05) rotate(2deg)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                  />
                  <h4 style={{
                    fontFamily: 'librebaskerville-bold, serif',
                    color: 'var(--mahogany)',
                    fontSize: '1.1rem',
                    marginBottom: '0.5rem'
                  }}>
                    If a Kid Ran America
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--bronze)', fontStyle: 'italic' }}>
                    by Catherine Stier
                  </p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Image
                    src="/books/words-made-america.webp"
                    alt="The Words That Made America"
                    width={180}
                    height={270}
                    style={{
                      width: '100%',
                      maxWidth: '180px',
                      height: 'auto',
                      aspectRatio: '2/3',
                      borderRadius: '8px',
                      boxShadow: '0 4px 15px rgba(104, 63, 27, 0.3)',
                      marginBottom: '1rem',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05) rotate(-2deg)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                  />
                  <h4 style={{
                    fontFamily: 'librebaskerville-bold, serif',
                    color: 'var(--mahogany)',
                    fontSize: '1.1rem',
                    marginBottom: '0.5rem'
                  }}>
                    The Words That Made America
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--bronze)', fontStyle: 'italic' }}>
                    by Susan Goldman Rubin
                  </p>
                </div>
              </div>
              
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '1rem',
                  color: 'var(--mahogany)',
                  fontFamily: 'librebaskerville-bold, serif',
                  margin: 0
                }}>
                  🌟 Perfect for ages 8-12 • Inspire the next generation of patriots! 🌟
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 