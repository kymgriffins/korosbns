import { useMutation } from "@tanstack/react-query";
import { citizenApi } from "@/lib/api-client";
import type { AuthLoginResponse, AuthRegisterResponse } from "@/lib/api-client";

export function useRegister() {
  return useMutation({
    mutationFn: (body: {
      email: string;
      password: string;
      first_name?: string;
      last_name?: string;
    }) => citizenApi.register(body),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      citizenApi.login(email, password),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => citizenApi.verifyEmail(token),
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => citizenApi.requestPasswordReset(email),
  });
}

export function useConfirmPasswordReset() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      citizenApi.confirmPasswordReset(token, password),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => citizenApi.changePassword(currentPassword, newPassword),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => citizenApi.resendVerification(email),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => citizenApi.logout(),
  });
}
