import { useState } from "react";
import { useQuote } from "@/contexts/QuoteContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { COUNTRIES, STATES_BY_COUNTRY, ROLES, DIAL_CODES, countryFlag } from "@/data/data";

// ─── Searchable Country Combobox ──────────────────────────────────────────────
function CountryCombobox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = COUNTRIES.find((c) => c.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <span className={selected ? "text-foreground" : "text-muted-foreground"}>
            {selected ? selected.label : "Select country"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {COUNTRIES.map((country) => (
                <CommandItem
                  key={country.value}
                  value={country.label}
                  onSelect={() => { onChange(country.value); setOpen(false); }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === country.value ? "opacity-100" : "opacity-0")} />
                  {country.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ─── Cascading State / Province Field ────────────────────────────────────────
function StateField({ country, value, onChange }: { country: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const options = STATES_BY_COUNTRY[country];

  if (!country) {
    return <Input disabled placeholder="Select a country first" className="border-border" />;
  }

  if (!options) {
    return (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="State / Province / Region"
        className="border-border"
      />
    );
  }

  const selected = options.find((s) => s.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <span className={selected ? "text-foreground" : "text-muted-foreground"}>
            {selected ? selected.label : "Select state / province"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => { onChange(opt.value); setOpen(false); }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === opt.value ? "opacity-100" : "opacity-0")} />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ─── Phone Input with dial-code picker ───────────────────────────────────────
function PhoneInput({
  dialCode, phone,
  onDialChange, onPhoneChange,
}: {
  dialCode: string;
  phone: string;
  onDialChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = DIAL_CODES.find((d) => d.country === dialCode) ?? DIAL_CODES.find((d) => d.country === "us")!;

  return (
    <div className="flex h-9 w-full items-center rounded-md border border-input bg-transparent shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-ring">
      {/* Dial code picker */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 h-full border-r border-input bg-muted/30 hover:bg-muted/50 transition-colors text-sm shrink-0"
          >
            <span className="text-base leading-none">{countryFlag(selected.country)}</span>
            <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[260px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {DIAL_CODES.map((d) => (
                  <CommandItem
                    key={d.country}
                    value={`${d.label} ${d.code}`}
                    onSelect={() => { onDialChange(d.country); setOpen(false); }}
                  >
                    <span className="mr-2 text-base">{countryFlag(d.country)}</span>
                    <span className="flex-1 text-sm">{d.label}</span>
                    <span className="text-xs text-muted-foreground">{d.code}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Dial code label */}
      <span className="px-2 text-sm text-muted-foreground border-r border-input shrink-0">
        {selected.code}
      </span>

      {/* Phone number */}
      <input
        type="tel"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        placeholder="123-456-7890"
        className="flex-1 h-full px-3 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const Step1Admin = () => {
  const { data, updateData, setCurrentStep } = useQuote();
  const [showPassword, setShowPassword] = useState(false);

  const handleCountryChange = (v: string) => {
    updateData({ country: v, state: "" });
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  const stateLabel =
    data.country === "ca" ? "Province / Territory" :
    data.country === "gb" ? "Region" :
    "State / Province";

  return (
    <div className="p-6 lg:p-10">
      <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-8">
        <span className="text-primary">Let's Get Started</span> with Plan Administrator
      </h2>

      {/* Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">First name</label>
          <Input
            value={data.firstName}
            onChange={(e) => updateData({ firstName: e.target.value })}
            placeholder="Amir"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Last name</label>
          <Input
            value={data.lastName}
            onChange={(e) => updateData({ lastName: e.target.value })}
            placeholder="Kerim"
            className="border-border"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Email address</label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="amir@stealthstartup.com"
            className="border-border"
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Country of residence</label>
          <CountryCombobox value={data.country} onChange={handleCountryChange} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">{stateLabel}</label>
          <StateField
            country={data.country}
            value={data.state}
            onChange={(v) => updateData({ state: v })}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Postal code</label>
          <Input
            value={data.postalCode}
            onChange={(e) => updateData({ postalCode: e.target.value })}
            placeholder="90005"
            className="border-border"
          />
        </div>
      </div>

      {/* Role */}
      <div className="mb-6">
        <label className="text-xs text-muted-foreground mb-1 block">Your role in the company</label>
        <Select value={data.role} onValueChange={(v) => updateData({ role: v })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Which of the following best describes your position?" />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => (
              <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Phone + Password + Submit row */}
      <div className="flex flex-col md:flex-row items-end gap-3">
        <div className="flex-1 min-w-0">
          <label className="text-xs text-muted-foreground mb-1 block">Phone number</label>
          <PhoneInput
            dialCode={data.phoneDialCode}
            phone={data.phone}
            onDialChange={(v) => updateData({ phoneDialCode: v })}
            onPhoneChange={(v) => updateData({ phone: v })}
          />
        </div>

        <div className="flex-1 min-w-0">
          <label className="text-xs text-muted-foreground mb-1 block">Password</label>
          <div className="flex h-9 w-full items-center rounded-md border border-input bg-transparent shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-ring">
            <input
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) => updateData({ password: e.target.value })}
              placeholder="••••••••••"
              className="flex-1 h-full px-3 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="px-3 h-full text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          onClick={handleNext}
          className="h-9 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 shrink-0 whitespace-nowrap"
        >
          Get started
        </Button>
      </div>
    </div>
  );
};

export default Step1Admin;
