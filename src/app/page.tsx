"use client";

import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import Link from "next/link";
import { SyncStatus } from "@/components/examples/sync-status";
import { ReduxExample } from "@/components/examples/redux-example";

export default function Home() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">EduGive</h1>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3">
                  {user?.image && (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-8 h-8 rounded-full"
                      width={20}
                      height={20}
                    />
                  )}
                  <span className="text-sm text-gray-600">
                    Welcome, {user?.name || user?.email}!
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {isAuthenticated ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="space-y-2">
              <p>
                <strong>ID:</strong> {user?.id}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Name:</strong> {user?.name}
              </p>
              {user?.image && (
                <div>
                  <p>
                    <strong>Profile Image:</strong>
                  </p>
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-16 h-16 rounded-full mt-2"
                    width={30}
                    height={30}
                  />
                </div>
              )}
            </div>
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-green-800">
                ✅ Authentication is working! You can see the user data above.
              </p>
            </div>
            
            {/* User Sync Status */}
            <div className="mt-6">
              <SyncStatus />
            </div>
            
            {/* Redux Example */}
            <div className="mt-6">
              <ReduxExample />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Welcome to EduGive</h2>
            <p className="text-gray-600 mb-8">
              Please sign in to access your account and view your information.
            </p>
            <Link
              href="/auth/signin"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
