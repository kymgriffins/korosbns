import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/index";
import Image from "next/image";

interface LoginFormProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
  email?: string;
  setEmail?: (value: string) => void;
  password?: string;
  setPassword?: (value: string) => void;
  loading?: boolean;
  error?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function LoginForm({
  className,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  error,
  onSubmit,
  ...props
}: LoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Image
                  src="/logo.svg"
                  alt="BNS logo"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
              </div>
              <span className="sr-only">BNS Admin Portal</span>
            </a>
            <h1 className="text-xl font-bold">Sign in to BNS</h1>
            <FieldDescription>
              Don&apos;t have an admin account?{" "}
              <a href="/admin/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail?.(e.target.value)}
              required
            />
          </Field>
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <a
                href="#"
                className="text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword?.(e.target.value)}
              required
            />
          </Field>
          {error && (
            <p className="text-sm font-medium text-destructive text-center">
              {error}
            </p>
          )}
          <Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center text-xs">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
