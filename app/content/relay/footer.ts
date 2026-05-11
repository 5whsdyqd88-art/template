

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
      viewAllCta: allProductsCta,
      links: [
        consideringRelayLink1,
        consideringRelayLink2,
        consideringRelayLink3,
        consideringRelayLink4,
        consideringRelayLink5,
        consideringRelayLink6,
        consideringRelayLink7,
        consideringRelayLink8,
        consideringRelayLink9,
      ],
    },
    {
      heading: productsAndFeaturesHeading,
      viewAllCta: allFeaturesCta,
      links: [
        productsAndFeaturesLink1,
        productsAndFeaturesLink2,
        productsAndFeaturesLink3,
        productsAndFeaturesLink4,
        productsAndFeaturesLink5,
        productsAndFeaturesLink6,
        productsAndFeaturesLink7,
        productsAndFeaturesLink8,
      ],
    },
    {
      heading: useCasesHeading,
      viewAllCta: allUseCasesCta,
      links: [
        useCasesLink1,
        useCasesLink2,
        useCasesLink3,
        useCasesLink4,
        useCasesLink5,
        useCasesLink6,
        useCasesLink7,
        useCasesLink8,
      ],
    },
    {
      heading: developersHeading,
      viewAllCta: allResourcesCta,
      links: [
        developersLink1,
        developersLink2,
        developersLink3,
        developersLink4,
        developersLink5,
        developersLink6,
        developersLink7,
      ],
    },
  ],
  brandMiscLinks: {
    careers: careersLink,
    org: orgLink,
    press: pressLink,
    investor: investorLink,
    legal: legalLink,
    privacy: privacyLink,
    security: securityLink,
    sitemap: sitemapLink,
    llms: llmsLink,
  },
  bottomBar: {
    copyright: copyrightSlot,
    ccpaNotice: ccpaNoticeSlot,
  },
} as const;
