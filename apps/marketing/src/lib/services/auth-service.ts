import { citizenApi } from "@/lib/api-client";

export function registerUser(body: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}) {
  return citizenApi.register(body);
}

export function verifyEmail(token: string) {
  return citizenApi.verifyEmail(token);
}

export function loginUser(email: string, password: string) {
  return citizenApi.login(email, password);
}

export function logoutUser() {
  return citizenApi.logout();
}

export function requestPasswordReset(email: string) {
  return citizenApi.requestPasswordReset(email);
}

export function confirmPasswordReset(token: string, password: string) {
  return citizenApi.confirmPasswordReset(token, password);
}

export function changePassword(currentPassword: string, newPassword: string) {
  return citizenApi.changePassword(currentPassword, newPassword);
}

export function resendVerification(email: string) {
  return citizenApi.resendVerification(email);
}
