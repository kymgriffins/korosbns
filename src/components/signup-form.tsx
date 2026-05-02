import { cn } from "@/utils/index"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface SignupFormProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
  form?: {
    email: string;
    password?: string;
    first_name: string;
    last_name: string;
    org_name: string;
    org_slug: string;
  };
  setField?: (key: any, value: string) => void;
  loading?: boolean;
  error?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function SignupForm({
  className,
  form,
  setField,
  loading,
  error,
  onSubmit,
  ...props
}: SignupFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your admin account</CardTitle>
          <CardDescription>
            Enter your details below to create your organization account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={form?.email}
                  onChange={(e) => setField?.("email", e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={form?.password}
                  onChange={(e) => setField?.("password", e.target.value)}
                  required
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="John"
                    value={form?.first_name}
                    onChange={(e) => setField?.("first_name", e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
                  <Input
                    id="last_name"
                    type="text"
                    placeholder="Doe"
                    value={form?.last_name}
                    onChange={(e) => setField?.("last_name", e.target.value)}
                    required
                  />
                </Field>
              </div>
              {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/admin/login" className="underline underline-offset-4">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-xs">
        By clicking continue, you agree to our <a href="#" className="underline underline-offset-4">Terms of Service</a>{" "}
        and <a href="#" className="underline underline-offset-4">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
