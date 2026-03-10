import React from "react";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { userService } from "@/services/userService";

export default function ProfilePage() {
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getUser();
        setUserData(userData);
      } catch (err) {
        console.error("User retrieval failed", err);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#faf6f1", fontFamily: "Georgia, serif" }}
    >
      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8" style={{ color: "#3d2b1f" }}>
          My Profile
        </h1>

        <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-8">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#ede5dc" }}
              >
                <User size={40} style={{ color: "#c0694e" }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#3d2b1f" }}>
                  {userData.username}
                </h2>
                <p className="text-stone-500">Member since 2026</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-stone-700">
                <Mail className="text-[#c0694e]" size={20} />
                <span className="text-lg">{userData.useremail}</span>
              </div>

              <div className="flex items-center gap-4 text-stone-700">
                <Phone className="text-[#c0694e]" size={20} />
                <span className="text-lg">{userData.userphone}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
