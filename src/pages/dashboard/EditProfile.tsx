import { useState } from "react";
import { Eye, EyeOff, Trash2, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import avatarImg from "@/assets/testimonial-avatar.jpg";

export default function EditProfile() {
  const [profile, setProfile] = useState({
    firstName: "Amir",
    lastName: "Kerim I",
    email: "Amir@Stealthstartup.Technology",
    country: "United States",
    state: "Missouri",
    postalCode: "90005",
    phone: "123-456-7890",
    password: "secretpassword",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>({});

  const toggleEdit = (field: string) => {
    setEditingFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    toast.success("Profile updated successfully!");
    setEditingFields({});
  };

  const handleDiscard = () => {
    setProfile({
      firstName: "Amir",
      lastName: "Kerim I",
      email: "Amir@Stealthstartup.Technology",
      country: "United States",
      state: "Missouri",
      postalCode: "90005",
      phone: "123-456-7890",
      password: "secretpassword",
    });
    setEditingFields({});
  };

  return (
    <div className="p-8 max-w-[1000px]">
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Edit Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-6 mb-8">
        <img src={avatarImg} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
        <div className="flex items-center gap-3">
          <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
            Change picture
          </button>
          <button className="flex items-center gap-2 border border-border px-6 py-2.5 rounded-full text-sm text-muted-foreground hover:text-foreground transition-colors">
            Delete picture <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Row 1: First name, Last name, Email */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">First name</label>
              <button onClick={() => toggleEdit("firstName")} className="text-xs text-primary font-medium">change</button>
            </div>
            <Input
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              disabled={!editingFields.firstName}
              className="bg-secondary/50 border-0 disabled:opacity-80"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">Last name</label>
              <button onClick={() => toggleEdit("lastName")} className="text-xs text-accent font-medium">save</button>
            </div>
            <Input
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              disabled={!editingFields.lastName}
              className="bg-secondary/50 border-0 disabled:opacity-80"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">Email</label>
              <button onClick={() => toggleEdit("email")} className="text-xs text-primary font-medium">change</button>
            </div>
            <Input
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              disabled={!editingFields.email}
              className="bg-secondary/50 border-0 disabled:opacity-80"
            />
          </div>
        </div>

        {/* Row 2: Country, State, Postal */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">Country of residence</label>
              <button onClick={() => toggleEdit("country")} className="text-xs text-primary font-medium">change</button>
            </div>
            <Select value={profile.country} onValueChange={(v) => setProfile({ ...profile, country: v })} disabled={!editingFields.country}>
              <SelectTrigger className="bg-secondary/50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="South Korea">South Korea</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">State</label>
              <button onClick={() => toggleEdit("state")} className="text-xs text-primary font-medium">change</button>
            </div>
            <Select value={profile.state} onValueChange={(v) => setProfile({ ...profile, state: v })} disabled={!editingFields.state}>
              <SelectTrigger className="bg-secondary/50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Missouri">Missouri</SelectItem>
                <SelectItem value="California">California</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">Postal code</label>
              <button onClick={() => toggleEdit("postalCode")} className="text-xs text-primary font-medium">change</button>
            </div>
            <Input
              value={profile.postalCode}
              onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
              disabled={!editingFields.postalCode}
              className="bg-secondary/50 border-0 disabled:opacity-80"
            />
          </div>
        </div>

        {/* Row 3: Phone, Password */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">Phone number</label>
              <button onClick={() => toggleEdit("phone")} className="text-xs text-primary font-medium">change</button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-secondary/50 rounded-lg px-3 py-2 text-sm">
                🇺🇸 <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </div>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!editingFields.phone}
                className="bg-secondary/50 border-0 disabled:opacity-80 flex-1"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-muted-foreground">Password</label>
              <button onClick={() => toggleEdit("password")} className="text-xs text-primary font-medium">change</button>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={profile.password}
                onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                disabled={!editingFields.password}
                className="bg-secondary/50 border-0 disabled:opacity-80 pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <button
              onClick={handleDiscard}
              className="border border-border px-8 py-2.5 rounded-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="bg-accent text-accent-foreground px-8 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
