import { useDarkMode } from '../../contexts/DarkModeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import eduInnovateBadge from '../../assets/EDU@INNOVATE.png';
import ieRiichBadge from '../../assets/ie-RIICH.png';
import iversionLogo from '../../assets/iversion.png';
import excelerateLogo from '../../assets/excelerate.png';
import talentlabsLogo from '../../assets/talentlabs.png';

const Certifications = () => {
  const { isDarkMode } = useDarkMode();
  const themeColors = useThemeColors();

  const badges = [
  
    {
      id: 'excelerate-powerbi',
      image: excelerateLogo,
      alt: 'Excelerate Logo',
      title: 'Dashboarding with Power BI',
      subtitle: 'Excelerate',
      credentialUrl: 'https://drive.google.com/file/d/13UH7ul6WtaEniMeAdXUpC7YfJnFKIMmf/view?usp=sharing',
      status: 'completed'
    },{
      id: 'edu-innovate-2025',
      image: eduInnovateBadge,
      alt: 'Edu@Innovate 2025 Badge',
      title: 'Gold Award Category C (Student)',
      subtitle: 'Edu@Innovate 2025',
      credentialUrl: 'https://drive.google.com/file/d/10IPk6BaHtckRcCvF3INXzWV0E5lW0-oS/view?usp=sharing',
      status: 'completed'
    },
    {
      id: 'ie-riich',
      image: ieRiichBadge,
      alt: 'ie-RIICH 2025 Badge',
      title: 'Gold Award',
      subtitle: 'ie-RIICH 2025',
      credentialUrl: 'https://drive.google.com/file/d/1DRB-bIy8xNVfrz3Kd-wqoxf2qc7Ic6xl/view?usp=sharing',
      status: 'completed'
    }

  ];


  const credentials = [
    
   
    {
      id: 'talentlabs-sql',
      image: talentlabsLogo,
      alt: 'Talentlabs Logo',
      title: 'M1 in SQL',
      subtitle: 'Talentlabs',
      credentialUrl: 'https://www.talentlabs.org/certificate/X8uIzkCAT7OESxYVmsGWaw',
      status: 'completed'
    },
    {
      id: 'iversion-critical-thinking',
      image: iversionLogo,
      alt: 'Iversion Associates',
      title: 'Critical Thinking, Problem Solving and Decision Making',
      subtitle: 'Iversion Associates',
      credentialUrl: 'https://www.credly.com/badges/7423d2a6-afdf-4a78-ac0f-9c15dd50ea6f/linked_in_profile',
      status: 'completed'
    },
    {
      id: 'talentlabs-python',
      image: talentlabsLogo,
      alt: 'Talentlabs Logo',
      title: 'M1 in Python',
      subtitle: 'Talentlabs',
      credentialUrl: 'https://www.talentlabs.org/certificate/ilOUKcn6RSC0vKKcJj55Pw',
      status: 'completed'
    }
  ];

  return (
    <section id="certifications" className="section-ambient py-8 relative" style={{
      background: themeColors.background.sections?.certifications || themeColors.background.gradient,
      transition: 'background 0.3s ease-in-out'
    }}>
      <div className="container mx-auto px-6 relative" style={{ zIndex: 2 }}>
        <span className="section-label text-center" style={{ color: isDarkMode ? themeColors.colors.accent[300] : themeColors.colors.accent[600] }}>// proof of work</span>
        <h2 className="text-4xl font-bold text-center mb-6" style={{ color: isDarkMode ? themeColors.colors.white : themeColors.colors.accent[500] }}>Certifications & Credentials</h2>

        <div className="max-w-6xl mx-auto">
          {/* AWS Certifications */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {badges.map((badge) => {
              const BadgeComponent = () => (
                <div className="flex flex-col items-center group">
                  <div className="mb-4">
                    <img
                      src={badge.image}
                      alt={badge.alt}
                      className="w-40 h-40 md:w-56 md:h-56 object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      width="224"
                      height="224"
                      sizes="(max-width: 768px) 160px, 224px"
                    />
                  </div>
                  <h3 className="text-center text-sm font-medium mb-2" style={{ color: isDarkMode ? themeColors.colors.accent[300] : themeColors.colors.accent[500] }}>
                    {badge.title}
                  </h3>
                  <p className="text-center text-sm" style={{ color: isDarkMode ? themeColors.colors.dark[300] : themeColors.colors.dark[600] }}>
                    {badge.subtitle || (badge.status === 'in-progress' ? 'In Progress!' : '')}
                  </p>
                </div>
              );

              return badge.credentialUrl ? (
                <a
                  key={badge.id}
                  href={badge.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-transform duration-300 hover:scale-105 cursor-pointer focus:outline-none"
                  style={{ outline: 'none' }}
                  onFocus={(e) => e.currentTarget.blur()}
                  aria-label={`View ${badge.title} credential`}
                >
                  <BadgeComponent />
                </a>
              ) : (
                <div key={badge.id} className="block">
                  <BadgeComponent />
                </div>
              );
            })}
          </div>

          {/* CITI Program Certifications */}
          <div className="flex flex-wrap justify-center gap-8">
            {credentials.map((credential) => {
              const BadgeComponent = () => (
                <div className="flex flex-col items-center group">
                  <div className="mb-4">
                    <img
                      src={credential.image}
                      alt={credential.alt}
                      className="w-32 h-32 md:w-40 md:h-40 object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      width="160"
                      height="160"
                      sizes="(max-width: 768px) 128px, 160px"
                    />
                  </div>
                  <h3 className="text-center text-sm font-medium mb-2" style={{ color: isDarkMode ? themeColors.colors.accent[300] : themeColors.colors.accent[500] }}>
                    {credential.title}
                  </h3>
                  <p className="text-center text-sm" style={{ color: isDarkMode ? themeColors.colors.dark[300] : themeColors.colors.dark[600] }}>
                    {credential.subtitle || (credential.status === 'in-progress' ? 'In Progress!' : '')}
                  </p>
                </div>
              );

              return credential.credentialUrl ? (
                <a
                  key={credential.id}
                  href={credential.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-transform duration-300 hover:scale-105 cursor-pointer focus:outline-none"
                  style={{ outline: 'none' }}
                  onFocus={(e) => e.currentTarget.blur()}
                  aria-label={`View ${credential.title} credential`}
                >
                  <BadgeComponent />
                </a>
              ) : (
                <div key={credential.id} className="block">
                  <BadgeComponent />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Bottom gradient overlay for smooth transition to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '60px',
          background: isDarkMode
            ? `linear-gradient(180deg, transparent 0%, ${themeColors.background.gradientEnd} 100%)`
            : `linear-gradient(180deg, transparent 0%, ${themeColors.colors.accent[25]} 100%)`,
          zIndex: 1
        }}
      />
    </section>
  );
};

export default Certifications;