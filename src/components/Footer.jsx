import React from 'react';
import { Link } from 'react-router-dom';
import bg from '../assets/bg.png';

const Footer = () => {
    return (
        <footer className="bg-emerald-950 text-white pt-20 pb-10 overflow-hidden relative mt-auto">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px]" />
                <div className="absolute top-[30%] -right-[10%] w-[500px] h-[500px] bg-green-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center p-2 backdrop-blur-sm border border-white/10">
                                <img src={bg} alt="GreenChain Logo" className="w-full h-full object-contain" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tighter text-white">GreenChain</h2>
                        </div>
                        <p className="text-emerald-200/60 text-sm leading-relaxed max-w-xs font-medium">
                            Empowering agriculture with real-time data, verified sourcing, and organic integrity. Join the revolution of fresh, sustainable produce.
                        </p>
                        <div className="flex gap-3 pt-2">
                            {/* Social Icons */}
                            {['facebook-circle-fill', 'twitter-x-line', 'instagram-line', 'linkedin-fill'].map((icon, index) => (
                                <a key={index} href="#" className="w-10 h-10 rounded-xl bg-emerald-900/50 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 hover:-translate-y-1 border border-emerald-800/50 hover:shadow-lg hover:shadow-emerald-900/20">
                                    <i className={`ri-${icon} text-lg`}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-emerald-400">Quick Links</h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Shop', path: '/shop' },
                                { name: 'Services', path: '/services' },
                                { name: 'About Us', path: '#' }
                            ].map((link, idx) => (
                                <li key={idx}>
                                    <Link to={link.path} className="group flex items-center gap-2 text-emerald-200/60 hover:text-white text-sm font-medium transition-colors duration-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500 transition-all duration-300"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-emerald-400">Support</h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'Contact Us', path: '#' },
                                { name: 'FAQs', path: '#' },
                                { name: 'Shipping Policy', path: '#' },
                                { name: 'Returns', path: '#' },
                                { name: 'Privacy Policy', path: '#' }
                            ].map((link, idx) => (
                                <li key={idx}>
                                    <Link to={link.path} className="block text-emerald-200/60 hover:text-white text-sm font-medium transition-colors duration-300 transform hover:translate-x-1">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-emerald-400">Stay Updated</h3>
                        <p className="text-emerald-200/60 text-sm mb-6 leading-relaxed">
                            Subscribe to our newsletter to get the latest harvest updates and exclusive healthy offers.
                        </p>
                        <div className="bg-emerald-900/30 p-1.5 rounded-2xl border border-emerald-800/50 flex items-center focus-within:border-emerald-500/50 focus-within:bg-emerald-900/50 transition-all duration-300">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-transparent border-none outline-none text-emerald-100 px-4 py-2 w-full text-sm placeholder:text-emerald-700/50 font-medium"
                            />
                            <button className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold p-3 rounded-xl transition-all duration-300 hover:shadow-lg shadow-emerald-500/20 active:scale-95">
                                <i className="ri-arrow-right-line text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-emerald-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-emerald-200/40 text-xs font-semibold tracking-wide">
                        © {new Date().getFullYear()} GreenChain Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-emerald-200/40 hover:text-emerald-400 text-xs font-bold uppercase tracking-wider transition-colors">Privacy</a>
                        <span className="w-1 h-1 rounded-full bg-emerald-800"></span>
                        <a href="#" className="text-emerald-200/40 hover:text-emerald-400 text-xs font-bold uppercase tracking-wider transition-colors">Terms</a>
                        <span className="w-1 h-1 rounded-full bg-emerald-800"></span>
                        <a href="#" className="text-emerald-200/40 hover:text-emerald-400 text-xs font-bold uppercase tracking-wider transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
