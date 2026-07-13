import SettingsList from "./SettingsList";
import { getProfileAction } from "@/actions/settings.action";

export default async function SettingsPage() {
  const res = await getProfileAction();
  const profile = res.success ? res.data.profile : null;
  const errorMessage = !res.success ? res.message : undefined;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Settings</h1>
        <p className="text-text-muted">
          Manage your account settings and preferences
        </p>
      </div>

      <SettingsList profile={profile} errorMessage={errorMessage} />
    </div>
  );
}
