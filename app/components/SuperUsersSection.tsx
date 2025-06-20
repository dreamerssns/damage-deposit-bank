"use client";

import { useState, useEffect, Fragment } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, ChevronDown, ChevronUp } from "lucide-react";

// Types

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: "landlord" | "renter" | "admin";
  isSuper?: boolean;
};

export default function SuperUserSection() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<{ landlord: boolean; renter: boolean }>({
    landlord: true,
    renter: true,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState({
    landlord: false,
    renter: false,
  });

  useEffect(() => {
    setLoading(true);
    const selectedRoles = Object.entries(roles)
      .filter(([, v]) => v)
      .map(([k]) => k);
    fetch(`/api/users?roles=${selectedRoles.join(",")}`)
      .then((res) => res.json())
      .then((data: User[]) => {
        setUsers(data);
        setLoading(false);
      });
  }, [roles]);

  const handleToggle = async (user: User) => {
    const res = await fetch(`/api/users/${user._id}/toggleSuper`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isSuper: !user.isSuper }),
    });
    if (res.ok) {
      setUsers((users) =>
        users.map((u) =>
          u._id === user._id ? { ...u, isSuper: !user.isSuper } : u
        )
      );
    }
  };

  const toggleSection = (section: "landlord" | "renter") => {
    setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleRoleToggle = (role: "landlord" | "renter") => {
    setRoles((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  const filtered = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const sections = {
    landlord: filtered.filter((u) => u.role === "landlord"),
    renter: filtered.filter((u) => u.role === "renter"),
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">
        SuperLandlord & SuperRenter Users
      </h2>
      <p className="text-gray-600 mb-4">
        Here you can verify if users are SuperLandlords or SuperRenters.
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          {(["landlord", "renter"] as const).map((r) => (
            <button
              key={r}
              onClick={() => handleRoleToggle(r)}
              className={`${
                roles[r]
                  ? "bg-primary-dark text-white"
                  : "bg-gray-200 text-gray-700"
              } px-4 py-2 rounded-full transition-colors focus:outline-none cursor-pointer`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}s
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-1/3">
          <Search className="absolute top-3 left-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin" size={48} />
        </div>
      ) : (
        <div className="space-y-8">
          {(Object.keys(sections) as Array<"landlord" | "renter">).map(
            (sec) =>
              roles[sec] && (
                <div key={sec}>
                  <button
                    onClick={() => toggleSection(sec)}
                    className="w-full flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    <span className="font-semibold">
                      {sec.charAt(0).toUpperCase() + sec.slice(1)}s (
                      {sections[sec].length})
                    </span>
                    {collapsed[sec] ? <ChevronDown /> : <ChevronUp />}
                  </button>

                  <AnimatePresence initial={false} mode="wait">
                    {!collapsed[sec] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mt-4 overflow-hidden"
                      >
                        {sections[sec].map((user) => (
                          <Fragment key={user._id}>
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto", width: "auto" }}
                              exit={{ height: 0 }}
                              className="border rounded-lg p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition"
                            >
                              <Image
                                src={
                                  user.avatarUrl || "/avatar-placeholder.png"
                                }
                                alt={`${user.firstName} avatar`}
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="font-medium">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-gray-500 capitalize">
                                  {user.role}
                                </div>
                              </div>

                              {user.isSuper && (
                                <span className="bg-secondary text-black px-2 py-1 rounded-full text-xs font-semibold">
                                  {user.role === "landlord"
                                    ? "SuperLandlord"
                                    : "SuperRenter"}
                                </span>
                              )}
                            </motion.div>
                            {isAdmin && (
                              <div className="relative z-100">
                                <button
                                  onClick={() => handleToggle(user)}
                                  className={`${
                                    user.isSuper
                                      ? "bg-red-500 hover:bg-red-600"
                                      : "bg-green-500 hover:bg-green-600"
                                  } text-white px-3 py-1 rounded-lg transition focus:outline-none absolute -left-1/5 transform -translate-x-1/2 cursor-pointer`}
                                >
                                  {user.isSuper ? "Remove Badge" : "Give Badge"}
                                </button>
                              </div>
                            )}
                          </Fragment>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
