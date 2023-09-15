import { SplitRumAgent, webVitals, routeChanges } from "@splitsoftware/browser-rum-agent";

SplitRumAgent.setup(process.env.NEXT_PUBLIC_SPLIT_CLIENT_SIDE_SDK_KEY);

// Collect all web-vitals
SplitRumAgent.register(webVitals());

// Collect only route changes that are not fragment changes
SplitRumAgent.register(routeChanges({
  filter: (routeChange) => {
    return routeChange.fromUrl.split('#')[0] !== routeChange.toUrl.split('#')[0];
  }
}));
