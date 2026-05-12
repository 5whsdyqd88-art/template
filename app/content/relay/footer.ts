

export const consideringRelayHeading = "Considering Relay";

export const allProductsCta = "All products";

export const consideringRelayLink1 = "Product overview";
export const consideringRelayLink2 = "How Relay works";
export const consideringRelayLink3 = "Use cases";
export const consideringRelayLink4 = "Use cases overview";
export const consideringRelayLink5 = "Use cases by role";
export const consideringRelayLink6 = "Case studies";
export const consideringRelayLink7 = "Pricing";
export const consideringRelayLink8 = "FAQ";
export const consideringRelayLink9 = "Compare Relay";

export const productsAndFeaturesHeading = "Products and features";

export const allFeaturesCta = "All features";

export const productsAndFeaturesLink1 = "Workflow automation";
export const productsAndFeaturesLink2 = "AI assistant";
export const productsAndFeaturesLink3 = "Custom workflows";
export const productsAndFeaturesLink4 = "Integrations";
export const productsAndFeaturesLink5 = "Relay for teams";
export const productsAndFeaturesLink6 = "Relay for Enterprise";
export const productsAndFeaturesLink7 = "Mobile app";
export const productsAndFeaturesLink8 = "API";

export const useCasesHeading = "Use cases";

export const allUseCasesCta = "All use cases";

export const useCasesLink1 = "Customer support";
export const useCasesLink2 = "Sales and marketing";
export const useCasesLink3 = "Engineering";
export const useCasesLink4 = "HR and onboarding";
export const useCasesLink5 = "Finance and operations";
export const useCasesLink6 = "Custom processes";
export const useCasesLink7 = "Agent workflows";
export const useCasesLink8 = "Team collaboration";

export const developersHeading = "Developers";

export const allResourcesCta = "All resources";

export const developersLink1 = "Documentation";
export const developersLink2 = "API reference";
export const developersLink3 = "SDKs";
export const developersLink4 = "Community forums";
export const developersLink5 = "Partner directory";
export const developersLink6 = "Developer blog";
export const developersLink7 = "Status page";

export const careersLink = "Careers";
export const orgLink = "Organization";
export const pressLink = "Press";
export const investorLink = "Investors";
export const legalLink = "Legal";
export const privacyLink = "Privacy";
export const securityLink = "Security";
export const sitemapLink = "Sitemap";
export const llmsLink = "LLMs";

export const copyrightSlot = "Copyright © 2026 Relay Inc. All rights reserved.";

export const ccpaNoticeSlot =
  "California Consumer Privacy Act notice. Your personal information may be collected by Relay Inc. or its affiliates for business purposes. You have the right to request disclosure of the categories of personal information collected and the purposes for which it is used. Contact us for more information.";

export const footerContent = {
  brand: {
    logoAlt: "Relay",
  },
  columns: [
    {
      heading: consideringRelayHeading,
      viewAll: { text: allProductsCta, href: "#" },
      links: [
        { text: consideringRelayLink1, href: "#" },
        { text: consideringRelayLink2, href: "#" },
        { text: consideringRelayLink3, href: "#" },
        { text: consideringRelayLink4, href: "#" },
        { text: consideringRelayLink5, href: "#" },
        { text: consideringRelayLink6, href: "#" },
        { text: consideringRelayLink7, href: "#" },
        { text: consideringRelayLink8, href: "#" },
        { text: consideringRelayLink9, href: "#" },
      ],
    },
    {
      heading: productsAndFeaturesHeading,
      viewAll: { text: allFeaturesCta, href: "#" },
      links: [
        { text: productsAndFeaturesLink1, href: "#" },
        { text: productsAndFeaturesLink2, href: "#" },
        { text: productsAndFeaturesLink3, href: "#" },
        { text: productsAndFeaturesLink4, href: "#" },
        { text: productsAndFeaturesLink5, href: "#" },
        { text: productsAndFeaturesLink6, href: "#" },
        { text: productsAndFeaturesLink7, href: "#" },
        { text: productsAndFeaturesLink8, href: "#" },
      ],
    },
    {
      heading: useCasesHeading,
      viewAll: { text: allUseCasesCta, href: "#" },
      links: [
        { text: useCasesLink1, href: "#" },
        { text: useCasesLink2, href: "#" },
        { text: useCasesLink3, href: "#" },
        { text: useCasesLink4, href: "#" },
        { text: useCasesLink5, href: "#" },
        { text: useCasesLink6, href: "#" },
        { text: useCasesLink7, href: "#" },
        { text: useCasesLink8, href: "#" },
      ],
    },
    {
      heading: developersHeading,
      viewAll: { text: allResourcesCta, href: "#" },
      links: [
        { text: developersLink1, href: "#" },
        { text: developersLink2, href: "#" },
        { text: developersLink3, href: "#" },
        { text: developersLink4, href: "#" },
        { text: developersLink5, href: "#" },
        { text: developersLink6, href: "#" },
        { text: developersLink7, href: "#" },
      ],
    },
  ],
  brandMiscLinks: [
    { text: careersLink, href: "#" },
    { text: orgLink, href: "#" },
    { text: pressLink, href: "#" },
    { text: investorLink, href: "#" },
    { text: legalLink, href: "#" },
    { text: securityLink, href: "#" },
    { text: sitemapLink, href: "#" },
    { text: llmsLink, href: "#" },
  ],
  bottomBar: {
    copyright: copyrightSlot,
    ccpaNotice: ccpaNoticeSlot,
  },
} as const;
