"use client";
import { Input, Button } from "@repo/ui";
import { HTTP_BACKEND } from "@/config";
import { use, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function AuthPage({ isSignin }: { isSignin: boolean }) {
  const [name, setName] = useState("");
  const [username, setUsernanme] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(testCreds?: {
    username: string;
    password: string;
  }) {
    setLoading(true);
    try {
      const endpoint = isSignin
        ? `${HTTP_BACKEND}/user/signin`
        : `${HTTP_BACKEND}/user/signup`;

      const payload = isSignin
        ? testCreds || { username, password }
        : { name, username, password };

      const res = await axiosInstance.post(endpoint, payload);
      console.log("Success", res.data);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      console.error("Auth Failed", err.response?.data || err.message);
      alert(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#1111]">
      <div className="w-full max-w-sm bg-[#111111] border border-white/10  p-6 rounded-2xl shadow-md text-white">
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          {isSignin ? "Sign In" : "Sign Up"}
        </h2>
        <div className="flex flex-col gap-4">
          {!isSignin && (
            <Input
              type="text"
              placeholder="Name"
              className="w-full"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          )}
          <Input
            type="text"
            placeholder="Email"
            className="w-full"
            value={username}
            onChange={(e) => {
              setUsernanme(e.target.value);
            }}
          />
          <Input
            type="password"
            placeholder="Password"
            className="w-full"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Button onClick={() => handleSubmit()}>
            {loading
              ? isSignin
                ? "Signing In..."
                : "Signing Up..."
              : isSignin
                ? "Sign In"
                : "Sign Up"}
          </Button>
        </div>
        <div className="flex items-center justify-center mt-4 text-sm text-white/70">
          {isSignin ? (
            <span>
              New user?{" "}
              <a href="/signup" className=" hover:underline hover:text-white">
                Sign Up instead
              </a>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <a href="/signin" className=" hover:underline hover:text-white">
                Sign In
              </a>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
