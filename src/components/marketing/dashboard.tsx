import { LayoutGrid, FolderKanban, Users, CheckSquare, CircleUserRound, Receipt, FileText, Blocks, Settings, Search, Bell, Calendar, MoreHorizontal, BellIcon } from 'lucide-react';
import Icons from '../global/icons';

const Dashboard = () => {
    return (
        <div className="w-full h-full bg-[#0A0B0F] flex overflow-hidden">
            <aside className="w-60 border-r border-foreground/10 flex flex-col shrink-0">
                <div className="p-4">
                    <Icons.wordmark className="h-5 w-auto text-white" />
                </div>

                <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                    <div className="relative px-3 py-2.5 bg-primary/10 text-primary rounded-lg flex items-center gap-3 text-sm font-medium cursor-pointer">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r" />
                        <LayoutGrid className="w-4 h-4" />
                        <span>Dashboard</span>
                    </div>
                    <div className="px-3 py-2.5 text-foreground/60 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer">
                        <FolderKanban className="w-4 h-4" />
                        <span>Projects</span>
                        <span className="ml-auto text-xs bg-white/10 px-1.5 py-0.5 rounded">12</span>
                    </div>
                    <div className="px-3 py-2.5 text-foreground/60 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer">
                        <Users className="w-4 h-4" />
                        <span>Clients</span>
                        <span className="ml-auto text-xs bg-white/10 px-1.5 py-0.5 rounded">48</span>
                    </div>
                    <div className="px-3 py-2.5 text-foreground/60 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer">
                        <CheckSquare className="w-4 h-4" />
                        <span>Tasks</span>
                        <span className="ml-auto text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">8</span>
                    </div>
                    <div className="px-3 py-2.5 text-foreground/60 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer">
                        <Receipt className="w-4 h-4" />
                        <span>Invoices</span>
                    </div>
                    <div className="px-3 py-2.5 text-foreground/60 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer">
                        <CircleUserRound className="w-4 h-4" />
                        <span>Partners</span>
                    </div>
                    <div className="px-3 py-2.5 text-foreground/60 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer">
                        <FileText className="w-4 h-4" />
                        <span>Templates</span>
                    </div>
                    <div className="my-2 border-t border-foreground/10" />

                    <div className="px-3 py-2.5 text-foreground/60 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer">
                        <Blocks className="w-4 h-4" />
                        <span>Templates</span>
                    </div>
                    <div className="px-3 py-2.5 text-foreground/60 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors cursor-pointer">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                    </div>
                </nav>

                <div className="p-3 space-y-2">
                    <button className="w-full px-3 py-2 text-xs text-foreground/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left cursor-pointer">
                        Help Center
                    </button>
                    <button className="w-full px-3 py-2 text-xs bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors font-medium cursor-pointer">
                        Upgrade Plan
                    </button>
                    <div className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                        <div className="size-7 rounded-full bg-linear-to-br from-primary to-blue-500 flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">SS</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">Shreyas Sihasane</p>
                            <p className="text-xs text-foreground/60 truncate">hello@budgetndiostory.org</p>
                        </div>
                        <MoreHorizontal className="w-4 h-4 text-foreground/60" />
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b border-foreground/10 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4 flex-1">
                        <div>
                            <h1 className="text-base font-semibold flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                Today
                            </h1>
                            <p className="text-xs text-foreground/60">Saturday, Nov 29</p>
                        </div>
                        <div className="flex-1 max-w-md ml-8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                                <input
                                    type="text"
                                    placeholder="Search clients, projects, tasks, invoices..."
                                    className="w-full h-9 pl-9 pr-4 bg-foreground/5 border border-foreground/10 rounded-lg text-sm placeholder:text-foreground/40 focus:outline-none focus:border-primary/50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="relative w-9 h-9 flex items-center justify-center hover:bg-foreground/5 rounded-lg transition-colors cursor-pointer">
                            <BellIcon className="w-4 h-4 text-foreground/60" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                        </button>
                        <div className="size-8 rounded-full bg-linear-to-br from-primary to-blue-500 flex items-center justify-center cursor-pointer">
                            <span className="text-white font-semibold text-xs leading-none mt-0.5">SS</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto">
                    <div className="p-8 max-w-7xl mx-auto space-y-8">
                        {/* Header Section */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Management Suite</h2>
                                <p className="text-sm text-foreground/50 mt-1">Unified view of your core business entities.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="px-4 py-2 bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-lg text-xs font-semibold text-white transition-colors">
                                    Export Data
                                </button>
                                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
                                    + Create New
                                </button>
                            </div>
                        </div>

                        {/* Core Pillars Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Clients', value: '24', change: '+2 this week', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                                { label: 'Projects', value: '12', change: '4 active', icon: FolderKanban, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                                { label: 'Tasks', value: '48', change: '8 due today', icon: CheckSquare, color: 'text-orange-400', bg: 'bg-orange-400/10' },
                                { label: 'Invoices', value: 'KSh 1.2M', change: '3 pending', icon: Receipt, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-foreground/2 border border-foreground/10 rounded-2xl p-6 hover:bg-foreground/5 transition-all group relative overflow-hidden">
                                    <div className="flex items-start justify-between relative z-10">
                                        <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} ring-1 ring-inset ring-white/5`}>
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-foreground/30">{stat.label}</span>
                                            <div className="text-2xl font-bold text-white leading-none mt-1.5">{stat.value}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-foreground/5 relative z-10">
                                        <span className="text-[11px] text-foreground/50 font-medium">{stat.change}</span>
                                        <span className="text-[11px] text-primary hover:text-white transition-colors cursor-pointer font-bold">Insights</span>
                                    </div>
                                    <div className={`absolute -right-4 -bottom-4 size-24 ${stat.color} opacity-5 blur-3xl`} />
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                            <div className="space-y-8">
                                {/* Unified Action Feed */}
                                <div className="bg-foreground/2 border border-foreground/10 rounded-2xl overflow-hidden shadow-2xl">
                                    <div className="px-6 py-5 border-b border-foreground/10 flex items-center justify-between bg-white/[0.02]">
                                        <div className="flex items-center gap-3">
                                            <div className="size-2 rounded-full bg-primary animate-pulse" />
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Unified Action Feed</h3>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex gap-1">
                                                <div className="size-1.5 rounded-full bg-blue-400" />
                                                <div className="size-1.5 rounded-full bg-purple-400" />
                                                <div className="size-1.5 rounded-full bg-orange-400" />
                                                <div className="size-1.5 rounded-full bg-emerald-400" />
                                            </div>
                                            <button className="text-[10px] font-bold text-foreground/40 hover:text-white transition-colors uppercase tracking-wider">Filter</button>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-foreground/5">
                                        {[
                                            { type: 'Task', icon: CheckSquare, title: 'Review budget story draft', meta: 'Education spending • High Priority', time: '2h ago', color: 'text-orange-400' },
                                            { type: 'Invoice', icon: Receipt, title: 'Payment received from Nairobi County', meta: 'INV-2024-88 • KSh 250,000', time: '5h ago', color: 'text-emerald-400' },
                                            { type: 'Project', icon: FolderKanban, title: 'Health Fund Analysis milestone', meta: 'Data Collection Phase Complete', time: '1d ago', color: 'text-purple-400' },
                                            { type: 'Client', icon: Users, title: 'UNICEF Onboarding', meta: 'New strategic partnership', time: '2d ago', color: 'text-blue-400' },
                                            { type: 'Task', icon: CheckSquare, title: 'Update design system', meta: 'Antigravity UI components', time: '3d ago', color: 'text-orange-400' },
                                            { type: 'Invoice', icon: Receipt, title: 'Draft invoice: County Media', meta: 'Project: Budget Story Reel', time: '4d ago', color: 'text-emerald-400' },
                                        ].map((item, i) => (
                                            <div key={i} className="px-6 py-5 hover:bg-white/[0.02] transition-all flex items-center gap-5 group cursor-pointer border-l-2 border-transparent hover:border-primary">
                                                <div className={`size-11 rounded-2xl bg-foreground/5 flex items-center justify-center ${item.color} group-hover:scale-105 transition-all ring-1 ring-white/5`}>
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${item.color}`}>{item.type}</span>
                                                        <span className="text-[10px] text-foreground/20">•</span>
                                                        <span className="text-[10px] text-foreground/40 font-medium">{item.time}</span>
                                                    </div>
                                                    <h4 className="text-[15px] font-semibold text-white tracking-tight group-hover:text-primary transition-colors">{item.title}</h4>
                                                    <p className="text-xs text-foreground/40 truncate mt-1 font-medium">{item.meta}</p>
                                                </div>
                                                <div className="size-8 rounded-lg flex items-center justify-center bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreHorizontal className="w-4 h-4 text-foreground/60" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 text-center border-t border-foreground/5">
                                        <button className="text-[11px] font-bold text-primary hover:underline">View Load More</button>
                                    </div>
                                </div>

                                {/* Quick Projects View */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-foreground/2 border border-foreground/10 rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-white">Active Storyboards</h3>
                                            <span className="text-[10px] font-bold text-primary hover:underline cursor-pointer">Explore</span>
                                        </div>
                                        <div className="space-y-5">
                                            <div className="group cursor-pointer">
                                                <div className="flex justify-between text-xs mb-2">
                                                    <span className="font-semibold text-foreground/70 group-hover:text-white transition-colors">Education Budget</span>
                                                    <span className="text-foreground/40 font-bold">75%</span>
                                                </div>
                                                <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden p-0.5">
                                                    <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(0,85,255,0.5)]" style={{ width: '75%' }} />
                                                </div>
                                            </div>
                                            <div className="group cursor-pointer">
                                                <div className="flex justify-between text-xs mb-2">
                                                    <span className="font-semibold text-foreground/70 group-hover:text-white transition-colors">Health Fund Tracker</span>
                                                    <span className="text-foreground/40 font-bold">45%</span>
                                                </div>
                                                <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden p-0.5">
                                                    <div className="h-full bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: '45%' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-foreground/2 border border-foreground/10 rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-white">Ready to Invoice</h3>
                                            <span className="text-[10px] font-bold text-primary hover:underline cursor-pointer">Finance</span>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-colors group cursor-pointer">
                                                <span className="text-xs font-semibold text-foreground/70 group-hover:text-white">County Media Reel</span>
                                                <span className="text-xs font-black text-emerald-400">KSh 45k</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-colors group cursor-pointer">
                                                <span className="text-xs font-semibold text-foreground/70 group-hover:text-white">Health Data Audit</span>
                                                <span className="text-xs font-black text-emerald-400">KSh 120k</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Upcoming Deadlines */}
                                <div className="bg-foreground/2 border border-foreground/10 rounded-xl p-5">
                                    <h3 className="text-sm font-semibold mb-5 flex items-center gap-2 text-white">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        Critical Deadlines
                                    </h3>
                                    <div className="space-y-5">
                                        <div className="flex gap-4">
                                            <div className="text-center shrink-0 w-8">
                                                <div className="text-[10px] font-bold text-foreground/40 uppercase">Dec</div>
                                                <div className="text-lg font-black text-white leading-none mt-1">02</div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">Project Delivery</p>
                                                <p className="text-xs text-foreground/50 truncate mt-0.5">UNICEF Q4 Report</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="text-center shrink-0 w-8">
                                                <div className="text-[10px] font-bold text-foreground/40 uppercase">Dec</div>
                                                <div className="text-lg font-black text-white opacity-40 leading-none mt-1">08</div>
                                            </div>
                                            <div className="flex-1 min-w-0 font-medium">
                                                <p className="text-sm font-medium text-foreground/40 truncate">Invoice Payment</p>
                                                <p className="text-xs text-foreground/30 truncate mt-0.5">County Health Board</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full mt-6 py-2 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-bold rounded-lg transition-colors">
                                        View Calendar
                                    </button>
                                </div>

                                {/* Team Overview */}
                                <div className="bg-foreground/2 border border-foreground/10 rounded-xl p-5">
                                    <h3 className="text-sm font-semibold mb-4 text-white">Active Team</h3>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Shreyas S', role: 'Designer', initial: 'SS', color: 'from-primary to-blue-500' },
                                            { name: 'John Doe', role: 'Developer', initial: 'JD', color: 'from-tertiary to-purple-500' },
                                            { name: 'Alice Smith', role: 'Manager', initial: 'AS', color: 'from-orange-500 to-red-500' },
                                        ].map((member, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className={`size-8 rounded-full bg-linear-to-br ${member.color} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                                                    {member.initial}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-medium text-white truncate">{member.name}</p>
                                                    <p className="text-[10px] text-foreground/50 truncate">{member.role}</p>
                                                </div>
                                                <div className="size-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-4 py-2 border border-foreground/10 hover:bg-white/5 text-foreground/60 text-xs font-medium rounded-lg transition-colors">
                                        Manage Team
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
