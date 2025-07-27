import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Globe, 
  Shield, 
  CreditCard, 
  Download,
  Trash2,
  Eye,
  EyeOff,
  Check,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    lessons: true,
    achievements: false,
    reminders: true
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handlePasswordChange = () => {
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data export initiated",
      description: "Your data will be ready for download shortly.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion requested",
      description: "Please check your email to confirm account deletion.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and privacy settings</p>
        </motion.div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="space-y-6">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Tell us about yourself..."
                      defaultValue="Full-stack developer passionate about learning new technologies"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue="San Francisco, CA" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Learning Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="pst">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pst">Pacific Standard Time</SelectItem>
                        <SelectItem value="est">Eastern Standard Time</SelectItem>
                        <SelectItem value="gmt">Greenwich Mean Time</SelectItem>
                        <SelectItem value="cet">Central European Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Default Difficulty</Label>
                    <Select defaultValue="intermediate">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleSave} className="hover-glow">
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch 
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Switch 
                      id="push-notifications"
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="lesson-notifications">New Lessons</Label>
                      <p className="text-sm text-muted-foreground">Get notified about new lessons in your areas of interest</p>
                    </div>
                    <Switch 
                      id="lesson-notifications"
                      checked={notifications.lessons}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, lessons: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="achievement-notifications">Achievements</Label>
                      <p className="text-sm text-muted-foreground">Celebrate your learning milestones</p>
                    </div>
                    <Switch 
                      id="achievement-notifications"
                      checked={notifications.achievements}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, achievements: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reminder-notifications">Learning Reminders</Label>
                      <p className="text-sm text-muted-foreground">Daily reminders to keep your streak going</p>
                    </div>
                    <Switch 
                      id="reminder-notifications"
                      checked={notifications.reminders}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, reminders: checked }))}
                    />
                  </div>
                </div>
                
                <Button onClick={handleSave} className="hover-glow">
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Password & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input 
                        id="current-password" 
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" placeholder="Enter new password" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                  </div>
                  <Button onClick={handlePasswordChange} className="hover-glow">
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Two-Factor Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Badge variant="outline">Not Enabled</Badge>
                  </div>
                  <Button variant="outline" className="hover-glow">
                    Enable 2FA
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Appearance & Theme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Theme</Label>
                  <p className="text-sm text-muted-foreground mb-4">Choose your preferred theme</p>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'system', label: 'System', icon: Monitor }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          theme === option.value 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <option.icon className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm font-medium">{option.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium">Font Size</Label>
                  <p className="text-sm text-muted-foreground mb-4">Adjust the font size for better readability</p>
                  <Select defaultValue="medium">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSave} className="hover-glow">
                  Save Appearance Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <div className="space-y-6">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Public Profile</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see your learning progress</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Achievements</Label>
                      <p className="text-sm text-muted-foreground">Display your badges and certificates publicly</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Analytics Tracking</Label>
                      <p className="text-sm text-muted-foreground">Help us improve the platform with usage analytics</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-gradient border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <Trash2 className="w-5 h-5" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Export Your Data</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Download a copy of all your data including progress, achievements, and settings.
                    </p>
                    <Button variant="outline" onClick={handleExportData} className="hover-glow">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2 text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      className="hover:bg-destructive/80"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;