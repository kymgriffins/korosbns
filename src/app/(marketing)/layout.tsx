import React from "react";
import { CleanSlateNav } from "@/components/clean-slate/nav";
import { CleanSlateFooter } from "@/components/clean-slate/footer";
import { getContactContent, getMarketingNavigation } from "@/data/marketing";

const MarketingLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigation = getMarketingNavigation();
  const contact = getContactContent();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CleanSlateNav items={navigation} />
      <main className="pt-16">{children}</main>
      <CleanSlateFooter
        items={navigation}
        email={contact.directContact.email}
        socials={contact.socials}
      />
    </div>
  );
};

export default MarketingLayout;
