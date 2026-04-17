/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, MapPin, Bookmark, Menu as MenuIcon, User, X, Camera, Zap, 
  RefreshCw, History, Info, ChevronRight, Settings, Bell, Heart,
  Utensils, Globe, Sparkles, BookOpen, AlertTriangle, CheckCircle2,
  Flame, Leaf, Ban, Wheat
} from "lucide-react";
import { analyzeMenuImage, MenuAnalysisResult } from "./services/gemini";
import { REAL_DISHES, REAL_RESTAURANTS, Dish } from "./constants/data";

// --- Types ---
type OnboardingStep = "welcome" | "dietary" | "completed";

interface UserProfile {
  restrictions: string[];
  spiceTolerance: string;
  isGuest: boolean;
}

// --- Components ---

const StatusHeader = () => (
  <div className="h-10 px-6 flex justify-between items-center text-[10px] font-semibold tracking-widest opacity-40">
    <span>16:21</span>
    <div className="flex gap-2">
      <div className="w-3 h-3 border border-text-secondary rounded-sm" />
      <div className="w-3 h-3 border border-text-secondary rounded-full" />
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState("Stories");
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    restrictions: [],
    spiceTolerance: "Mild",
    isGuest: true
  });
  
  const [showScanner, setShowScanner] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResults, setScanResults] = useState<MenuAnalysisResult[] | null>(null);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<{ type: "all_stories" | "all_heritage" | null }>({ type: null });
  
  const [identificationHistory, setIdentificationHistory] = useState([
    { id: 1, name: "Salted Duck", date: "2 mins ago", type: "Heritage" },
    { id: 2, name: "Duck Blood and Vermicelli Soup", date: "1 hour ago", type: "Classic" },
    { id: 3, name: "Beef Potstickers", date: "Yesterday", type: "Halal" }
  ]);

  const [dishes, setDishes] = useState(REAL_DISHES);
  const [restaurants, setRestaurants] = useState(REAL_RESTAURANTS);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<"story" | "discover">("story");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setPreviewImage(null);
    setEditingItem(null);
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // --- AI Capture Logic ---

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsAnalyzing(true);
    setScanResults(null);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    // Set canvas dimensions to match video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Draw current frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to base64 (jpeg for lower bandwidth)
    const base64Image = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
    
    try {
      const results = await analyzeMenuImage(base64Image);
      setScanResults(results);
      
      // Save to history
      if (results.length > 0) {
        setIdentificationHistory(prev => [
          { 
            id: Date.now(), 
            name: results[0].dishName, 
            date: "Just now", 
            type: results[0].dietaryFlags.halal ? "Halal" : results[0].dietaryFlags.vegan ? "Vegan" : "Heritage" 
          },
          ...prev.slice(0, 5)
        ]);
      }
    } catch (err) {
      console.error("Scanning failed:", err);
      alert("AI recognition service is temporarily unavailable. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Check if first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem("heirloom_visited");
    if (!hasVisited) {
      setOnboardingStep("welcome");
    }
  }, []);

  const handleCompleteOnboarding = () => {
    localStorage.setItem("heirloom_visited", "true");
    setOnboardingStep(null);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (showScanner) startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [showScanner]);

  // --- Sub-pages ---

  const StoriesPage = () => {
    if (viewMode.type === "all_heritage") {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
          <header className="px-6 py-4 flex items-center gap-4 bg-bg/50 backdrop-blur-md sticky top-0 z-30">
            <button onClick={() => setViewMode({ type: null })} className="text-accent"><X size={20} /></button>
            <h2 className="text-xl font-serif">Heritage Archive</h2>
          </header>
          <div className="px-6 space-y-4 pt-6">
            {dishes.map(dish => (
              <div 
                key={dish.id} 
                onClick={() => setSelectedDish(dish)}
                className="bg-surface/30 p-4 rounded-3xl border border-line/30 flex gap-4 cursor-pointer hover:border-accent/30 transition-colors"
              >
                <img src={dish.image} className="w-20 h-20 rounded-2xl object-cover bg-zinc-800" referrerPolicy="no-referrer" />
                <div className="flex flex-col justify-center">
                  <h4 className="font-serif text-lg leading-tight">{dish.name}</h4>
                  <p className="text-[10px] text-accent/60 uppercase tracking-widest font-bold mt-1 italic">{dish.chineseName}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="pb-24"
      >
        <header className="px-6 py-4 flex justify-between items-center bg-bg/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <MenuIcon size={20} className="text-accent" />
            <div className="text-xl font-serif italic text-accent font-medium tracking-tight">Taste Nanjing</div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setUploadType("story"); setShowUploadModal(true); }}
              className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent hover:bg-accent/20 transition-colors"
            >
              <Zap size={18} />
            </button>
            <Bell size={20} className="text-text-secondary" />
          </div>
        </header>

        <div className="px-6 pt-6">
          <section className="mb-10">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-serif font-light">Culinary Stories</h2>
              <button 
                onClick={() => setViewMode({ type: "all_heritage" })}
                className="text-[10px] uppercase tracking-widest text-accent font-bold"
              >
                View Archive
              </button>
            </div>
            <div 
              onClick={() => setSelectedDish(dishes[0])}
              className="relative h-96 group rounded-[40px] overflow-hidden border border-line cursor-pointer"
            >
              <img 
                src={dishes[0].image} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-2 inline-block">Featured Heritage</span>
                <h3 className="text-3xl font-serif leading-tight mb-3">{dishes[0].name}</h3>
                <p className="text-text-secondary text-sm line-clamp-2 mb-4 font-light leading-relaxed">
                  {dishes[0].description}
                </p>
                <div className="flex items-center gap-2 text-xs text-white">
                  Read Full Story <ChevronRight size={14} />
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-serif font-light mb-6">Culinary Chapters</h2>
              <div className="grid grid-cols-2 gap-4">
                {dishes.slice(1, 3).map((dish, i) => (
                  <div 
                    key={dish.id} 
                    onClick={() => setSelectedDish(dish)}
                    className="relative aspect-[3/4] rounded-[32px] overflow-hidden border border-line group cursor-pointer"
                  >
                    <img src={dish.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-5">
                      <span className="text-[8px] uppercase tracking-widest text-accent font-bold">Chapter 0{i+2}</span>
                      <h4 className="text-sm font-serif leading-tight mt-1">{dish.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-serif font-light mb-6">Recommended for You</h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {["For You", "Gluten-Free", "Vegan", "Classic"].map((tag, i) => (
                <button 
                  key={tag}
                  className={`flex-shrink-0 px-5 py-2 rounded-full text-[10px] uppercase tracking-widest border transition-all ${i === 0 ? "bg-accent text-bg border-accent font-bold" : "border-line text-text-secondary hover:text-text-primary"}`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="mt-6 space-y-6">
              {dishes.slice(1, 6).map(dish => (
                <div 
                  key={dish.id} 
                  onClick={() => setSelectedDish(dish)}
                  className="flex gap-4 bg-surface/30 p-4 rounded-3xl border border-line/30 group cursor-pointer hover:border-accent/40 transition-colors"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={dish.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] text-accent font-bold uppercase tracking-widest mb-1 italic">{dish.category}</span>
                    <h4 className="text-lg font-serif mb-1">{dish.name}</h4>
                    <p className="text-xs text-text-secondary font-light line-clamp-1">{dish.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    );
  };

  const IdentifyPage = () => {
    const [viewAllHistory, setViewAllHistory] = useState(false);
    const historyToShow = viewAllHistory ? identificationHistory : identificationHistory.slice(0, 3);

    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="px-6 pt-12 pb-24 max-w-lg mx-auto"
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-light mb-4 tracking-tight">Identify Your<br /><span className="italic text-accent">Harvest</span></h1>
          <p className="text-text-secondary text-sm font-light leading-relaxed px-8">
            Snap a photo of your menu to discover its translation, ingredients and dietary safety notes.
          </p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowScanner(true)}
          className="w-full aspect-square max-w-[280px] mx-auto bg-surface rounded-[60px] border-2 border-dashed border-accent/30 flex flex-col items-center justify-center gap-6 relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-20 h-20 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
            <Camera size={32} />
          </div>
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Open Camera</span>
            <p className="text-[10px] text-text-secondary mt-1 tracking-widest">TAP TO SNAP</p>
          </div>
        </motion.button>

        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-serif font-light">Recent Identifications</h2>
            <button 
              onClick={() => setViewAllHistory(!viewAllHistory)}
              className="text-[10px] uppercase tracking-widest text-accent font-bold"
            >
              {viewAllHistory ? "Show Less" : "See All"}
            </button>
          </div>
          <div className="space-y-4">
            {historyToShow.map(item => (
              <div 
                key={item.id} 
                onClick={() => {
                  const dish = REAL_DISHES.find(d => d.name === item.name) || REAL_DISHES[0];
                  setSelectedDish(dish);
                }}
                className="bg-surface/50 p-4 rounded-3xl border border-line/30 flex justify-between items-center cursor-pointer hover:border-accent/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                    <History size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <p className="text-[10px] text-text-secondary uppercase tracking-widest">{item.date} • {item.type}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-text-secondary" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const DiscoverPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    
    const filteredRestaurants = restaurants.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="px-6 pt-12 pb-24"
      >
        <div className="flex items-center gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, restaurants..."
              className="w-full bg-surface border border-line rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <button 
            onClick={() => { setUploadType("discover"); setShowUploadModal(true); }}
            className="w-12 h-12 rounded-2xl bg-accent text-bg flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Sparkles size={20} />
          </button>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-serif font-light mb-6">Explore Nanjing</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Heritage", icon: Sparkles },
              { label: "Halal", icon: Globe },
              { label: "Street Food", icon: Utensils },
              { label: "Classic", icon: BookOpen }
            ].map((cat, i) => (
              <div 
                key={i} 
                onClick={() => setSearchQuery(cat.label)}
                className={`bg-surface/40 p-6 rounded-[32px] border transition-all cursor-pointer group ${searchQuery === cat.label ? "border-accent" : "border-line/30 hover:border-accent/30"}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${searchQuery === cat.label ? "bg-accent text-bg" : "bg-accent/10 border border-accent/20 text-accent"}`}>
                  <cat.icon size={20} />
                </div>
                <span className="text-xs uppercase tracking-widest font-bold">{cat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6 px-1">
            <h2 className="text-lg font-serif font-light">Friendly Restaurants</h2>
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-[10px] text-accent font-bold uppercase tracking-widest">Clear</button>
            )}
          </div>
          <div className="space-y-6">
            {filteredRestaurants.length > 0 ? filteredRestaurants.map(res => (
              <div 
                key={res.id} 
                onClick={() => setSelectedRestaurant(res)}
                className="relative group rounded-[32px] overflow-hidden border border-line bg-surface/20 cursor-pointer hover:border-accent/40 transition-colors"
              >
                <div className="h-40 bg-zinc-800">
                  <img src={res.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    {res.tags.map(tag => (
                      <span key={tag} className="text-[9px] uppercase font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">{tag}</span>
                    ))}
                  </div>
                  <h3 className="text-xl font-serif mb-1">{res.name}</h3>
                  <p className="text-[10px] text-text-secondary uppercase tracking-widest mb-3 italic">Specialty: {res.specialty}</p>
                  <div className="flex items-center gap-1 text-text-secondary text-[10px] font-light">
                    <MapPin size={10} /> {res.address}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 opacity-40 italic font-serif">No matches found for "{searchQuery}"</div>
            )}
          </div>
        </section>
      </motion.div>
    );
  };

  const ProfilePage = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="px-6 pt-16 pb-24"
    >
      <div className="flex flex-col items-center mb-12">
        <div className="w-24 h-24 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-accent mb-4 overflow-hidden relative group">
          <img src="https://picsum.photos/seed/userprofile/200/200" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={20} />
          </div>
        </div>
        <h2 className="text-2xl font-serif italic text-accent">{profile.isGuest ? "Culinary Guest" : "John Doe"}</h2>
        <span className="text-[10px] uppercase tracking-[0.2em] text-text-secondary mt-1">Explorer Level 1</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-12">
        <button 
          onClick={() => { setUploadType("story"); setShowUploadModal(true); }}
          className="bg-surface/40 p-6 rounded-[32px] border border-line/30 flex flex-col items-center gap-3 hover:border-accent/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
            <BookOpen size={20} />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold">Upload Story</span>
        </button>
        <button 
          onClick={() => { setUploadType("discover"); setShowUploadModal(true); }}
          className="bg-surface/40 p-6 rounded-[32px] border border-line/30 flex flex-col items-center gap-3 hover:border-accent/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
            <MapPin size={20} />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold">Add Discovery</span>
        </button>
      </div>

      {/* User Taste Profile Preview */}
      <section className="mb-12">
        <h3 className="text-[10px] uppercase tracking-[0.3em] text-text-secondary mb-6 font-bold text-center">Your Taste Profile</h3>
        <div className="bg-surface/30 rounded-[32px] p-8 border border-accent/10">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-text-secondary block mb-3 font-bold">Preferences</span>
              <div className="flex flex-wrap gap-2">
                {profile.restrictions.length > 0 ? profile.restrictions.map(r => (
                  <span key={r} className="text-[9px] uppercase font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-1 rounded-lg">{r}</span>
                )) : <span className="text-[9px] text-text-secondary italic">None set</span>}
              </div>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-text-secondary block mb-3 font-bold">Spice Tolerance</span>
              <span className="text-xs font-serif italic text-accent">{profile.spiceTolerance}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        {[
          { icon: Settings, label: "Settings", action: () => {} },
          { icon: Utensils, label: "Taste Archives", action: () => { setActiveTab("Stories"); setViewMode({ type: "all_heritage" }); } },
          { icon: Bookmark, label: "Saved Stories", action: () => { setActiveTab("Stories"); } },
          { icon: Globe, label: "Language", action: () => {} },
          { icon: Info, label: "Help & Feedback", action: () => {} }
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={item.action}
            className="w-full flex justify-between items-center bg-surface/30 p-5 rounded-3xl border border-white/5 hover:border-accent/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-text-secondary">
                <item.icon size={18} />
              </div>
              <span className="text-sm font-light">{item.label}</span>
            </div>
            <ChevronRight size={16} className="text-text-secondary" />
          </button>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] text-text-secondary uppercase tracking-widest opacity-40">Taste Nanjing v1.0 MVP •南京</p>
      </div>
    </motion.div>
  );

  // --- Onboarding UI ---

  if (onboardingStep) {
    return (
      <div className="min-h-screen bg-bg text-text-primary p-8 flex flex-col justify-center items-center text-center">
        <StatusHeader />
        <AnimatePresence mode="wait">
          {onboardingStep === "welcome" ? (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center"
            >
              <div className="w-32 h-32 bg-accent/20 rounded-full flex items-center justify-center text-accent mb-8">
                <Globe size={64} />
              </div>
              <h1 className="text-5xl font-serif italic text-accent mb-4 leading-tight">Taste Nanjing</h1>
              <p className="text-text-secondary font-light text-sm italic mb-12 px-6">Discover Heritage, Savor the Soul of Nanjing.</p>
              <button 
                onClick={() => setOnboardingStep("dietary")}
                className="w-full max-w-xs py-5 bg-accent text-bg font-bold uppercase tracking-[0.2em] rounded-[32px] shadow-lg shadow-accent/20"
              >
                Start Journey
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="dietary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full max-w-sm flex flex-col"
            >
              <h2 className="text-3xl font-serif italic mb-2">Taste Profile</h2>
              <p className="text-text-secondary text-xs uppercase tracking-widest mb-10 font-bold">Customize your culinary experience</p>
              
              <div className="space-y-6 text-left mb-12">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-text-secondary block mb-3 font-bold">Dietary Restrictions</label>
                  <div className="flex flex-wrap gap-2">
                    {["Halal", "Vegan", "Vegetarian", "No Pork", "Nut Allergy", "Seafood Allergy"].map(tag => (
                      <button 
                         key={tag}
                         onClick={() => {
                           setProfile(prev => ({
                             ...prev,
                             restrictions: prev.restrictions.includes(tag) 
                               ? prev.restrictions.filter(r => r !== tag)
                               : [...prev.restrictions, tag]
                           }));
                         }}
                         className={`px-4 py-2 rounded-full text-[10px] uppercase border transition-all ${profile.restrictions.includes(tag) ? "bg-accent/20 border-accent text-accent" : "border-line text-text-secondary"}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-text-secondary block mb-3 font-bold">Spice Tolerance</label>
                  <div className="flex justify-between bg-surface p-2 rounded-2xl border border-line">
                    {["None", "Mild", "Medium", "Extra"].map(level => (
                      <button 
                        key={level}
                        onClick={() => setProfile(prev => ({...prev, spiceTolerance: level}))}
                        className={`flex-1 py-3 px-2 rounded-xl text-[10px] uppercase font-bold transition-all ${profile.spiceTolerance === level ? "bg-accent text-bg shadow-md" : "text-text-secondary hover:text-text-primary"}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto flex gap-4">
                <button 
                  onClick={handleCompleteOnboarding}
                  className="flex-1 py-5 border border-line text-text-secondary font-bold uppercase tracking-widest rounded-[28px]"
                >
                  Skip
                </button>
                <button 
                  onClick={handleCompleteOnboarding}
                  className="flex-[2] py-5 bg-white text-bg font-bold uppercase tracking-widest rounded-[28px]"
                >
                  Save & Enter
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --- Main App UI ---

  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-accent selection:text-bg">
      <StatusHeader />

      <main>
        {activeTab === "Stories" && <StoriesPage />}
        {activeTab === "Identify" && <IdentifyPage />}
        {activeTab === "Discover" && <DiscoverPage />}
        {activeTab === "Profile" && <ProfilePage />}
      </main>

      {/* Hidden Canvas for Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Scanner Overlay */}
      <AnimatePresence>
        {showScanner && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-black z-[60] flex flex-col"
          >
            <div className="relative flex-1 overflow-hidden">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-80" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="relative w-72 h-72 border-2 border-white/20 rounded-3xl">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent rounded-br-lg" />
                  
                  {isAnalyzing && (
                    <motion.div 
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-accent shadow-[0_0_20px_rgba(197,160,89,1)] z-10"
                    />
                  )}
                </div>
              </div>

              <div className="absolute top-12 left-0 right-0 px-6 flex justify-between items-center">
                <button onClick={() => setShowScanner(false)} className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white"><X size={20} /></button>
                <div className="flex gap-4">
                  <button className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center"><Zap size={20} /></button>
                  <button className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center"><RefreshCw size={20} /></button>
                </div>
              </div>

              {/* Scanning Results Preview Overlay */}
              <AnimatePresence>
                {scanResults && (
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute inset-x-6 bottom-6 bg-surface/90 backdrop-blur-xl rounded-[32px] p-6 border border-accent/30 max-h-[60%] overflow-y-auto pointer-events-auto"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-serif italic text-accent">Analysis Report</h3>
                      <button onClick={() => setScanResults(null)} className="text-text-secondary"><X size={16} /></button>
                    </div>
                    
                    <div className="space-y-6">
                      {scanResults.map((dish, i) => (
                        <div key={i} className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-lg font-serif">{dish.dishName}</h4>
                              <p className="text-[10px] text-text-secondary uppercase tracking-widest">{dish.originalName}</p>
                            </div>
                            {dish.uncertaintyScore < 70 && (
                              <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">
                                <AlertTriangle size={10} /> Uncertain
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {dish.dietaryFlags.halal && (
                              <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded">
                                <CheckCircle2 size={10} /> Halal
                              </span>
                            )}
                            {dish.dietaryFlags.vegan && (
                              <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded">
                                <Leaf size={10} /> Vegan
                              </span>
                            )}
                            {dish.dietaryFlags.noPork && dish.dietaryFlags.halal === false && (
                              <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded">
                                <Ban size={10} /> No Pork
                              </span>
                            )}
                            {dish.dietaryFlags.spiceLevel > 0 && (
                              <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded">
                                <Flame size={10} /> {Array(dish.dietaryFlags.spiceLevel).fill('🌶️').join('')}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-text-secondary font-light leading-relaxed mb-3">
                            {dish.description}
                          </p>
                          
                          {dish.culturalContext && (
                            <div className="bg-accent/5 p-3 rounded-2xl border border-accent/10">
                              <p className="text-[10px] text-accent/80 leading-relaxed font-light italic">
                                <Sparkles size={10} className="inline mr-1 mb-0.5" />
                                {dish.culturalContext}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-44 bg-bg flex flex-col items-center justify-center px-6">
              <div className="relative">
                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="absolute -inset-4 border-2 border-accent rounded-full border-t-transparent animate-spin"
                    />
                  )}
                </AnimatePresence>
                <button 
                  disabled={isAnalyzing}
                  className={`w-20 h-20 rounded-full border-4 border-accent p-1 transition-all ${isAnalyzing ? "opacity-30 scale-90" : "active:scale-95"}`}
                  onClick={captureAndAnalyze}
                >
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    {isAnalyzing && <Sparkles size={24} className="text-accent animate-pulse" />}
                  </div>
                </button>
              </div>
              <p className="mt-6 text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold">
                {isAnalyzing ? "AI Analyzing Ingredients..." : "Taste Nanjing Scanner"}
              </p>
              <p className="mt-2 text-[8px] text-text-secondary/40 max-w-xs text-center leading-tight">
                AI translation & safety flags for informational purposes. Verify critical allergies with staff.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-bg/80 backdrop-blur-xl border-t border-line px-6 py-4 flex justify-around items-center z-40">
        {[
          { icon: BookOpen, label: "Stories" },
          { icon: Camera, label: "Identify" },
          { icon: Utensils, label: "Discover" },
          { icon: User, label: "Profile" }
        ].map((item) => {
          const Icon = item.icon;
          
          return (
            <button 
              key={item.label}
              onClick={() => {
                setActiveTab(item.label);
                setViewMode({ type: null });
              }}
              className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.label ? "text-accent scale-110" : "text-text-secondary hover:text-text-primary"}`}
            >
              <Icon size={20} strokeWidth={activeTab === item.label ? 2.5 : 1.5} />
              <span className="text-[9px] uppercase tracking-widest font-bold tracking-tighter">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center"
            onClick={closeUploadModal}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-bg w-full max-w-lg rounded-t-[40px] sm:rounded-[40px] border-t sm:border border-line overflow-hidden max-h-[90vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 flex justify-between items-center bg-surface/50 border-b border-line">
                <div>
                  <h2 className="text-2xl font-serif text-accent">
                    {editingItem ? "Edit" : "Manual"} {uploadType === "story" ? "Submission" : "Discovery"}
                  </h2>
                  <p className="text-[10px] uppercase tracking-widest text-text-secondary mt-1">
                    {editingItem ? "Refine existing archival entry" : "Contribute to the Archive"}
                  </p>
                </div>
                <button onClick={closeUploadModal} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-secondary hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto no-scrollbar">
                <form 
                  id="upload-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const name = formData.get("name") as string;
                    const chineseName = formData.get("chineseName") as string;
                    const description = formData.get("description") as string;
                    const image = previewImage || (editingItem?.image) || "https://picsum.photos/seed/nanjing/800/600";

                    if (uploadType === "story") {
                      if (editingItem) {
                        setDishes(prev => prev.map(d => d.id === editingItem.id ? {
                           ...d,
                           name, chineseName, description, image,
                           category: (formData.get("category") as any) || d.category,
                           culturalContext: (formData.get("culturalContext") as string) || d.culturalContext,
                           ingredients: (formData.get("ingredients") as string)?.split(",").map(i => i.trim()) || d.ingredients,
                           dietaryFlags: {
                             halal: formData.get("halal") === "on",
                             vegan: formData.get("vegan") === "on",
                             noPork: formData.get("noPork") === "on",
                             spiceLevel: d.dietaryFlags.spiceLevel
                           }
                        } : d));
                        if (selectedDish?.id === editingItem.id) {
                          setSelectedDish(prev => prev ? { ...prev, name, chineseName, description, image } : null);
                        }
                      } else {
                        const newDish: Dish = {
                          id: `user-${Date.now()}`,
                          name,
                          chineseName,
                          category: (formData.get("category") as any) || "Classic",
                          description,
                          culturalContext: (formData.get("culturalContext") as string) || "User shared heritage story.",
                          ingredients: (formData.get("ingredients") as string)?.split(",").map(i => i.trim()) || [],
                          dietaryFlags: {
                            halal: formData.get("halal") === "on",
                            vegan: formData.get("vegan") === "on",
                            noPork: formData.get("noPork") === "on",
                            spiceLevel: 0
                          },
                          image
                        };
                        setDishes(prev => [...prev, newDish]);
                      }
                    } else {
                      if (editingItem) {
                        setRestaurants(prev => prev.map(r => r.id === editingItem.id ? {
                          ...r,
                          name, chineseName, description, image,
                          tags: (formData.get("tags") as string)?.split(",").map(t => t.trim()) || r.tags,
                          address: (formData.get("address") as string) || r.address,
                          specialty: (formData.get("specialty") as string) || r.specialty,
                        } : r));
                        if (selectedRestaurant?.id === editingItem.id) {
                          setSelectedRestaurant(prev => prev ? { ...prev, name, chineseName, description, image } : null);
                        }
                      } else {
                        const newRes = {
                          id: `res-user-${Date.now()}`,
                          name,
                          chineseName,
                          tags: (formData.get("tags") as string)?.split(",").map(t => t.trim()) || ["Local"],
                          address: (formData.get("address") as string) || "Nanjing",
                          specialty: (formData.get("specialty") as string) || "Regional Cuisine",
                          description,
                          image
                        };
                        setRestaurants(prev => [...prev, newRes]);
                      }
                    }
                    closeUploadModal();
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-text-secondary block mb-2 font-bold group-focus-within:text-accent transition-colors">Visual Archive (Photo Upload)</label>
                      <div 
                        className="relative aspect-video rounded-3xl border border-dashed border-line bg-surface/30 flex flex-col items-center justify-center p-4 cursor-pointer hover:border-accent/40 transition-all overflow-hidden"
                        onClick={() => document.getElementById("file-upload")?.click()}
                      >
                        {(previewImage || editingItem?.image) ? (
                          <img src={previewImage || editingItem?.image} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <>
                            <Camera size={32} className="text-text-secondary mb-2" />
                            <span className="text-xs text-text-secondary font-light">Tap to choose image</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          id="file-upload"
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setPreviewImage(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="group">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-text-secondary block mb-2 font-bold group-focus-within:text-accent transition-colors">Name</label>
                        <input required name="name" defaultValue={editingItem?.name} placeholder="English Name" className="w-full bg-surface/50 border border-line rounded-2xl py-4 px-6 text-sm outline-none focus:border-accent/50 transition-all font-light" />
                      </div>
                      <div className="group">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-text-secondary block mb-2 font-bold group-focus-within:text-accent transition-colors">Hanzi</label>
                        <input name="chineseName" defaultValue={editingItem?.chineseName} placeholder="中文名称" className="w-full bg-surface/50 border border-line rounded-2xl py-4 px-6 text-sm outline-none focus:border-accent/50 transition-all font-light" />
                      </div>
                    </div>

                    {uploadType === "story" ? (
                      <>
                        <div className="group">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-text-secondary block mb-2 font-bold group-focus-within:text-accent transition-colors">Category</label>
                          <select name="category" defaultValue={editingItem?.category || "Heritage"} className="w-full bg-surface/50 border border-line rounded-2xl py-4 px-6 text-sm outline-none focus:border-accent/50 transition-all font-light appearance-none font-serif italic text-white">
                            <option value="Heritage" className="bg-bg">Heritage</option>
                            <option value="Classic" className="bg-bg">Classic</option>
                            <option value="Halal" className="bg-bg">Halal</option>
                            <option value="Vegan" className="bg-bg">Vegan</option>
                            <option value="Street Food" className="bg-bg">Street Food</option>
                          </select>
                        </div>
                        <div className="group">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-text-secondary block mb-2 font-bold group-focus-within:text-accent transition-colors">Ingredients (Comma separated)</label>
                          <input name="ingredients" defaultValue={editingItem?.ingredients?.join(", ")} placeholder="Water, Salt, Duck..." className="w-full bg-surface/50 border border-line rounded-2xl py-4 px-6 text-sm outline-none focus:border-accent/50 transition-all font-light" />
                        </div>
                        <div className="flex gap-4 p-4 bg-surface/30 rounded-2xl border border-line/30 group">
                           <div className="flex items-center gap-2">
                             <input type="checkbox" name="halal" id="halal" defaultChecked={editingItem?.dietaryFlags?.halal} className="accent-accent" />
                             <label htmlFor="halal" className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Halal</label>
                           </div>
                           <div className="flex items-center gap-2">
                             <input type="checkbox" name="vegan" id="vegan" defaultChecked={editingItem?.dietaryFlags?.vegan} className="accent-accent" />
                             <label htmlFor="vegan" className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Vegan</label>
                           </div>
                           <div className="flex items-center gap-2">
                             <input type="checkbox" name="noPork" id="noPork" defaultChecked={editingItem?.dietaryFlags?.noPork} className="accent-accent" />
                             <label htmlFor="noPork" className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">No Pork</label>
                           </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="group">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-text-secondary block mb-2 font-bold group-focus-within:text-accent transition-colors">Specialty</label>
                          <input name="specialty" defaultValue={editingItem?.specialty} placeholder="Signature Dish" className="w-full bg-surface/50 border border-line rounded-2xl py-4 px-6 text-sm outline-none focus:border-accent/50 transition-all font-light" />
                        </div>
                        <div className="group">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-text-secondary block mb-2 font-bold group-focus-within:text-accent transition-colors">Address</label>
                          <input name="address" defaultValue={editingItem?.address} placeholder="Location in Nanjing" className="w-full bg-surface/50 border border-line rounded-2xl py-4 px-6 text-sm outline-none focus:border-accent/50 transition-all font-light" />
                        </div>
                        <div className="group">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-text-secondary block mb-2 font-bold group-focus-within:text-accent transition-colors">Tags (Comma separated)</label>
                          <input name="tags" defaultValue={editingItem?.tags?.join(", ")} placeholder="Historical, Cheap, Famous..." className="w-full bg-surface/50 border border-line rounded-2xl py-4 px-6 text-sm outline-none focus:border-accent/50 transition-all font-light" />
                        </div>
                      </>
                    )}

                    <div className="group">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-text-secondary block mb-2 font-bold group-focus-within:text-accent transition-colors">The Narrative</label>
                      <textarea required name="description" defaultValue={editingItem?.description} rows={4} placeholder="Tell the story or share the review..." className="w-full bg-surface/50 border border-line rounded-2xl py-4 px-6 text-sm outline-none focus:border-accent/50 transition-all font-light resize-none" />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-accent text-bg font-bold uppercase tracking-[0.3em] rounded-[28px] shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {editingItem ? "Update Entry" : "Submit Entry"}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dish Detail Modal */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed inset-0 bg-bg z-[70] overflow-y-auto"
          >
            <div className="relative h-80">
              <img src={selectedDish.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
              <button 
                onClick={() => setSelectedDish(null)}
                className="absolute top-12 right-6 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="px-8 pb-32 -mt-10 relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl font-serif text-accent leading-tight">{selectedDish.name}</h2>
                  <p className="text-sm text-text-secondary uppercase tracking-widest font-bold italic mt-1">{selectedDish.chineseName}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setUploadType("story");
                      setEditingItem(selectedDish);
                      setShowUploadModal(true);
                    }}
                    className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-accent hover:border-accent/60 transition-colors"
                  >
                    <RefreshCw size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center text-accent">
                    <Bookmark size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {selectedDish.dietaryFlags.halal && <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] uppercase font-bold rounded-lg tracking-widest">Halal</span>}
                {selectedDish.dietaryFlags.vegan && <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] uppercase font-bold rounded-lg tracking-widest">Vegan</span>}
                {selectedDish.dietaryFlags.noPork && <span className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px] uppercase font-bold rounded-lg tracking-widest">No Pork</span>}
                <span className="px-3 py-1 bg-accent/10 text-accent border border-accent/20 text-[10px] uppercase font-bold rounded-lg tracking-widest italic">{selectedDish.category}</span>
              </div>

              <section className="mb-10">
                <h3 className="text-[10px] uppercase tracking-widest text-text-secondary mb-4 font-bold">The Story</h3>
                <p className="text-text-primary text-sm font-light leading-relaxed whitespace-pre-line">
                  {selectedDish.description}
                </p>
              </section>

              <section className="mb-10 p-6 bg-surface/40 rounded-[32px] border border-accent/10">
                <h3 className="text-[10px] uppercase tracking-widest text-accent mb-4 font-bold flex items-center gap-2">
                  <Sparkles size={14} /> Cultural Context
                </h3>
                <p className="text-text-secondary text-sm font-light italic leading-relaxed">
                  {selectedDish.culturalContext}
                </p>
              </section>

              <section className="mb-10">
                <h3 className="text-[10px] uppercase tracking-widest text-text-secondary mb-4 font-bold">Key Ingredients</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedDish.ingredients.map(ing => (
                    <div key={ing} className="bg-surface/50 px-4 py-2 rounded-2xl border border-line text-xs font-light">
                      {ing}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        )}

        {selectedRestaurant && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed inset-0 bg-bg z-[70] overflow-y-auto"
          >
            <div className="relative h-64">
              <img src={selectedRestaurant.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
              <button 
                onClick={() => setSelectedRestaurant(null)}
                className="absolute top-12 right-6 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="px-8 pb-32">
              <h2 className="text-3xl font-serif text-accent mb-1">{selectedRestaurant.name}</h2>
              <p className="text-sm text-text-secondary uppercase tracking-widest mb-6 font-bold">{selectedRestaurant.chineseName}</p>
              
              <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
                <MapPin size={16} className="text-accent" />
                <span>{selectedRestaurant.address}</span>
              </div>

              <div className="flex gap-3 mb-8">
                <button 
                  onClick={() => {
                    setUploadType("discover");
                    setEditingItem(selectedRestaurant);
                    setShowUploadModal(true);
                  }}
                  className="flex items-center gap-2 bg-surface border border-line px-4 py-2 rounded-xl text-accent text-xs hover:border-accent/60 transition-colors"
                >
                  <RefreshCw size={14} /> Edit Listing
                </button>
              </div>

              <section className="mb-10">
                <h3 className="text-[10px] uppercase tracking-widest text-text-secondary mb-4 font-bold">About</h3>
                <p className="text-text-primary text-sm font-light leading-relaxed">
                  {selectedRestaurant.description}
                </p>
              </section>
              
              <section className="mb-10">
                <h3 className="text-[10px] uppercase tracking-widest text-accent mb-4 font-bold">Signature Specialty</h3>
                <div className="bg-surface/30 p-6 rounded-3xl border border-accent/20">
                  <p className="text-lg font-serif italic">{selectedRestaurant.specialty}</p>
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
