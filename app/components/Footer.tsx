import { GithubIcon, InstagramIcon } from '../constants/icons'

const footerLinks = {
  Platform: ['Discover', 'Trending', 'Top 100', 'Seasonal'],
  'AI Features': ['Semantic Search', 'Narrative AI', 'Scene Search', 'Emotional Map'],
  Community: ['Discussions', 'Reviews', 'Sentiment', 'Seasonal Hype'],
  Legal: ['Privacy', 'Terms', 'API', 'Credits'],
}

export default function Footer() {
  return (
    <footer className="relative pt-16 pb-10">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/5" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded bg-accent-primary flex items-center justify-center text-white font-bold text-sm">
                あ
              </div>
              <span className="text-lg font-semibold text-white">Anima</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs mb-6">
              AI-powered narrative intelligence for anime lovers.
              Discover stories that resonate with your soul.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com/Eyepatch5263" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-all duration-300"
                aria-label="GitHub">
                <GithubIcon size={15} />
              </a>
              <a href="https://www.instagram.com/eyepatch_5263" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-all duration-300"
                aria-label="Twitter">
                <InstagramIcon size={13} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-[#555] hover:text-text-secondary transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center">
          <p className="text-sm text-[#555]">© 2026 Anima. Built with narrative intelligence.</p>
        </div>
      </div>
    </footer>
  )
}
