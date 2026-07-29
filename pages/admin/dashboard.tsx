import React from 'react';
import styles from '../../styles/admin-dashboard.module.css';

const Sidebar: React.FC = () => (
  <aside className={styles.sidebar}>
    <div className={styles.brand}>
      <div className={styles.logo}>C</div>
      <div className={styles.brandText}>Coursue</div>
    </div>
    <nav className={styles.nav}>
      <div className={styles.navSection}>
        <div className={styles.navItemActive}>Dashboard</div>
        <div className={styles.navItem}>Inbox</div>
        <div className={styles.navItem}>Lesson</div>
        <div className={styles.navItem}>Task</div>
        <div className={styles.navItem}>Group</div>
      </div>
      <div className={styles.navSectionSmall}>
        <div className={styles.sectionTitle}>Friends</div>
        <div className={styles.friend}>Bagas Mahpie</div>
        <div className={styles.friend}>Sir Dandy</div>
        <div className={styles.friend}>Jhon Tosan</div>
      </div>
    </nav>
    <div className={styles.sidebarFooter}>
      <div className={styles.setting}>Setting</div>
      <div className={styles.logout}>Logout</div>
    </div>
  </aside>
);

const TopBar: React.FC = () => (
  <div className={styles.topbar}>
    <input className={styles.search} placeholder="Search your course..." />
    <div className={styles.topRight}> 
      <div className={styles.icon}>🔔</div>
      <div className={styles.avatar}>JR</div>
    </div>
  </div>
);

const HeroCard: React.FC = () => (
  <div className={styles.hero}>
    <div className={styles.heroLeft}>
      <div className={styles.small}>ONLINE COURSE</div>
      <h2 className={styles.heroTitle}>Sharpen Your Skills with Professional Online Courses</h2>
      <button className={styles.joinBtn}>Join Now ➜</button>
    </div>
    <div className={styles.heroRight} />
  </div>
);

const CourseChip: React.FC<{ title: string; progress?: string }> = ({ title, progress }) => (
  <div className={styles.chip}>
    <div className={styles.chipTitle}>{title}</div>
    {progress && <div className={styles.chipSmall}>{progress}</div>}
  </div>
);

const ContinueCard: React.FC<{ title: string; tag?: string; mentor?: string; img?: string }>=({title, tag, mentor, img})=> (
  <div className={styles.contCard}>
    <div className={styles.contImage} style={{backgroundImage:`url(${img || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80'})`}} />
    <div className={styles.contBody}>
      <div className={styles.tag}>{tag}</div>
      <h4 className={styles.contTitle}>{title}</h4>
      <div className={styles.mentor}>{mentor}</div>
    </div>
  </div>
);

const RightPanel: React.FC = () => (
  <aside className={styles.rightPanel}>
    <div className={styles.statCard}>
      <div className={styles.avatarCircle}>JR</div>
      <h4>Good Morning Jason 🔥</h4>
      <p className={styles.statSub}>Continue your learning to achieve your target!</p>
      <div className={styles.barChart}>
        <div className={styles.bar} style={{height: '28px'}}></div>
        <div className={styles.bar} style={{height: '40px'}}></div>
        <div className={styles.bar} style={{height: '60px'}}></div>
      </div>
    </div>

    <div className={styles.mentorCard}>
      <h4>Your mentor</h4>
      <div className={styles.mentorRow}><div className={styles.mentorAvatar}>P</div><div className={styles.mentorInfo}><div>Padhang Satrio</div><div className={styles.mentorRole}>Mentor</div></div><button className={styles.follow}>Follow</button></div>
      <div className={styles.mentorRow}><div className={styles.mentorAvatar}>Z</div><div className={styles.mentorInfo}><div>Zakir Horizontal</div><div className={styles.mentorRole}>Mentor</div></div><button className={styles.follow}>Follow</button></div>
      <div className={styles.mentorRow}><div className={styles.mentorAvatar}>L</div><div className={styles.mentorInfo}><div>Leonardo Samsul</div><div className={styles.mentorRole}>Mentor</div></div><button className={styles.follow}>Follow</button></div>
    </div>
  </aside>
);

export default function AdminDashboard() {
  return (
    <div className={styles.pageWrap}>
      <Sidebar />
      <main className={styles.content}>
        <TopBar />
        <div className={styles.gridTop}>
          <HeroCard />
          <RightPanel />
        </div>

        <div className={styles.chipsRow}>
          <CourseChip title="UI/UX Design" progress="2/8 watched" />
          <CourseChip title="Branding" progress="3/8 watched" />
          <CourseChip title="Front End" progress="6/12 watched" />
        </div>

        <h3 className={styles.sectionTitle}>Continue Watching</h3>
        <div className={styles.contRow}>
          <ContinueCard title="Beginner's Guide to Becoming a Professional Front-End Developer" tag="FRONT END" mentor="Leonardo samsul" />
          <ContinueCard title="Optimizing User Experience with the Best UI/UX Design" tag="UI/UX DESIGN" mentor="Bayu Salto" />
          <ContinueCard title="Reviving and Refreshing Company Image" tag="BRANDING" mentor="Padhang Satrio" />
        </div>

        <h3 className={styles.sectionTitle}>Your Lesson</h3>
        <div className={styles.tableCard}>
          <table className={styles.lessonTable}>
            <thead><tr><th>Mentor</th><th>Type</th><th>Desc</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td>Padhang Satrio</td><td>UI/UX DESIGN</td><td>Understand Of UI/UX Design</td><td>View</td></tr>
              <tr><td>Zakir Horizontal</td><td>FRONT END</td><td>Beginner Frontend</td><td>View</td></tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
