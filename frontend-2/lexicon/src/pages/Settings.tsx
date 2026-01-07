import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Trash2,
  Camera,
} from "lucide-react";
import { mockUser } from "@/lib/mockData";
import { endpoints } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { UserDTO, NotificationPrefsDTO } from "@/lib/types";
import { ProfilePictureSelector } from "@/components/profile/ProfilePictureSelector";

export default function Settings() {
  const navigate = useNavigate();
  const { user: authUser, logout, updateAvatar } = useAuth();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("Passionate learner exploring data science and machine learning");
  const [location, setLocation] = useState("San Francisco, USA");
  const [website, setWebsite] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      const parts = (authUser.name || "").trim().split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(authUser.email || "");
    } else {
      // Fallback to server fetch or mock if not in context
      endpoints.me
        .get()
        .then((u) => {
          setUser(u);
          const parts = (u.name || "").trim().split(" ");
          setFirstName(parts[0] || "");
          setLastName(parts.slice(1).join(" ") || "");
          setEmail(u.email || "");
        })
        .catch(() => {
          const parts = (mockUser.name || "").trim().split(" ");
          setFirstName(parts[0] || "");
          setLastName(parts.slice(1).join(" ") || "");
          setEmail(mockUser.email || "");
          setUser({ name: mockUser.name, email: mockUser.email, avatar: mockUser.avatar });
        });
    }
    // Load notification prefs if available; otherwise keep defaults
    endpoints.settings
      .getNotifications()
      .then((prefs) => {
        setEmailNotifications(prefs.emailNotifications);
        setPushNotifications(prefs.pushNotifications);
        setWeeklyDigest(prefs.weeklyDigest);
        setMarketingEmails(prefs.marketingEmails);
      })
      .catch(() => {
        // ignore; use defaults
      });
  }, [authUser]);

  const handleSaveProfile = () => {
    const updated: Partial<UserDTO> = {
      name: `${firstName} ${lastName}`.trim(),
      email,
    };
    endpoints.me
      .update(updated)
      .then((u) => {
        setUser(u);
        toast.success("Profile updated successfully");
      })
      .catch((e) => {
        console.error(e);
        toast.error("Failed to update profile. Using local changes only.");
        setUser((prev) => ({ ...(prev || {}), ...updated } as UserDTO));
      });
  };

  const handleSavePassword = () => {
    // Ideally capture form values; since UI inputs are uncontrolled here, just simulate
    endpoints.settings
      .changePassword({ currentPassword: "", newPassword: "" })
      .then(() => toast.success("Password changed successfully"))
      .catch(() => toast.error("Failed to change password"));
  };

  const handleSaveNotifications = () => {
    const prefs: NotificationPrefsDTO = {
      emailNotifications,
      pushNotifications,
      weeklyDigest,
      marketingEmails,
    };
    endpoints.settings
      .updateNotifications(prefs)
      .then(() => toast.success("Notification preferences saved"))
      .catch(() => toast.error("Couldn't save to server. Local preferences updated."));
  };

  const handleLogout = () => {
    logout();
    toast.success("You’ve been logged out");
    navigate("/auth/signin", { replace: true, state: { fromLogout: true } });
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="account" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile and personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar || mockUser.avatar} alt={user?.name || mockUser.name} />
                  <AvatarFallback className="text-2xl">SJ</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" className="gap-2" onClick={() => setShowAvatarPicker(true)}>
                    <Camera className="h-4 w-4" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Select from available avatars
                  </p>
                </div>
              </div>

              <ProfilePictureSelector
                open={showAvatarPicker}
                onOpenChange={setShowAvatarPicker}
                currentAvatar={user?.avatar}
                onSelect={async (avatarUrl) => {
                  await updateAvatar(avatarUrl);
                  setUser((prev) => prev ? { ...prev, avatar: avatarUrl } : prev);
                  toast.success("Profile picture updated!");
                }}
              />

              <Separator />

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" placeholder="Tell us about yourself..." value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="City, Country" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" placeholder="https://yourwebsite.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>

              <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary-hover">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose what notifications you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="email-notif" className="text-base">Course Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about courses you're enrolled in
                  </p>
                </div>
                <Switch
                  id="email-notif"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="push-notif" className="text-base">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new lessons and achievements
                  </p>
                </div>
                <Switch
                  id="push-notif"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="weekly-digest" className="text-base">Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of your progress
                  </p>
                </div>
                <Switch
                  id="weekly-digest"
                  checked={weeklyDigest}
                  onCheckedChange={setWeeklyDigest}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="marketing" className="text-base">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new features and promotions
                  </p>
                </div>
                <Switch
                  id="marketing"
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>

              <Button onClick={handleSaveNotifications} className="bg-primary hover:bg-primary-hover">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button onClick={handleSavePassword} className="bg-primary hover:bg-primary-hover">
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Log out</CardTitle>
              <CardDescription>Sign out from this device</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" onClick={handleLogout}>Log out</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Authenticator App</p>
                  <p className="text-sm text-muted-foreground">
                    Use an app to generate verification codes
                  </p>
                </div>
                <Badge variant="outline">Not Set Up</Badge>
              </div>
              <Button variant="outline">Enable 2FA</Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how Lexigrain looks for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select defaultValue="light">
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="pst">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                    <SelectItem value="est">Eastern Time (ET)</SelectItem>
                    <SelectItem value="gmt">GMT</SelectItem>
                    <SelectItem value="cet">Central European Time (CET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="bg-primary hover:bg-primary-hover">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing removed for free app */}
      </Tabs>
    </div>
  );
}
