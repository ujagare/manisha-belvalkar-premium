"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";
import { useGSAP } from "@gsap/react";

// Register the plugins used across the site once, at module scope.
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, TextPlugin, useGSAP);

export { gsap, ScrollTrigger, ScrollToPlugin, SplitText, TextPlugin, useGSAP };
