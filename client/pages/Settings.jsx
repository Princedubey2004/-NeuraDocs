import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainSidebar from '../components/MainSidebar';
import { useAuthStore } from '../store/useAuthStore';
import { 
    User, 
    Lock, 
    Bell, 
    Globe, 
    Settings as SettingsIcon,
    Camera,
    ShieldCheck,
    Mail
} from 'lucide-react';

/**
 * Account settings and user preferences.
 * I've structured this using simple tabs to keep things clean.
 */

const Settings = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    
    // Manage which tab the user is looking at
    const [currentTab, setCurrentTab] = useState('profile');
    
    // Track the save pulse
    const [isSaving, setIsSaving] = useState(false);
    const [hasJustSaved, setHasJustSaved] = useState(false);

    const menuItems = [
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'security', icon: Lock, label: 'Security' },
        { id: 'preferences', icon: Globe, label: 'Preferences' }
    ];

    const performSync = async () => {
        setIsSaving(true);
        
        // Let's pretend we're talking to the server
        await new Promise(res => setTimeout(res, 1300));
        
        setIsSaving(false);
        setHasJustSaved(true);
        
        // Hide the toast after a few seconds
        setTimeout(() => setHasJustSaved(false), 3000);
    };

    // Reusable custom button that shows the loading state
    const ActionButton = ({ text = "Save Changes" }) => (
        <button 
            onClick={performSync}
            disabled={isSaving}
            className={`min-w-[180px] h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl ${
                hasJustSaved 
                ? 'bg-emerald-500 text-white shadow-emerald-100 scale-105' 
                : 'bg-black text-white shadow-indigo-100 hover:scale-105 active:scale-95 disabled:bg-gray-400'
            }`}
        >
            {isSaving ? (
                <div className="flex items-center justify-center gap-3">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Syncing...</span>
                </div>
            ) : hasJustSaved ? (
                <div className="flex items-center justify-center gap-2 animate-in zoom-in duration-300">
                    <span>Success ✅</span>
                </div>
            ) : (
                text
            )}
        </button>
    );

    return (
        <div className="flex h-screen bg-white overflow-hidden font-sans">
            <MainSidebar />

            <main className="flex-1 overflow-y-auto bg-gray-50/30 custom-scrollbar relative">
                {/* Floating toast notification */}
                {hasJustSaved && (
                    <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-700">
                        <div className="bg-black text-white px-8 py-5 rounded-[2.25rem] shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-2xl ring-1 ring-white/10">
                            <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black tracking-tight leading-none">Settings Updated</span>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1.5">Your profile is now in sync</span>
                            </div>
                        </div>
                    </div>
                )}

                <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-12 py-7 sticky top-0 z-10 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-[1.25rem] bg-indigo-50 border border-indigo-100/50 shadow-sm">
                            <SettingsIcon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Account Settings</h1>
                    </div>
                </header>

                <div className="max-w-6xl mx-auto p-12">
                    <div className="flex flex-col lg:flex-row gap-20">
                        {/* Tab Navigation */}
                        <aside className="w-full lg:w-64 space-y-2.5 shrink-0">
                            <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] mb-6 px-5 opacity-60">System Menu</div>
                            {menuItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentTab(item.id)}
                                    className={`group flex items-center gap-4 w-full px-6 py-4.5 rounded-[1.5rem] text-sm font-bold transition-all ${
                                        currentTab === item.id 
                                        ? 'bg-black text-white shadow-2xl shadow-gray-200 -translate-y-1' 
                                        : 'text-gray-500 hover:bg-white hover:text-black hover:shadow-xl hover:shadow-gray-100'
                                    }`}
                                >
                                    <item.icon className={`h-4.5 w-4.5 transition-colors ${currentTab === item.id ? 'text-indigo-400' : 'text-gray-400 group-hover:text-indigo-500'}`} />
                                    {item.label}
                                </button>
                            ))}
                        </aside>

                        {/* Actual Settings Forms */}
                        <section className="flex-1 bg-white rounded-[4rem] p-12 md:p-16 shadow-[0_2px_40px_-20px_rgba(0,0,0,0.1)] border border-gray-100">
                            {currentTab === 'profile' && (
                                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-12">Public Profile</h2>
                                    
                                    <div className="space-y-14">
                                        <div className="flex flex-col items-start gap-10">
                                            <div className="relative group/avatar">
                                                <div className="h-40 w-40 rounded-[3rem] bg-indigo-50/50 border-4 border-indigo-100 flex items-center justify-center text-6xl font-black text-indigo-600 shadow-inner group-hover/avatar:scale-105 transition-transform duration-700">
                                                    {user?.name?.charAt(0)}
                                                </div>
                                                <button className="absolute -bottom-3 -right-3 p-4 bg-black rounded-[1.5rem] text-white shadow-2xl hover:scale-110 transition-all">
                                                    <Camera className="h-5 w-5" />
                                                </button>
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Avatar</h3>
                                                <p className="text-xs text-gray-400 font-medium ml-1">JPG, PNG, or GIF. Recommended size 400px.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="space-y-4">
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-5 top-5 h-4 w-4 text-gray-300" />
                                                    <input 
                                                        type="text" 
                                                        defaultValue={user?.name}
                                                        className="w-full bg-gray-50/70 border border-gray-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-5 top-5 h-4 w-4 text-gray-300" />
                                                    <input 
                                                        type="email" 
                                                        defaultValue={user?.email}
                                                        disabled
                                                        className="w-full bg-gray-50/70 border border-gray-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-bold text-gray-400 cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-12 border-t border-gray-50 flex justify-end">
                                            <ActionButton />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentTab === 'security' && (
                                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-12">Security</h2>
                                    
                                    <div className="space-y-14">
                                        <div className="p-10 rounded-[3rem] bg-emerald-50/50 border border-emerald-100/50 flex items-center gap-8">
                                            <div className="h-16 w-16 rounded-[1.5rem] bg-white flex items-center justify-center text-emerald-500 shadow-md">
                                                <ShieldCheck className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <h4 className="text-base font-black text-gray-900">Account status is healthy</h4>
                                                <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-[0.15em] mt-1.5">Verified Account</p>
                                            </div>
                                        </div>

                                        <div className="space-y-10">
                                            <div className="space-y-4">
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Current Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-5 top-5 h-4 w-4 text-gray-300" />
                                                    <input 
                                                        type="password" 
                                                        placeholder="••••••••"
                                                        className="w-full bg-gray-50/70 border border-gray-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 ml-2">New Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-5 top-5 h-4 w-4 text-gray-300" />
                                                    <input 
                                                        type="password" 
                                                        placeholder="Create a strong password"
                                                        className="w-full bg-gray-50/70 border border-gray-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-12 border-t border-gray-50 flex justify-end">
                                            <ActionButton text="Update Credentials" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentTab === 'preferences' && (
                                <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-700">
                                    <div className="h-24 w-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-10">
                                        <SettingsIcon className="h-12 w-12 text-gray-200" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">System Preferences</h3>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-4">Feature development in progress</p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
