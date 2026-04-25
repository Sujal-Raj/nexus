// /hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";

export const useLogin = () =>
  useMutation({
    mutationFn: (data: any) => api.post("/api/auth/login", data),
  });

export const useRegister = () =>
  useMutation({
    mutationFn: (data: any) => api.post("/api/auth/register", data),
  });

export const useVerifyOTP = () =>
  useMutation({
    mutationFn: (data: any) => api.post("/api/auth/verify", data),
  });