import Image from 'next/image';
import Navigation from '../../components/Navigation';
import styles from './page.module.css';

export default function OurStory() {
  return (
    <>
      <Navigation />
      <main className="parchment-bg">
        <div className="container" style={{ marginTop: '2rem' }}>
      {/* Header Image - Backwater Men Painting */}
      <div className={styles.headerImage}>
        <Image 
          src="/backwater-men.webp" 
          alt="The Backwater Men by Richard Luce" 
          width={800}
          height={653}
          style={{width: "100%", maxWidth: "800px", height: "auto", display: "block", margin: "0 auto"}}
        />
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        <h1 className={styles.mainTitle}>OUR STORY</h1>
        
        {/* Epic Narrative */}
        <div className={styles.narrative}>
          <p className={styles.openingParagraph}>
            In the shadow of the Appalachian Mountains, where the echoes of musket fire still whisper through the hollers, 
            lies a story that changed the course of human history. Not just American history—<strong>world history</strong>. 
            The Battle of Kings Mountain on October 7, 1780, was the moment when frontier militia didn&apos;t just defeat a British army—they 
            saved the sovereignty of every nation that exists today.
          </p>

          <p>
            Picture this: Had the British succeeded in their Southern Campaign, had they crushed the rebellion in the Carolinas, 
            the dominoes would have fallen in perfect sequence. The French, already bleeding gold into our cause, would have 
            abandoned their investment. Spain would have retreated to their colonial borders. The Dutch would have closed their coffers. 
            And Britain—<strong>Britain would have emerged as the unchallenged master of the globe</strong>.
          </p>

          <p>
            <strong>Think about that for a moment.</strong> Every sovereign country that exists today—all 195 of them—would have been British territories, 
            British dominions, or British vassals. The United States of America? Never would have existed. France, Spain, Germany, 
            Japan, China—all would have eventually bowed to the Crown. The sun truly would never have set on the British Empire, 
            because there would have been no other empires left to cast shadows.
          </p>

          <p>
            But in a remote corner of South Carolina, on a ridge that barely qualified as a mountain, a thousand frontier fighters—
            <em>men who were supposed to lose</em>—changed everything. In one hour and five minutes, they didn&apos;t just win a battle. <strong>They won the future freedom of the world</strong>.
          </p>

          <p>
            These weren&apos;t soldiers in the traditional sense. They were farmers, hunters, blacksmiths, and preachers who had learned 
            to fight by defending their families against Cherokee raids and British incursions. They had traveled hundreds of miles, 
            through mountain passes and river crossings, sleeping in the rain, marching through snow, often without food, 
            driven by something more powerful than patriotism—<strong>the absolute certainty that freedom dies if good men do nothing</strong>.
          </p>

          <p>
            The British called them &quot;<em>damned banditti</em>,&quot; &quot;<em>backwoods mongrels</em>,&quot; &quot;<em>backwater men</em>.&quot; 
            Major Patrick Ferguson, the British commander, had threatened to &quot;<em>march his army over the mountains, hang the leaders, 
            and lay waste to the country with fire and sword</em>.&quot; He had no idea he was about to face men who had been 
            forged by the frontier itself.
          </p>

          <p>
            When Colonel William Campbell gave the order to &quot;<em>scream like hell and fight like devils</em>,&quot; 
            these mountain men didn&apos;t fight like European soldiers. They fought like Americans—<strong>free Americans</strong>. 
            They used trees for cover, they shot from behind rocks, they gave Ferguson what they called &quot;Indian play&quot;—
            the kind of warfare that turns conventional military wisdom upside down.
          </p>

          <p>
            In 65 minutes, it was over. Ferguson was dead. His army was shattered. And the entire British Southern Strategy—
            the plan that was supposed to end the rebellion and restore Crown authority—lay in ruins on a South Carolina hillside.
          </p>

          <p>
            <strong>But here&apos;s what haunts me</strong>: How many people today know this story? How many Americans understand that 
            their freedom—and the freedom of billions of people worldwide—was secured by a thousand frontiersmen who history 
            has largely forgotten? How many realize that without Kings Mountain, there would have been no Yorktown, no Constitution, 
            no beacon of liberty for the world to follow?
          </p>

          <p>
            The answer is heartbreaking: <em>almost none</em>.
          </p>

          <p>
            We teach Valley Forge. We teach Bunker Hill. We teach Lexington and Concord. <strong>But we&apos;ve forgotten the battle 
            that actually decided the war.</strong> We&apos;ve forgotten the men who saved not just America, but the concept of 
            national sovereignty itself.
          </p>

          <p>
            <strong>That ends now.</strong>
          </p>

          <p>
            Every QSO during this America250 celebration, every activation, every log entry is an act of remembrance. 
            When we make contact across the airwaves, we&apos;re doing what these mountain men did—<strong>we&apos;re connecting across 
            impossible distances to preserve something precious</strong>. They connected through mountain passes and river crossings; 
            we connect through radio waves and digital signals. But the mission is the same: <strong>to keep the flame of freedom alive</strong>.
          </p>

          <p>
            When foreign operators answer our calls, when they log our contacts, when they participate in our commemorations, 
            they&apos;re not just playing radio—<strong>they&apos;re celebrating their own freedom</strong>. Because every country that exists 
            today as a sovereign nation exists because a thousand American frontiersmen climbed a South Carolina mountain 
            and refused to surrender to tyranny.
          </p>

          <p>
            This is bigger than amateur radio. This is bigger than America&apos;s 250th anniversary. <strong>This is about memory itself</strong>—
            the sacred duty to remember those who paid the price for every breath of free air we breathe today.
          </p>

          <p>
            In 1976, during America&apos;s bicentennial, there were parades and celebrations, but the deeper stories remained buried. 
            In 2026, we face the same choice: superficial celebration or profound remembrance. <strong>We choose remembrance</strong>.
          </p>

          <p>
            Because <strong>this is our time</strong>. We are their witnesses. And without a witness, their stories, their sacrifice, 
            their victory will just disappear into the silence of forgotten history.
          </p>

          <p className={styles.closingParagraph}>
            <strong>We will not let that happen. Not on our watch. Not in our America.</strong>
          </p>
        </div>

        {/* Backwater Men Explanation */}
        <div className={styles.backwaterSection}>
          <h2 className={styles.sectionTitle}>THE BACKWATER MEN</h2>
          
          <p className={styles.backwaterQuote}>
            &quot;The Backwater Men was a derogatory name given to the pioneers who settled over the Blue Ridge Mountains. 
            Other names given to them by the British included overmountain men, backwoods mongrels and damned banditti. 
            However these men proved to be a formidable force by totally defeating Maj. Patrick Ferguson&apos;s larger Tory army at Kings Mountain.&quot;
          </p>
          
          <p className={styles.artistCredit}>
            — Artist <a href="https://www.richardluce.com/historical-art" target="_blank" rel="noopener noreferrer" className={styles.artistLink}>Richard Luce</a>, 
            Historical Painter
          </p>

          <p className={styles.backwaterExplanation}>
            For the frontier militia to travel from their mountain settlements to Kings Mountain, they had to cross watersheds along the way—
            rivers, streams, and creeks that flowed down from the Appalachian peaks. They were men who lived &quot;back&quot; of the &quot;water,&quot; 
            behind the natural barriers that separated the civilized world from the wilderness. To the British, this made them backward, 
            uncivilized, lesser. <strong>To history, it made them unstoppable</strong>.
          </p>

          <p className={styles.backwaterExplanation}>
            These were men who understood that freedom flows like water—<em>it finds a way around every obstacle, 
            through every gap, over every barrier</em>. The British built their strategy like a dam, 
            thinking they could contain the spirit of liberty. <strong>The Backwater Men proved that freedom, like water, always wins</strong>.
          </p>
        </div>

        {/* Marc's Photo */}
        <div className={styles.founderSection}>
          <Image 
            src="/marc-ncs.webp" 
            alt="Marc Bowen W4OVT at his amateur radio station" 
            width={400}
            height={400}
            className={styles.founderPhoto}
          />
          <div className={styles.contactInfo}>
            <Image 
              src="/marc-plaque.webp" 
              alt="Marc Bowen W4OVT Commemorative Plaque - Founder & Facilitator, Chasing Cornwallis Challenge" 
              width={350}
              height={233}
              className={styles.commemorativePlaque}
            />
          </div>
        </div>
      </div>
    </div>
      </main>
    </>
  );
} 