"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "../utils/axiosInstance";
import ProtectedRoute from "../components/ProtectedRoute";
import Profile from "../components/Profile";
import { Trash } from "lucide-react";
import { AVATAR_PRIMARY_URL, AVATAR_FALLBACK_URL } from "../../config";

interface Room {
  id: number;
  slug: string;
  createdAt: string;
  adminId: string;
}

export default function DashBoard() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=32"
  );
  const [avatarSeed, setAvatarSeed] = useState<string>("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);

  const generateAvatarForUser = (name: string, seed: string) => {
    // Use seed to determine gender consistently
    const gender = parseInt(seed) % 2 === 0 ? "boy" : "girl";
    const primaryAvatarURL = `${AVATAR_PRIMARY_URL}/${gender}`;

    // Set primary URL directly
    setAvatarUrl(primaryAvatarURL);
  };

  const refreshAvatar = () => {
    if (!userName) return;
    setAvatarLoading(true);
    // Generate new random seed
    const newSeed = Math.floor(Math.random() * 10000).toString();
    const userAvatarKey = `avatar_seed_${userName}`;

    localStorage.setItem(userAvatarKey, newSeed);
    setAvatarSeed(newSeed);

    // Use simple URLs for refresh
    const gender = parseInt(newSeed) % 2 === 0 ? "boy" : "girl";
    const newAvatarURL = `${AVATAR_PRIMARY_URL}/${gender}`;
    setAvatarUrl(newAvatarURL);
    setAvatarLoading(false);
  };

  const fetchData = async () => {
    try {
      const userRes = await axiosInstance.get("/user/me");
      const name = userRes.data.name;
      setUserName(name);

      // Generate consistent avatar based on user's name
      const userAvatarKey = `avatar_seed_${name}`;
      let seed = localStorage.getItem(userAvatarKey);

      if (!seed) {
        // Generate initial seed based on name hash for consistency
        const hash = name.split("").reduce((a: number, b: string) => {
          a = (a << 5) - a + b.charCodeAt(0);
          return a & a; // Convert to 32-bit integer
        }, 0);
        seed = Math.abs(hash % 10000).toString();
        localStorage.setItem(userAvatarKey, seed);
      }

      setAvatarSeed(seed);
      generateAvatarForUser(name, seed);

      // Fetch user's rooms
      const roomsRes = await axiosInstance.get("/room/user/rooms");
      setRooms(roomsRes.data.rooms);
    } catch (err) {
      console.error("Failed to fetch user data", err);
      router.push("/signin");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;

    setLoading(true);
    try {
      const res = await axiosInstance.post("/room", {
        name: roomName.trim(),
      });

      if (res.data.roomId) {
        // Refresh rooms list and navigate to the new room
        await fetchData();
        router.push(`/canvas/${res.data.roomId}`);
      }
    } catch (err: any) {
      console.error("Failed to create room", err);
      alert(err.response?.data?.message || "Failed to create room");
    } finally {
      setLoading(false);
      setShowCreateModal(false);
      setRoomName("");
    }
  };

  const handleJoinRoom = (roomId: number) => {
    router.push(`/canvas/${roomId}`);
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (!roomId) return;

    setLoading(true);
    try {
      const res = await axiosInstance.delete(`/room/${roomId}`);

      if (res.data.message) {
        // Refresh rooms list after successful deletion
        await fetchData();
      }
    } catch (err: any) {
      console.error("Failed to delete room", err);
      alert(err.response?.data?.message || "Failed to delete room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white flex flex-col">
        {/* Top Navbar */}
        <header className="w-full flex items-center justify-between px-6 py-4 border-b border-white/10">
          <Link href="/" className="text-2xl font-extrabold tracking-wide">
            ⚡ Exceldraw
          </Link>
          <div className="flex items-center space-x-4">
            <Profile
              name={userName || "User"}
              username={userName || "User"}
              avatarUrl={avatarUrl}
              onLogout={handleLogout}
              onRefreshAvatar={refreshAvatar}
            />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card to create a new room */}
            <div
              onClick={() => setShowCreateModal(true)}
              className="p-8 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-start justify-center hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-3">＋ Create New Room</h2>
              <p className="text-sm opacity-70">
                Start a fresh collaboration space instantly.
              </p>
            </div>

            {/* Existing rooms section */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <h2 className="text-lg font-semibold mb-4">
                Your Rooms ({rooms.length})
              </h2>
              {rooms.length === 0 ? (
                <p className="text-sm opacity-70">
                  No rooms created yet. Create your first room!
                </p>
              ) : (
                <ul className="space-y-3 text-sm">
                  {rooms.map((room) => (
                    <li
                      key={room.id}
                      onClick={() => handleJoinRoom(room.id)}
                      className="p-3 rounded-lg bg-black border border-white/10 hover:bg-white/5 transition cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">{room.slug}</div>
                        <div className="text-xs opacity-60 mt-1">
                          Created {new Date(room.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Trash
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRoom(room.id);
                        }}
                        className="ml-3 cursor-pointer hover:text-red-500"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </main>

        {/* Create Room Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-black p-6 rounded-2xl border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.15)] w-full max-w-md transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6 text-center tracking-wide">
                Create New Room
              </h3>
              <input
                type="text"
                placeholder="Room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full p-3 bg-black border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:shadow-[0_0_10px_rgba(255,255,255,0.4)] mb-6 transition-all"
                onKeyPress={(e) => e.key === "Enter" && handleCreateRoom()}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-white/30 rounded-lg text-white hover:bg-white hover:text-black transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRoom}
                  disabled={loading || !roomName.trim()}
                  className="flex-1 px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-black hover:text-white border border-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
