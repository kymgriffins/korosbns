import { siGoogle } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { buildApiUrl } from "@/lib/api-url";
import { cn } from "@/lib/utils";

export function GoogleButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="secondary" className={cn(className)} {...props} asChild>
      <a href={buildApiUrl("/auth/social/login/google/")}>
        <SimpleIcon icon={siGoogle} className="size-4" />
        Continue with Google
      </a>
    </Button>
  );
}
