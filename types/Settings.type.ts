export interface Profile {
  full_name: string;
  email: string;
  phone_number: string;
  avatar_url: string;
  role: string;
}

export interface ProfileResponse {
  success: boolean;
  profile: Profile;
}

export interface ProfileUpdatePayload {
  full_name?: string;
  email?: string;
  phone_number?: string;
  avatar?: File;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  profile: Profile;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}