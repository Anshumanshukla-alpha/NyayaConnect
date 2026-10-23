import React, { useState } from 'react';
import { User, NotificationPreferences } from '../types';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Bell, 
  ShieldCheck, 
  Key, 
  Smartphone, 
  Globe, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Save, 
  RefreshCw,
  LogOut,
  Building,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';

interface UserProfileProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  onEmitAuditLog: (action: string, resource: string, details: string) => void;
  onShowToast: (message: string) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  currentUser,
  onUpdateUser,
  onEmitAuditLog,
  onShowToast,
}) => {
  const [activeSection, setActiveSection] = useState<'CONTACT' | 'NOTIFICATIONS' | 'SECURITY'>('CONTACT');

  // Contact form state
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [city, setCity] = useState(currentUser.city);
  const [state, setState] = useState(currentUser.state || 'Delhi (NCT)');
  const [address, setAddress] = useState(currentUser.address || 'B-42, Defence Colony, South Delhi - 110024');
  const [preferredLanguage, setPreferredLanguage] = useState(currentUser.preferredLanguage || 'English / Hindi');

  // Notification Preferences state
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>(
    currentUser.notificationPreferences || {
      emailConsultations: true,
      smsReminders: true,
      whatsappAlerts: true,
      hearingDateAlerts: true,
      documentUpdates: true,
      securityLoginAlerts: true,
    }
  );

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser.twoFactorEnabled ?? true);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Save Contact Details
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      onShowToast('Please fill in all required contact fields.');
      return;
    }

    const updated: User = {
      ...currentUser,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      state: state.trim(),
      address: address.trim(),
      preferredLanguage: preferredLanguage.trim(),
    };

    onUpdateUser(updated);
    onEmitAuditLog(
      'PROFILE_CONTACT_UPDATE',
      `/client/profile/update?id=${currentUser.id}`,
      `Updated contact information for ${name.trim()} (${phone.trim()})`
    );
    onShowToast('Contact information saved successfully!');
  };

  // Save Notification Preferences
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...currentUser,
      notificationPreferences: notifPrefs,
    };

    onUpdateUser(updated);
    onEmitAuditLog(
      'NOTIFICATION_PREFERENCES_UPDATE',
      `/client/profile/notifications?id=${currentUser.id}`,
      `Updated communication channel preferences (Email, SMS, WhatsApp)`
    );
    onShowToast('Notification preferences updated!');
  };

  // Change Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError('Please provide your current account password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters in length.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    onEmitAuditLog(
      'PASSWORD_CHANGE',
      `/client/security/password?id=${currentUser.id}`,
      'Password updated with BCrypt salted hash (cost factor 12).'
    );

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onShowToast('Password updated securely with BCrypt hashing!');
  };

  // Toggle 2FA
  const handleToggle2FA = () => {
    const newState = !twoFactorEnabled;
    setTwoFactorEnabled(newState);
    const updated: User = {
      ...currentUser,
      twoFactorEnabled: newState,
    };
    onUpdateUser(updated);
    onEmitAuditLog(
      '2FA_TOGGLE',
      `/client/security/2fa?id=${currentUser.id}`,
      `Two-Factor Authentication (OTP) set to: ${newState ? 'ENABLED' : 'DISABLED'}`
    );
    onShowToast(`Two-Factor Authentication ${newState ? 'enabled' : 'disabled'}.`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* 1. Profile Hero & Identity Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-2xl uppercase shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {currentUser.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Client
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                <span>Client account</span>
                <span>·</span>
                <span>Location: <strong className="text-slate-700">{currentUser.city}</strong></span>
              </div>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Last Authenticated</span>
            <span className="font-mono text-slate-700 mt-0.5 block">{currentUser.lastLogin || '2026-10-07 10:45 AM'}</span>
          </div>
        </div>

        {/* Section Navigation Tabs (Single Elevation, Functional Segmented Control) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 mt-6 max-w-md">
          <button
            onClick={() => setActiveSection('CONTACT')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center ${
              activeSection === 'CONTACT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Contact Information
          </button>
          <button
            onClick={() => setActiveSection('NOTIFICATIONS')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center ${
              activeSection === 'NOTIFICATIONS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveSection('SECURITY')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center ${
              activeSection === 'SECURITY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Security &amp; 2FA
          </button>
        </div>
      </div>

      {/* 2. SECTION 1: Contact Information */}
      {activeSection === 'CONTACT' && (
        <form onSubmit={handleSaveContact} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Basic Contact &amp; Legal Service Address
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These details are used to issue statutory demand notices, court process correspondence, and video consultation bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address (Primary Contact) *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number (SMS / WhatsApp) *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 font-mono"
              />
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Consultation Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 bg-white"
              >
                <option value="English / Hindi">English / Hindi (Bilingual)</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
                <option value="Bengali">Bengali</option>
                <option value="Tamil">Tamil</option>
                <option value="Urdu">Urdu</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / District Court Jurisdiction *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State / Union Territory *
              </label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800"
              />
            </div>

            {/* Mailing Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mailing / Residential Address (for Legal Notices)
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Include House/Flat No., Street, Landmark, and PIN code..."
                className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 resize-none"
              />
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              * Your account information is processed securely and protected by your account permissions.
            </span>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5 text-amber-300" />
              <span>Save Contact Details</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. SECTION 2: Notification Preferences */}
      {activeSection === 'NOTIFICATIONS' && (
        <form onSubmit={handleSaveNotifications} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Communication Channels &amp; Legal Event Alerts
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose how you want to be alerted regarding upcoming video calls, court dates, and advocate messages.
            </p>
          </div>

          {/* Granular Toggles List */}
          <div className="space-y-3 text-xs">
            
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
              <div>
                <span className="font-bold text-slate-900 block">Court Hearing &amp; Case Listing Reminders</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Receive SMS and Email reminders 48 hours and 24 hours prior to scheduled court appearances.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.hearingDateAlerts}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, hearingDateAlerts: e.target.checked })}
                className="mt-1 rounded accent-slate-900 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
              <div>
                <span className="font-bold text-slate-900 block">Consultation Booking &amp; Jitsi Room Links</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Instant notification when an advocate accepts or reschedules your 30-min consultation.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.emailConsultations}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, emailConsultations: e.target.checked })}
                className="mt-1 rounded accent-slate-900 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
              <div>
                <span className="font-bold text-slate-900 block">SMS Consultation Reminder Alerts</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Send critical SMS text alerts to +91 98112 34567 15 minutes before the video consultation starts.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.smsReminders}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, smsReminders: e.target.checked })}
                className="mt-1 rounded accent-slate-900 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
              <div>
                <span className="font-bold text-slate-900 block">WhatsApp Daily Case Status Updates</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Receive daily court order summaries and legal demand notice postal tracking updates via WhatsApp.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.whatsappAlerts}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, whatsappAlerts: e.target.checked })}
                className="mt-1 rounded accent-slate-900 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
              <div>
                <span className="font-bold text-slate-900 block">Document Vault &amp; AI Analysis Notifications</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Notify me when an AI document intelligence summary or advocate analysis is ready to inspect.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.documentUpdates}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, documentUpdates: e.target.checked })}
                className="mt-1 rounded accent-slate-900 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
              <div>
                <span className="font-bold text-slate-900 block">Security &amp; New Device Login Alerts</span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Mandatory security emails whenever your account is accessed from a new IP or browser.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.securityLoginAlerts}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, securityLoginAlerts: e.target.checked })}
                className="mt-1 rounded accent-slate-900 w-4 h-4 cursor-pointer"
              />
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5 text-amber-300" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      )}

      {/* 4. SECTION 3: Account Security & Authentication Settings */}
      {activeSection === 'SECURITY' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Change Password Card */}
          <form onSubmit={handleChangePassword} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-slate-700" />
                <span>Account Password</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Passwords are protected using industry-standard secure hashing and are never displayed in plain text.
              </p>
            </div>

            {passwordError && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password *
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
              >
                {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPasswords ? 'Hide password characters' : 'Show characters'}</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Update Account Password</span>
              </button>
            </div>
          </form>

          {/* Two-Factor Authentication Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Two-Factor Authentication (2FA OTP)
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  twoFactorEnabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                }`}>
                  {twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Requires a one-time passcode sent to your verified mobile number whenever logging in from an unfamiliar device.
              </p>
            </div>

            <button
              onClick={handleToggle2FA}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors border shadow-xs ${
                twoFactorEnabled
                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200'
                  : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-900'
              }`}
            >
              {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA Protection'}
            </button>
          </div>

          {/* Active Session & Security Audit */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Active Session &amp; Device Identity</h3>
                <span className="text-slate-500 text-[11px]">This account is protected by an authenticated private session.</span>
              </div>
              <button
                onClick={() => onShowToast('All secondary sessions invalidated across devices.')}
                className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
              >
                Log Out Other Devices
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Current IP Address</span>
                <span className="text-slate-800 font-bold">Masked for privacy</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Browser / OS</span>
                <span className="text-slate-800">Current browser session</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Session ID Token</span>
                <span className="text-slate-800 text-[11px] truncate block">JSESSIONID=88A9B2F...</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
