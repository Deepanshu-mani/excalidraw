"use client";

import { useState } from "react";
import { AVATAR_FALLBACK_URL } from "../../config";

interface ProfileProps {
  username: string;
  name: string;
  avatarUrl: string;
  onLogout: () => void;
  onRefreshAvatar?: () => void;
}

export default function Profile({
  username,
  name,
  avatarUrl,
  onLogout,
  onRefreshAvatar,
}: ProfileProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    onLogout();
  };

  const handleRefreshAvatar = () => {
    if (onRefreshAvatar) {
      onRefreshAvatar();
      setDropdownOpen(false);
    }
  };

  // Provide default avatar if none is available
  const displayAvatarUrl =
    avatarUrl ||
    `${AVATAR_FALLBACK_URL}/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=32`;

  return (
    <div className="relative inline-block">
      <div
        onClick={toggleDropdown}
        className="flex items-center space-x-3 cursor-pointer hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200"
      >
        {displayAvatarUrl ? (
          <img
            src={displayAvatarUrl}
            alt="avatar"
            className="w-8 h-8 rounded-full border border-white/20"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `${AVATAR_FALLBACK_URL}/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=32`;
            }}
          />
        ) : (
          <div className="w-8 h-8 rounded-full border border-white/20 bg-white/10 animate-pulse" />
        )}
        <span className="text-sm font-medium">{name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {dropdownOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setDropdownOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-black border border-white/20 rounded-lg shadow-xl z-20">
            <div className="p-3 border-b border-white/10">
              <div className="flex items-center space-x-3">
                {displayAvatarUrl ? (
                  <img
                    src={displayAvatarUrl}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border border-white/20"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `${AVATAR_FALLBACK_URL}/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=40`;
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full border border-white/20 bg-white/10 animate-pulse" />
                )}
                <div>
                  <div className="text-sm font-medium text-white">{name}</div>
                  <div className="text-xs text-white/60">@{username}</div>
                </div>
              </div>
            </div>

            <div className="py-2">
              {onRefreshAvatar && (
                <button
                  onClick={handleRefreshAvatar}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Refresh Avatar</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-red-600 hover:text-white transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
