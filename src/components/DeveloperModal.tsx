import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Github, 
  ExternalLink, 
  Sparkles, 
  Check, 
  Copy, 
  RefreshCw, 
  FolderGit2, 
  Users, 
  MapPin, 
  Heart,
  CheckCircle2,
  Code
} from 'lucide-react';

interface GitHubProfileData {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
  html_url: string;
  company: string | null;
  blog: string | null;
}

const GITHUB_USERNAME = 'Bipindev404';
const STORAGE_KEY = 'tiptap_github_profile_bipin';

const FALLBACK_PROFILE: GitHubProfileData = {
  login: GITHUB_USERNAME,
  name: 'Bipin Yadav',
  avatar_url: `https://github.com/${GITHUB_USERNAME}.png`,
  bio: 'Full-stack developer building fast, modern web applications.',
  public_repos: 14,
  followers: 8,
  following: 12,
  location: 'Nepal',
  html_url: `https://github.com/${GITHUB_USERNAME}`,
  company: null,
  blog: null
};

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<GitHubProfileData>(FALLBACK_PROFILE);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [avatarError, setAvatarError] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);

  // Sync GitHub profile data directly from GitHub public API
  const syncWithGithub = useCallback(async (isManual = false) => {
    setIsSyncing(true);
    setSyncSuccess(false);

    try {
      const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        const updated: GitHubProfileData = {
          login: data.login || GITHUB_USERNAME,
          name: data.name || 'Bipin Yadav',
          avatar_url: data.avatar_url || `https://github.com/${GITHUB_USERNAME}.png`,
          bio: data.bio || FALLBACK_PROFILE.bio,
          public_repos: typeof data.public_repos === 'number' ? data.public_repos : FALLBACK_PROFILE.public_repos,
          followers: typeof data.followers === 'number' ? data.followers : FALLBACK_PROFILE.followers,
          following: typeof data.following === 'number' ? data.following : FALLBACK_PROFILE.following,
          location: data.location || FALLBACK_PROFILE.location,
          html_url: data.html_url || `https://github.com/${GITHUB_USERNAME}`,
          company: data.company || null,
          blog: data.blog || null
        };

        setProfile(updated);
        setAvatarError(false);
        const now = new Date();
        setLastSynced(now);
        setSyncSuccess(true);
        setTimeout(() => setSyncSuccess(false), 2500);

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            data: updated,
            timestamp: now.getTime()
          }));
        } catch {
          // localStorage non-fatal error handling
        }
      } else {
        // If rate limited or error, fallback to cached or default
        if (isManual) {
          setSyncSuccess(false);
        }
      }
    } catch {
      // Network offline or error, maintain fallback
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Initialize from cache and sync on open
  useEffect(() => {
    if (!isOpen) return;

    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.data) {
          setProfile(parsed.data);
          if (parsed.timestamp) {
            setLastSynced(new Date(parsed.timestamp));
          }
        }
      }
    } catch {
      // Ignore cache parse error
    }

    // Auto-sync in background
    syncWithGithub(false);
  }, [isOpen, syncWithGithub]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyGithub = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://github.com/${GITHUB_USERNAME}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Subtle Ambient Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        {/* Modal Top Controls: GitHub Sync status & Close Button */}
        <div className="flex items-center justify-between mb-2">
          {/* GitHub Sync Status Badge */}
          <button
            onClick={() => syncWithGithub(true)}
            disabled={isSyncing}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
              syncSuccess
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
            title="Click to sync live info from GitHub API"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-accent' : syncSuccess ? 'text-emerald-400' : 'text-zinc-400'}`} />
            <span>
              {isSyncing ? 'Syncing GitHub...' : syncSuccess ? 'Synced with GitHub' : 'GitHub Sync'}
            </span>
            {lastSynced && !isSyncing && !syncSuccess && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Header & Synced GitHub Avatar */}
        <div className="flex flex-col items-center text-center pt-2 pb-4">
          <div className="relative mb-3 group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-zinc-800 via-zinc-750 to-zinc-700 border-2 border-zinc-700/80 p-0.5 shadow-2xl flex items-center justify-center overflow-hidden">
              {!avatarError ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name || GITHUB_USERNAME}
                  onError={() => setAvatarError(true)}
                  className="w-full h-full object-cover rounded-2xl bg-zinc-900"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-zinc-950 flex items-center justify-center">
                  <span className="text-2xl font-black tracking-wider bg-gradient-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent font-brand">
                    BY
                  </span>
                </div>
              )}
            </div>

            {/* Live Synced GitHub Indicator */}
            <span 
              className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-zinc-950 border-2 border-zinc-950 shadow-sm"
              title="Synced with GitHub"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-1.5">
            {profile.name || 'Bipin Yadav'}
          </h2>

          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1 font-mono">
            <Github className="w-3.5 h-3.5 text-zinc-400" />
            <span>@{profile.login}</span>
            {profile.location && (
              <>
                <span>·</span>
                <span className="flex items-center gap-0.5 text-zinc-400 font-sans">
                  <MapPin className="w-3 h-3 text-zinc-500" />
                  {profile.location}
                </span>
              </>
            )}
          </div>

          <p className="text-xs text-zinc-300/90 mt-2 px-2 max-w-sm line-clamp-2">
            {profile.bio || 'Software Engineer & Creator of tipTap'}
          </p>

          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Distraction-free typing excellence creator</span>
          </div>
        </div>

        {/* Live GitHub Stats Cards */}
        <div className="grid grid-cols-2 gap-2 mb-3.5">
          <a
            href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-all text-left group"
          >
            <div className="flex items-center justify-between text-zinc-400 text-[11px] mb-1">
              <span className="flex items-center gap-1">
                <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
                Repositories
              </span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-lg font-bold text-zinc-100 font-mono">
              {profile.public_repos}
            </div>
          </a>

          <a
            href={`https://github.com/${GITHUB_USERNAME}?tab=followers`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-all text-left group"
          >
            <div className="flex items-center justify-between text-zinc-400 text-[11px] mb-1">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                Followers
              </span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-lg font-bold text-zinc-100 font-mono">
              {profile.followers}
            </div>
          </a>
        </div>

        {/* Primary Action Card: Follow & Copy */}
        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-3.5 mb-3.5 backdrop-blur-xs">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-100">
                <Github className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[11px] text-zinc-400 font-medium">GitHub Sync</div>
                <div className="text-xs font-semibold text-zinc-100 font-mono">
                  github.com/{GITHUB_USERNAME}
                </div>
              </div>
            </div>

            <button
              onClick={handleCopyGithub}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-400 hover:text-zinc-200 border border-zinc-700/60 transition-all cursor-pointer text-xs flex items-center gap-1"
              title="Copy GitHub URL"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <a
            href={profile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-xs transition-all shadow-md active:scale-[0.98] cursor-pointer"
          >
            <Github className="w-4 h-4" />
            <span>Visit @{GITHUB_USERNAME} on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 ml-auto text-zinc-500" />
          </a>
        </div>

        {/* Modal Footer Note with Live Sync details */}
        <div className="pt-3 border-t border-zinc-850/80 flex items-center justify-between text-[11px] text-zinc-500">
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>by Bipin Yadav</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
            <CheckCircle2 className="w-3 h-3 text-emerald-500/80" />
            <span>GitHub Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
