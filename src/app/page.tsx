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
          <div 
            className="header-image-container"
            style={{
              display: 'inline-block',
              width: '100%',
              maxWidth: '800px'
            }}
          >
            <Image
              src="/america250-ncs-header-image.webp"
              alt="America250 NCS Header"
              width={800}
              height={509}
              priority
              style={{
                width: "100%",
                height: "auto",
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(104, 63, 27, 0.15)'
              }}
            />
          </div>
        </div>
        
        {/* MAGNIFICENT AMERICA250 - Old Claude Historical Typography */}
        <h1 className="homepage-title" style={{ 
          textAlign: 'center', 
          marginBottom: '0.5em',
          marginTop: '0.2em',
          lineHeight: '1.2',
          position: 'relative',
          fontFamily: "'Old Claude', serif"
        }}>
          {/* AMERICA250 - Dominant Text (80pt + 12pt spread) */}
          <div style={{
            fontSize: '5.33rem', // 80pt
            fontFamily: "'Old Claude', serif",
            fontWeight: 'normal',
            color: '#2c1810',
            textShadow: '1px 1px 1px rgba(0, 0, 0, 0.4)',
            letterSpacing: '0.8rem', // 12pt spread
            marginBottom: '0.5rem'
          }}>
            AMERICA250
          </div>
          
          {/* Declaration of Independence (30pt) */}
          <div style={{
            fontSize: '2rem', // 30pt
            fontFamily: "'Old Claude', serif",
            fontWeight: 'normal',
            color: '#2c1810',
            textShadow: '1px 1px 1px rgba(0, 0, 0, 0.4)',
            letterSpacing: 'normal',
            marginBottom: '0.3rem'
          }}>
            DECLARATION OF INDEPENDENCE
          </div>
          
          {/* Semiquincentennial (30pt + 10pt spread) */}
          <div style={{
            fontSize: '2rem', // 30pt
            fontFamily: "'Old Claude', serif",
            fontWeight: 'normal',
            color: '#2c1810',
            textShadow: '1px 1px 1px rgba(0, 0, 0, 0.4)',
            letterSpacing: '0.67rem', // 10pt spread
            marginBottom: '0.3rem'
          }}>
            SEMIQUINCENTENNIAL
          </div>
          
          {/* Commemoration & Celebration (30pt) */}
          <div style={{
            fontSize: '2rem', // 30pt
            fontFamily: "'Old Claude', serif",
            fontWeight: 'normal',
            color: '#2c1810',
            textShadow: '1px 1px 1px rgba(0, 0, 0, 0.4)',
            letterSpacing: 'normal'
          }}>
            COMMEMORATION & CELEBRATION
          </div>
        </h1>
        

        
        {/* SEO-Rich Description */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1em',
          padding: '0 2rem',
          maxWidth: '800px',
          margin: '0 auto 1em auto'
        }}>
          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: 'var(--mahogany)',
            fontStyle: 'italic'
          }}>
            CQ, CQ, CQ, calling all Amateur Radio Operators, join the <strong>AMERICA250.radio</strong> project celebrating America&rsquo;s <strong>Semiquincentennial</strong>! 
            Participate in the <strong>Chasing Cornwallis Challenge</strong>, connect with <strong>K4A Kilo4America</strong> stations, 
            and volunteer as a <strong>Net Control Operator</strong> in this historic amateur radio commemoration 
            of the American Revolution and our nation&rsquo;s founding.
          </p>
        </div>
        
                {/* Brass Separator after Header */}
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, var(--bronze) 0%, #D4AF37 50%, var(--bronze) 100%)',
          boxShadow: '0 2px 6px rgba(212, 175, 55, 0.6)',
          margin: '2rem 0',
          borderRadius: '2px'
        }}></div>

        <section style={{ marginTop: '1em' }}>
          <h3 className="activations-title">
            Live Activations
          </h3>
          <ActivationTable />
        </section>

        {/* Elegant Page Teasers */}
        <section style={{ marginTop: '1.5em' }}>
          {/* Prominent Quill & Inkwell */}
          <div style={{
            textAlign: 'center',
            marginBottom: '0.25rem'
          }}>
            <Image
              src="/inkwell.webp"
              alt="Ornate Quill and Inkwell"
              width={120}
              height={150}
              style={{ 
                width: 'auto',
                height: 'auto',
                filter: 'drop-shadow(3px 3px 6px rgba(104, 63, 27, 0.4))'
              }}
            />
          </div>
          
          <h3 className="activations-title" style={{ marginTop: '0', marginBottom: '1rem' }}>
            EXPLORE AMERICA250
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }} className="responsive-grid"
          >
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
                <h4 style={{
                  fontFamily: 'librebaskerville-bold, serif',
                  color: 'var(--mahogany)',
                  fontSize: '1.4rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📜 Meet the Founders
                </h4>
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

        {/* Chasing Cornwallis Challenge Section */}
        <section style={{ marginTop: '3em' }}>
          {/* Brass Separator Bar */}
          <div style={{
            height: '4px',
            background: 'linear-gradient(90deg, var(--bronze) 0%, #D4AF37 50%, var(--bronze) 100%)',
            boxShadow: '0 2px 6px rgba(212, 175, 55, 0.6)',
            margin: '2rem 0',
            borderRadius: '2px'
          }}></div>

          {/* Section Title */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{
              fontFamily: 'librebaskerville-bold, serif',
              fontSize: '2.5rem',
              color: 'var(--mahogany)',
              margin: '0 0 0.5rem 0',
              textShadow: '2px 2px 4px rgba(104, 63, 27, 0.1)',
              letterSpacing: '0.05em'
            }}>
              CHASING CORNWALLIS CHALLENGE
            </h2>
            <h3 style={{
              fontFamily: 'librebaskerville-bold, serif',
              fontSize: '1.3rem',
              color: 'var(--bronze)',
              margin: '0',
              fontStyle: 'italic',
              letterSpacing: '0.08em'
            }}>
              Six Epic Battles • One Historic Journey • Your Victory Certificate Awaits
            </h3>
          </div>

          {/* Narrative Text */}
          <div style={{
            background: 'rgba(247, 241, 226, 0.8)',
            padding: '2rem',
            borderRadius: '12px',
            border: '2px solid var(--bronze)',
            boxShadow: '0 4px 12px rgba(104, 63, 27, 0.1)',
            marginBottom: '2.5rem',
            maxWidth: 'calc(100% - 40px)',
            margin: '0 auto 2.5rem auto'
          }}>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.7',
              color: 'var(--mahogany)',
              marginBottom: '1.5rem',
              fontFamily: 'librebaskerville-regular, serif'
            }}>
              Join the <strong>Chasing Cornwallis Challenge</strong> and become part of a living legacy that honors the pivotal battles of the Southern Campaign of the American Revolution—the deterministic battles that shaped America&apos;s destiny. As you make on-air contacts and connect with thousands of operators across the country, you&apos;re not just making contacts—you&apos;re stepping into history, celebrating the spirit of freedom and unity that made America possible.
            </p>
            
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.7',
              color: 'var(--mahogany)',
              marginBottom: '1.5rem',
              fontFamily: 'librebaskerville-regular, serif'
            }}>
              This July 1–7, join with fellow Amateur Radio operators to commemorate the <strong>Semiquincentennial of the Declaration of Independence</strong> with <strong>K4A - Kilo4America</strong>, a special event that unites our country in remembrance and reverence. By making contacts at just <strong>five of our six annual events</strong>, you will proudly earn the year-end Certificate shown below to proudly display in your Shack—a symbol of your dedication, skill, and connection to the Men and Women who won America.
            </p>
            
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.7',
              color: 'var(--mahogany)',
              marginBottom: '1.5rem',
              fontFamily: 'librebaskerville-regular, serif'
            }}>
              But the adventure doesn&apos;t stop there: <strong>Volunteer as a Net Control Operator</strong> and help guide the action, ensuring every voice is heard. Your leadership will inspire others and keep the spirit of discovery alive.
            </p>
            
            <p style={{
              fontSize: '1.15rem',
              lineHeight: '1.7',
              color: 'var(--mahogany)',
              margin: '0',
              fontFamily: 'librebaskerville-bold, serif',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '1rem',
              background: 'rgba(199, 161, 89, 0.1)',
              borderRadius: '8px',
              border: '1px solid var(--bronze)'
            }}>
              Don&apos;t just listen—be part of the story. Join the Chasing Cornwallis Challenge, earn your Certificate, and consider stepping up as a Net Control Operator. Together, let&apos;s rally to <em>&quot;Signal the American Spirit.&quot;</em>
            </p>
          </div>

          {/* Battle Schedule and Certificate Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }} className="certificate-grid"
          >
            {/* Left Column: Cornwallis & Battle Schedule */}
            <div style={{
              background: 'rgba(247, 241, 226, 0.8)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '2px solid var(--bronze)',
              boxShadow: '0 4px 12px rgba(104, 63, 27, 0.1)',
              minWidth: 0,
              overflow: 'hidden'
            }} className="battle-schedule-column"
            >
              {/* Cornwallis Portrait */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }} className="cornwallis-portrait">
                <Image
                  src="/cornwallis.webp"
                  alt="British Lord Charles Cornwallis"
                  width={350}
                  height={350}
                  style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    border: '4px solid var(--bronze)',
                    boxShadow: '0 4px 12px rgba(104, 63, 27, 0.2)',
                    objectFit: 'cover',
                    maxWidth: '100%'
                  }}
                />
                <p style={{
                  margin: '1rem 0 0 0',
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: 'var(--bronze)',
                  fontFamily: 'librebaskerville-bold, serif',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }} className="cornwallis-caption">
                  British Lord Charles Cornwallis
                </p>
              </div>

              {/* Battle Schedule */}
              <div style={{
                background: 'var(--parchment)',
                border: '2px solid var(--mahogany)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: 'var(--mahogany)',
                  color: 'var(--linen)',
                  padding: '0.75rem',
                  textAlign: 'center',
                  fontFamily: 'librebaskerville-bold, serif',
                  fontSize: '1.1rem',
                  letterSpacing: '0.05em',
                  overflow: 'hidden'
                }} className="battle-schedule-header">
                  2025 CHALLENGE EVENTS
                </div>
                
                <div style={{ padding: '0.75rem' }} className="battle-schedule-content"
                >
                  {[
                    { call: 'K4C', battle: 'Battle of Cowpens', dates: 'Jan 17-19' },
                    { call: 'K4B', battle: 'Battle of Moores Creek Bridge', dates: 'Feb 27-28' },
                    { call: 'K4G', battle: 'Battle of Guilford Courthouse', dates: 'Mar 15-17' },
                    { call: 'K4A', battle: 'America250 Semiquincentennial', dates: 'Jul 1-7' },
                    { call: 'K4M', battle: 'Battle of Kings Mountain', dates: 'Oct 6-8' },
                    { call: 'K4Y', battle: 'Battle of Yorktown', dates: 'Oct 18-20' }
                  ].map((event, index) => (
                    <div key={index} style={{
                      display: 'grid',
                      gridTemplateColumns: '50px 1fr 70px',
                      gap: '0.5rem',
                      padding: '0.5rem 0',
                      borderBottom: index < 5 ? '1px solid var(--bronze)' : 'none',
                      alignItems: 'center',
                      minWidth: 0
                    }} className="battle-schedule-row">
                      <div style={{
                        fontFamily: 'librebaskerville-bold, serif',
                        color: 'var(--mahogany)',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {event.call}
                      </div>
                      <div style={{
                        fontFamily: 'librebaskerville-regular, serif',
                        color: 'var(--mahogany)',
                        fontSize: '0.85rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0
                      }}>
                        {event.battle}
                      </div>
                      <div style={{
                        fontFamily: 'librebaskerville-regular, serif',
                        color: 'var(--bronze)',
                        fontSize: '0.8rem',
                        textAlign: 'right',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {event.dates}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Certificate */}
            <div style={{
              background: 'rgba(247, 241, 226, 0.8)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '2px solid var(--bronze)',
              boxShadow: '0 4px 12px rgba(104, 63, 27, 0.1)',
              textAlign: 'center',
              minWidth: 0,
              overflow: 'hidden'
            }} className="certificate-column"
            >
              <h4 style={{
                fontFamily: 'librebaskerville-bold, serif',
                color: 'var(--mahogany)',
                marginBottom: '1rem',
                fontSize: '1.3rem'
              }}>
                YOUR VICTORY CERTIFICATE
              </h4>
              <Image
                src="/ccc-certificate.webp"
                alt="Chasing Cornwallis Challenge Certificate"
                width={800}
                height={600}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '800px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(104, 63, 27, 0.2)',
                  border: '3px solid var(--bronze)'
                }}
              />
              <p style={{
                margin: '1rem 0 0 0',
                fontSize: '1rem',
                fontStyle: 'italic',
                color: 'var(--bronze)',
                fontFamily: 'librebaskerville-regular, serif'
              }}>
                Earn this magnificent certificate by participating in 5 of 6 events
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission Promotional Block */}
        <section style={{ marginTop: '3rem', marginBottom: '2rem' }}>
          {/* Brass Separator Bar */}
          <div style={{
            height: '4px',
            background: 'linear-gradient(90deg, var(--bronze) 0%, #D4AF37 50%, var(--bronze) 100%)',
            boxShadow: '0 2px 6px rgba(212, 175, 55, 0.6)',
            margin: '2rem 0',
            borderRadius: '2px'
          }}></div>

          {/* Full-width Promotional Block */}
          <Link href="/our-story" style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, rgba(199, 161, 89, 0.1) 100%)',
              padding: '3rem 2rem',
              borderRadius: '12px',
              border: '3px solid var(--bronze)',
              boxShadow: '0 6px 20px rgba(104, 63, 27, 0.15)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
            className="mission-promo-card"
            >
              {/* Background Pattern */}
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                opacity: '0.05',
                backgroundImage: 'radial-gradient(circle, var(--mahogany) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                pointerEvents: 'none'
              }}></div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{
                  fontFamily: 'librebaskerville-bold, serif',
                  fontSize: '2.5rem',
                  color: 'var(--mahogany)',
                  margin: '0 0 1rem 0',
                  textShadow: '2px 2px 4px rgba(104, 63, 27, 0.2)',
                  letterSpacing: '0.1em'
                }}>
                  DISCOVER THE EPIC STORY
                </h2>
                
                <h3 style={{
                  fontFamily: 'librebaskerville-bold, serif',
                  fontSize: '1.4rem',
                  color: 'var(--bronze)',
                  margin: '0 0 1.5rem 0',
                  fontStyle: 'italic',
                  letterSpacing: '0.05em'
                }}>
                  Behind America250
                </h3>
                
                <p style={{
                  fontSize: '1.3rem',
                  lineHeight: '1.6',
                  color: 'var(--mahogany)',
                  marginBottom: '2rem',
                  fontFamily: 'librebaskerville-regular, serif',
                  maxWidth: '800px',
                  margin: '0 auto 2rem auto'
                }}>
                  From the Appalachian frontier to global history — discover why the Battle of Kings Mountain 
                  didn&apos;t just win American independence, but <strong>saved the sovereignty of every nation on Earth</strong>. 
                  Learn the untold story of the Backwater Men who changed the course of world history.
                </p>
                
                <div style={{
                  fontFamily: 'librebaskerville-bold, serif',
                  fontSize: '1.2rem',
                  color: 'var(--bronze)',
                  fontWeight: 'bold',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  Read Our Story →
                </div>
              </div>
            </div>
          </Link>
        </section>
        </div>
      </main>
    </>
  );
}
