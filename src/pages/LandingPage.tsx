import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Sun, Moon, LogIn, ArrowRight, 
  BookOpen, Users, Wallet, BarChart3, Shield, Globe, 
  UserPlus, FilePlus, TrendingUp, CheckCircle
} from 'lucide-react';
import { useTheme } from '@/hooks';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/ui/Logo';

const LANGUAGES = [
  { code: 'ru', label: '🇷🇺 Русский' },
  { code: 'en', label: '🇬🇧 English' },
  { code: 'tg', label: '🇹🇯 Тоҷикӣ' },
];

export default function LandingPage() {
  const { setTheme, isDark } = useTheme();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#06090F] text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 overflow-hidden relative transition-colors duration-300">
      
      {/* ================= ЭФФЕКТҲОИ ФОНИ ҚАФО ================= */}
      {/* 1. Сеткаи хира барои тамоми саҳифа */}
      <div className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-100" 
           style={{
             backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)',
             backgroundSize: '40px 40px',
             maskImage: 'linear-gradient(to bottom, white, transparent)'
           }}>
      </div>

      {/* 2. Нурҳои паҳншуда (Glows) */}
      <div className="absolute top-[10%] left-[10%] w-[40rem] h-[40rem] bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[120px] pointer-events-none transition-colors duration-300" />
      <div className="absolute top-[30%] right-[10%] w-[40rem] h-[40rem] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none transition-colors duration-300" />


      <main className="relative z-10">
        
        {/* ================= HEADER ================= */}
        <header className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
          {/* Логотип */}
          <Logo />

          {/* Тугмаҳои тарафи рост */}
          <div className="flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            
            {/* Менюи Забон (Dropdown) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-white transition-colors uppercase outline-none">
                  <Globe className="w-4 h-4" /> {i18n.language || 'EN'}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                {LANGUAGES.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code} 
                    onClick={() => handleLanguageChange(lang.code)}
                    className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Тугмаи Ивази Мавзӯъ (Theme) */}
            <button 
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 fill-current" />}
            </button>

            <Link to="/register" className="hover:text-slate-900 dark:hover:text-white transition-colors hidden sm:block">
              {t('header.signUp', 'Sign Up')}
            </Link>
            
            <Link 
              to="/login" 
              className="flex items-center gap-2 border border-slate-300 dark:border-slate-700/80 rounded-full px-5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all text-slate-900 dark:text-white"
            >
              <LogIn className="w-4 h-4" /> {t('header.login', 'Login')}
            </Link>
          </div>
        </header>

        {/* ================= HERO SECTION ================= */}
      <section className="relative pt-16 pb-32 flex flex-col items-center text-center z-10 px-6">
  
  {/* ФОНИ КЛЕТКА-КЛЕТКА (Grid Background) */}
<div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40 dark:opacity-40 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] transition-colors duration-300" />
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="max-w-4xl flex flex-col items-center relative z-10"
  >
    {/* Top Badge */}
    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-slate-300 dark:border-slate-800/80 bg-white/50 dark:bg-transparent text-slate-600 dark:text-slate-400 text-[11px] font-bold tracking-widest mb-10 uppercase backdrop-blur-sm transition-colors">
      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
      {t('hero.badge', 'SMART DEBT MANAGEMENT')}
    </div>

    {/* Heading */}
    <h1 className="text-[3rem] md:text-[5.5rem] lg:text-[5rem] font-black tracking-tighter mb-8 leading-[1.05] text-slate-900 dark:text-white transition-colors">
      {t('hero.title1', 'Track Every Debt.')}<br />
      <span className="text-[#3b82f6]">{t('hero.title2', 'Own Your ')}</span>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#64748b] dark:via-[#e2e8f0] to-[#f59e0b]">
        {t('hero.title3', 'Finances.')}
      </span>
    </h1>

    {/* Subheading */}
    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl leading-relaxed font-normal transition-colors">
      {t('hero.subtitle', 'A powerful offline-first platform for managing debts, tracking contacts, and keeping your financial records organized — even without internet.')}
    </p>

    {/* CTAs */}
    <div className="flex flex-col sm:flex-row gap-8 items-center justify-center w-full sm:w-auto">
      <Link 
        to="/register"
        className="h-14 px-8 text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] transition-all hover:scale-105 font-semibold flex items-center justify-center"
      >
        {t('hero.startBtn', 'Get Started Free')} <ArrowRight className="ml-2 w-5 h-5 font-light" />
      </Link>
      
      <Link 
        to="/register" 
        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors text-lg"
      >
        {t('hero.createAccBtn', 'Create Account')}
      </Link>
    </div>

    {/* Bottom Badges */}
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-20">
      {[
        t('hero.features.offline', 'Offline-First'), 
        t('hero.features.multiLang', 'Multi-Language'), 
        t('hero.features.sync', 'Real-Time Sync'), 
        t('hero.features.secure', 'Secure')
      ].map((feature, idx) => (
        <div 
          key={idx} 
          className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-800/80 bg-white/50 dark:bg-transparent text-slate-600 dark:text-slate-500 text-sm font-medium transition-colors backdrop-blur-sm"
        >
          {feature}
        </div>
      ))}
    </div>

  </motion.div>
</section>
        {/* ================= FEATURES SECTION ================= */}
        <section className="px-6 py-24 bg-transparent relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h4 className="text-[#3b82f6] text-xs font-bold tracking-widest uppercase mb-4">{t('landing.featuresSmall')}</h4>
              <h2 className="text-4xl md:text-5xl font-[800] text-[#111827] dark:text-white mb-4 tracking-tight">
                {t('landing.featuresMain')}<br />
                <span className="text-[#9ca3af] dark:text-slate-500">{t('landing.featuresSub')}</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
                  title: t('landing.f1Title'),
                  desc: t('landing.f1Desc'),
                  bg: "bg-blue-100/50 dark:bg-blue-500/10"
                },
                {
                  icon: <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
                  title: t('landing.f2Title'),
                  desc: t('landing.f2Desc'),
                  bg: "bg-emerald-100/50 dark:bg-emerald-500/10"
                },
                {
                  icon: <Wallet className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
                  title: t('landing.f3Title'),
                  desc: t('landing.f3Desc'),
                  bg: "bg-amber-100/50 dark:bg-amber-500/10"
                },
                {
                  icon: <BarChart3 className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
                  title: t('landing.f4Title'),
                  desc: t('landing.f4Desc'),
                  bg: "bg-rose-100/50 dark:bg-rose-500/10"
                },
                {
                  icon: <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
                  title: t('landing.f5Title'),
                  desc: t('landing.f5Desc'),
                  bg: "bg-purple-100/50 dark:bg-purple-500/10"
                },
                {
                  icon: <Globe className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
                  title: t('landing.f6Title'),
                  desc: t('landing.f6Desc'),
                  bg: "bg-cyan-100/50 dark:bg-cyan-500/10"
                },
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-[1.5rem] bg-white dark:bg-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none">
                  <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-[800] text-[#111827] dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-[#6b7280] dark:text-slate-400 text-[15px] leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= STATS SECTION ================= */}
        <section className="px-6 py-20 border-t border-b border-[#e5e7eb] dark:border-slate-800/80 bg-white/50 dark:bg-[#0a0f1c]/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#e5e7eb] dark:divide-slate-800">
            {[
              { num: t('landing.s1Num'), title: t('landing.s1Title'), sub: t('landing.s1Sub') },
              { num: t('landing.s2Num'), title: t('landing.s2Title'), sub: t('landing.s2Sub') },
              { num: t('landing.s3Num'), title: t('landing.s3Title'), sub: t('landing.s3Sub') },
              { num: t('landing.s4Num'), title: t('landing.s4Title'), sub: t('landing.s4Sub') }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center px-4 pt-8 md:pt-0">
                <div className="text-4xl md:text-5xl font-[900] text-[#111827] dark:text-white mb-2">{stat.num}</div>
                <div className="text-sm font-semibold text-[#4b5563] dark:text-slate-300 mb-1">{stat.title}</div>
                <div className="text-xs text-[#9ca3af] dark:text-slate-500">{stat.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= STEPS SECTION ================= */}
        <section className="px-6 py-24 bg-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h4 className="text-[#f59e0b] text-xs font-bold tracking-widest uppercase mb-4">{t('landing.stepsSmall')}</h4>
              <h2 className="text-4xl md:text-5xl font-[800] text-[#111827] dark:text-white tracking-tight">
                {t('landing.stepsMain')} <span className="text-[#9ca3af] dark:text-slate-500">{t('landing.stepsSub')}</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6 relative">
              <div className="hidden md:block absolute top-[50px] left-[10%] right-[10%] h-[1px] bg-slate-200 dark:bg-slate-700 z-0"></div>
              
              {[
                { step: "01", icon: <UserPlus className="w-5 h-5 text-blue-600" />, title: t('landing.step1Title'), desc: t('landing.step1Desc') },
                { step: "02", icon: <FilePlus className="w-5 h-5 text-blue-600" />, title: t('landing.step2Title'), desc: t('landing.step2Desc') },
                { step: "03", icon: <TrendingUp className="w-5 h-5 text-blue-600" />, title: t('landing.step3Title'), desc: t('landing.step3Desc') },
                { step: "04", icon: <CheckCircle className="w-5 h-5 text-blue-600" />, title: t('landing.step4Title'), desc: t('landing.step4Desc') }
              ].map((item, i) => (
                <div key={i} className="relative z-10 p-6 rounded-[1.5rem] bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col transition-colors">
                  <div className="flex justify-between items-start mb-12">
                    <span className="text-5xl font-[900] text-slate-200 dark:text-slate-700">{item.step}</span>
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-[800] text-[#111827] dark:text-white mb-3">{item.title}</h3>
                  <p className="text-[14px] text-[#6b7280] dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= BOTTOM CTA ================= */}
        <section className="px-6 py-12 pb-24">
          <div className="max-w-5xl mx-auto rounded-[2.5rem] bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700/50 p-12 md:p-20 text-center flex flex-col items-center transition-colors">
            <h2 className="text-4xl md:text-5xl font-[800] text-[#111827] dark:text-white mb-6 tracking-tight max-w-2xl">
              {t('landing.ctaMain')}<br />
              <span className="text-[#9ca3af] dark:text-slate-400">{t('landing.ctaSub')}</span>
            </h2>
            <p className="text-[#6b7280] dark:text-slate-400 mb-10 max-w-xl text-lg">
              {t('landing.ctaDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" className="h-14 px-8 text-base bg-[#3b82f6] hover:bg-blue-700 text-white rounded-xl shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] transition-all hover:scale-105" asChild>
                <Link to="/register">
                  {t('landing.startFree')} <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-xl border-[#d1d5db] dark:border-slate-600 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700 text-[#374151] dark:text-slate-200 shadow-sm" asChild>
                <Link to="/login">{t('landing.login')}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 px-6 py-16 bg-white dark:bg-[#030509] border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1 pr-8">
              <div className="mb-6">
                <Logo />
              </div>
              <p className="text-sm text-[#6b7280] dark:text-slate-400 leading-relaxed">
                {t('landing.footerDesc')}
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-[#9ca3af] dark:text-slate-500 uppercase tracking-wider mb-6">{t('landing.product')}</h4>
              <ul className="space-y-4 text-sm text-[#4b5563] dark:text-slate-400">
                <li><a href="#" className="hover:text-[#3b82f6] transition-colors">{t('landing.f1Title')}</a></li>
                <li><a href="#" className="hover:text-[#3b82f6] transition-colors">{t('landing.f2Title')}</a></li>
                <li><a href="#" className="hover:text-[#3b82f6] transition-colors">{t('landing.f4Title')}</a></li>
                <li><a href="#" className="hover:text-[#3b82f6] transition-colors">{t('landing.contact', 'Контакты')}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-[#9ca3af] dark:text-slate-500 uppercase tracking-wider mb-6">{t('landing.company')}</h4>
              <ul className="space-y-4 text-sm text-[#4b5563] dark:text-slate-400">
                <li><a href="#" className="hover:text-[#3b82f6] transition-colors">{t('landing.about', 'О нас')}</a></li>
                <li><a href="#" className="hover:text-[#3b82f6] transition-colors">{t('landing.blog', 'Блог')}</a></li>
                <li><a href="#" className="hover:text-[#3b82f6] transition-colors">{t('landing.careers', 'Карьера')}</a></li>
                <li><a href="#" className="hover:text-[#3b82f6] transition-colors">{t('landing.press', 'Пресса')}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-[#9ca3af] dark:text-slate-500 uppercase tracking-wider mb-6">{t('landing.support')}</h4>
              <ul className="space-y-4 text-sm text-[#4b5563] dark:text-slate-400">
                <li><a href="#" className="hover:text-[#3b82f6] transition-colors">{t('landing.docs', 'Документация')}</a></li>
                <li><a href="#" className="hover:text-[#3b82f6] transition-colors">{t('landing.help', 'Центр помощи')}</a></li>
                <li><a href="#" className="hover:text-[#3b82f6] transition-colors">{t('landing.contactUs', 'Связаться')}</a></li>
                <li><a href="#" className="hover:text-[#3b82f6] transition-colors">{t('landing.status', 'Статус')}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#9ca3af] dark:text-slate-500">
            <p>{t('landing.footerCopyright')}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">{t('landing.privacy')}</a>
              <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">{t('landing.terms')}</a>
              <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">{t('landing.cookies')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}