import type { Project } from "./types";

const A = "/assets";

export const projects: Project[] = [
  {
    slug: "voyage-theater-company",
    title: "Voyage Theater Company",
    tagline: "Building a scalable digital stage for diverse voices.",
    categories: ["Product Design", "Contract"],
    thumb: {
      type: "video",
      poster: `${A}/vtc-portfolio-poster-0000000.jpg`,
      mp4: `${A}/vtc-portfolio-mp4.mp4`,
      webm: `${A}/vtc-portfolio-webm.webm`,
    },
    hero: {
      headline: "Building a scalable digital stage for diverse voices.",
      media: {
        type: "video",
        poster: `${A}/vtc-portfolio-poster-0000000.jpg`,
        mp4: `${A}/vtc-portfolio-mp4.mp4`,
        webm: `${A}/vtc-portfolio-webm.webm`,
      },
    },
    overview: {
      html: 'To modernize a decade-old digital presence and eliminate technical fragility, I led the transformation of <a href="https://voyagetheatercompany.org/" target="_blank" rel="noopener noreferrer">Voyage Theater Company</a>&rsquo;s &ldquo;messy patchwork&rdquo; WordPress site into a professional digital stage.',
      impact:
        "Replaced a decade-old WordPress build with a templated CMS and trained the staff to run it, so a small non-technical team can update the site without breaking it.",
    },
    meta: [
      { label: "Duration", value: "Oct 2025 – Feb 2026" },
      { label: "My Role", value: "Product Designer\nContract" },
      {
        label: "Team",
        value:
          "Wayne Maugans, Founding Artistic Director\nKathleen Salazar, Associate Artistic Director\nCharles C. Bales, Founding Executive Director",
      },
    ],
    blocks: [
      { kind: "section", label: "A Fragile Patchwork" },
      {
        kind: "quote",
        text: "Every time we make updates, something crashes or goes awry.",
      },
      {
        kind: "text",
        html: "After meeting with stakeholders, I found that non-artistic directors struggle to manage content, feeling <strong>constrained by the design system</strong> and often breaking things when they try to update it. The old site was not optimized for VTC&rsquo;s mission. How might we create a site that empowers the current staff?",
      },
      {
        kind: "media",
        media: { type: "image", src: `${A}/desktop-1.png`, alt: "The previous Voyage Theater Company website" },
      },

      {
        kind: "section",
        label: "Rebuilding The Architecture",
        heading: "A Comprehensive Redesign Spanning From Branding To Technical Migration.",
      },
      {
        kind: "text",
        html: "Instead of patching a messy web of broken links, I rebuilt Voyage Theater Company&rsquo;s site architecture into a <strong>clear, scalable system</strong>. With improved structure, branding guidelines, and CMS training, the team <strong>can now confidently update content</strong> and grow their digital presence without breaking the site.",
      },
      {
        kind: "media",
        media: {
          type: "video",
          poster: `${A}/current-season-poster-0000000.jpg`,
          mp4: `${A}/current-season-mp4.mp4`,
          webm: `${A}/current-season-webm.webm`,
        },
      },
      {
        kind: "beforeAfter",
        before: { type: "image", src: `${A}/screenshot-2026-04-23-at-11-25-01-pm-1.png`, alt: "Before" },
        after: { type: "image", src: `${A}/screenshot-2026-04-23-at-11-25-40-pm-1.png`, alt: "After" },
      },
      {
        kind: "beforeAfter",
        before: { type: "image", src: `${A}/desktop-3.png`, alt: "Before" },
        after: {
          type: "video",
          poster: `${A}/screen-recording-2026-04-23-at-10-41-11-pm-poster-0000000.jpg`,
          mp4: `${A}/screen-recording-2026-04-23-at-10-41-11-pm-mp4.mp4`,
          webm: `${A}/screen-recording-2026-04-23-at-10-41-11-pm-webm.webm`,
        },
      },

      {
        kind: "section",
        label: "Content Ownership",
        heading: "Empowering Non-Technical Content Ownership",
      },
      {
        kind: "text",
        html: "In nonprofit theater, operational independence is everything. I redesigned the site to <strong>empower a small, non-technical team</strong> to manage their own content without breaking the design system, giving VTC a digital presence built to last beyond launch. To reinforce long-term success, I introduced a templated CMS architecture paired with hands-on training, transforming a once fragile, developer-dependent website into a <strong>maintainable, brand-consistent</strong> platform.",
      },

      {
        kind: "tabs",
        items: [
          {
            label: "Branding & Logo",
            cols: 2,
            media: [
              { type: "image", src: `${A}/screenshot-2026-02-13-at-1-38-38-pm-1-1-1.png`, alt: "Brand exploration" },
              { type: "image", src: `${A}/screenshot-2026-02-13-at-1-37-49-pm-1-1.png`, alt: "Logo system" },
            ],
          },
          {
            label: "Live Site",
            media: [{ type: "image", src: `${A}/frame-8-9.png`, alt: "Live site" }],
          },
          {
            label: "CMS & Site Training",
            media: [
              { type: "image", src: `${A}/screenshot-2026-02-13-at-12-47-40-pm-1.png`, alt: "CMS training materials" },
            ],
          },
        ],
      },

      { kind: "section", label: "Reflection" },
      {
        kind: "cards",
        items: [
          {
            title: "Managing Up",
            body: "Made sure that all stakeholders are aligned with meeting dates, expectations, and tasks.",
          },
          {
            title: "Operational Autonomy",
            body: "Unified page architecture ensures brand consistency and reduces future maintenance friction.",
          },
          {
            title: "Contracting 101",
            body: "Understanding setting rates, scope management, and professional offboarding.",
          },
        ],
      },
    ],
  },

  {
    slug: "the-washington-post",
    title: "The Washington Post",
    tagline:
      "Designed scalable solutions for the Content Experience, Monetization and Subscriptions, and Central Design Teams.",
    categories: ["Product Design", "Internship"],
    thumb: { type: "image", src: `${A}/frame-2-6.png`, alt: "The Washington Post Live Activity" },
    hero: {
      headline: "Designing an AI-powered Live Activity Feed",
      media: { type: "image", src: `${A}/group-1-1.png`, alt: "Live Activity concept" },
      panel: true,
      hideTagline: true,
    },
    overview: {
      html: "To elevate real-time mobile engagement, The Washington Post&rsquo;s Content XP team set out to integrate iOS Live Activities with its Live Update Feed (LUFs). Our goal was to design a scalable, AI-powered experience that delivers glanceable news updates directly on the lock screen, boosting engagement and shaping reader habit.",
      impact:
        "Approved for a Q1 2026 launch and added to the roadmap, with projected gains of 17% to 25% opt-ins, 3+ average views per user, and 60-second sessions.",
    },
    meta: [
      { label: "Duration", value: "July – August 2025 (1 month)" },
      { label: "My Role", value: "Product Design Intern" },
      {
        label: "Team",
        value: "1 Engineer\n2 Design Leads\n1 PM\n1 PM Intern",
      },
      { label: "Tools", value: "Figma, FigJam, Google Docs, Zeppelin" },
    ],
    blocks: [
      {
        kind: "section",
        label: "Notification Fatigue",
        heading: "Mobile Users Receive Repetitive Push Notifications And Quickly Disengage.",
      },
      {
        kind: "text",
        html: "Existing Live Activity Feeds (LUFs) attracted high traffic (55.1M pageviews H1 2025), yet 39% came from anonymous users who rarely registered or subscribed. Knowing this context:",
      },
      {
        kind: "callout",
        html: "How might we make breaking coverage glanceable and valuable enough to drive repeat visits without overwhelming users?",
      },
      { kind: "heading", text: "Current LUF layout" },
      {
        kind: "text",
        html: "With the Live Activity Feeds (LUFs), contributors are not limited to traditional article formatting, allowing for quick posts designed as cards that readers can follow. To understand how to design the iOS Live Activity, I needed to understand LUFs&rsquo; anatomy.",
      },
      {
        kind: "media",
        media: { type: "image", src: `${A}/luf2.avif`, alt: "LUF layout anatomy" },
        size: "sm",
      },

      {
        kind: "section",
        label: "Understanding Reader Habits",
        heading: "Understanding How A User Interacts With A Notification.",
      },
      {
        kind: "text",
        html: "I spoke with designers, engineers, and editors across The Washington Post&rsquo;s Content XP team to understand the existing LUF experience and the challenges of mobile engagement. Through these discussions, we uncovered several key insights that shaped our design direction:",
      },
      {
        kind: "cards",
        items: [
          {
            title: "Engagement drops after the first alert.",
            body: "Users often open one push notification but rarely return to check for updates, signaling low sustained attention.",
          },
          {
            title: "Notification fatigue is common.",
            body: "Too many alerts during live events cause users to mute or disable notifications entirely, decreasing engagement.",
          },
          {
            title: "Users crave quick context without refreshing.",
            body: "They want to understand what's happening at a glance without unlocking their phone or scrolling through feeds.",
          },
        ],
      },

      {
        kind: "section",
        label: "Anatomy Of A Feed",
        heading: "Understanding LUF's Anatomy",
      },
      {
        kind: "text",
        html: "I <strong>dissected existing LUF structure</strong>: dynamic headlines, dynamic descriptions, contributor credits, reporter insights, article excerpts, and quick posts to understand the content I was designing for. I also <strong>defined LUF categories</strong> to further break down which type of news would work with a live activity template in addition to how users would interact with different LUF live activities.",
      },
      {
        kind: "grid",
        cols: 2,
        media: [
          { type: "image", src: `${A}/luf-structure.png`, alt: "LUF structure" },
          { type: "image", src: `${A}/table-1.png`, alt: "LUF categories table" },
        ],
      },
      { kind: "heading", text: "Learning from The 2024 Election Live Activity" },
      {
        kind: "text",
        html: "<strong>The 2024 Election prototype served as the baseline for my design.</strong> Though it generated high engagement (26% click-through), it did require heavy manual tagging by journalists. Since the process was not scalable, I worked alongside the PM intern to integrate an LLM-based classifier to automate surfacing urgent, high-salience posts to reduce noise. <strong>My design needed to be adaptable</strong> and act as a sort of template for different formats and combinations of quantitative and qualitative data.",
      },
      { kind: "media", media: { type: "image", src: `${A}/group-692.png`, alt: "2024 Election Live Activity" } },
      { kind: "heading", text: "iOS Live Activity Requirements" },
      {
        kind: "text",
        html: "The iOS Live Activity requirements were an added constraint throughout my design process. <strong>Designing for such a small screen</strong> with areas where UI would not show or would be rejected during the final Apple approval process gave me a <strong>unique challenge to solve.</strong>",
      },
      {
        kind: "media",
        media: { type: "image", src: `${A}/screenshot-2025-10-21-at-11-14-49-pm.png`, alt: "iOS Live Activity specs" },
        size: "md",
      },

      {
        kind: "section",
        label: "Designing Within iOS Limits",
        heading: "Designing Within iOS Limits",
      },
      { kind: "heading", text: "Early Sketches" },
      {
        kind: "text",
        html: "My early concepts primarily focused on exploring how much information could fit in the compact format and the variety of data, taking note of constraints with the display as well as the 8 hour limit that a live activity appears on the user&rsquo;s screen.",
      },
      {
        kind: "grid",
        cols: 2,
        size: "md",
        media: [
          { type: "image", src: `${A}/2025-10-21-23-27-page-3-1-1.png`, alt: "Early sketches" },
          { type: "image", src: `${A}/2025-10-21-23-27-page-1-1.png`, alt: "Early sketches" },
        ],
      },
      { kind: "heading", text: "V1 Designs" },
      {
        kind: "text",
        html: "For my initial design, I focused on exploring different ways to display the live update title, time stamps, and pieces of content while utilizing the Post&rsquo;s components in the existing Figma libraries. I learned to rapidly prototype new iterations to better prioritize visual hierarchy at this conceptual design stage. The Hurricane Ian story served as the example use case to populate content.",
      },
      {
        kind: "grid",
        cols: 2,
        size: "md",
        media: [
          { type: "image", src: `${A}/live-activity-lock-screen.png`, alt: "V1 lock screen" },
          { type: "image", src: `${A}/live-activity-compact-3.png`, alt: "V1 compact" },
        ],
      },
      { kind: "heading", text: "Design Feedback" },
      {
        kind: "text",
        html: "After feedback from product and design leadership, I implemented the following changes: <strong>Optimized scalability:</strong> created a flexible component system that could accommodate event-specific visuals (e.g., cultural vs. political coverage) while maintaining consistency. <strong>Defined interaction model:</strong> clarified transitions from lock screen to app view using timestamped anchors and subtle motion cues.",
      },
      {
        kind: "grid",
        cols: 2,
        size: "md",
        media: [
          { type: "image", src: `${A}/live-activity-lock-screen-3.png`, alt: "Revised lock screen" },
          { type: "image", src: `${A}/live-activity-compact-5.png`, alt: "Revised compact" },
        ],
      },
      { kind: "heading", text: "Designing for Technical Constraints" },
      {
        kind: "text",
        html: "Collaboration with the iOS engineering team that worked on the elections live activities revealed technical limitations in Live Activity height, interactivity, and refresh rates. To maintain performance and compliance, I established modular zones for the headline, timestamp, and update source that scale within iOS boundaries. These insights also informed future LUF integrations, ensuring visual adaptability across compact and expanded states.",
      },
      {
        kind: "grid",
        cols: 2,
        size: "md",
        media: [
          { type: "image", src: `${A}/live-activity-lock-screen-1.png`, alt: "Modular zones, lock screen" },
          { type: "image", src: `${A}/live-activity-compact-4.png`, alt: "Modular zones, compact" },
        ],
      },

      {
        kind: "section",
        label: "Flexible Templates",
        heading: "Creating Flexible Templates For Diverse Storytelling",
      },
      {
        kind: "text",
        html: "To support The Post&rsquo;s diverse storytelling, I built a <strong>template design system</strong> that balanced scalability with creative freedom. Each template could adapt to event type (breaking, ongoing, or scheduled) and editorial tone while leaving space for visual experimentation by graphic artists. This framework ensures consistent brand presence across all Live Activities while allowing for event-specific customization.",
      },
      {
        kind: "media",
        media: { type: "image", src: `${A}/screenshot-2025-11-06-at-6-06-12-pm.png`, alt: "Template system" },
      },
      { kind: "heading", text: "Motion Interactions" },
      {
        kind: "text",
        html: "I learned how to prototype smooth motion interactions by making my own local components for transitional states within the live activity. These animations would allow users to better understand when content has been updated in real time, helping them maintain context within their experience.",
      },
      {
        kind: "media",
        media: { type: "image", src: `${A}/screenshot-2025-11-06-at-6-54-58-pm.png`, alt: "Motion prototype" },
      },

      {
        kind: "section",
        label: "Final Prototype",
        heading: "Final Prototype",
      },
      {
        kind: "media",
        // Portrait phone capture — even at 560px wide it runs over 1100px tall.
        size: "sm",
        media: {
          type: "video",
          poster: `${A}/screen-recording-2025-11-06-at-72619-pm-poster-00001.jpg`,
          mp4: `${A}/screen-recording-2025-11-06-at-72619-pm-transcode.mp4`,
          webm: `${A}/screen-recording-2025-11-06-at-72619-pm-transcode.webm`,
        },
      },

      {
        kind: "section",
        label: "Results & Learnings",
        heading: "Results And Learnings",
      },
      {
        kind: "text",
        html: "I presented the <strong>Live Activity Feed</strong> prototype to <strong>Content XP leadership</strong>, alongside other newsroom and product teams exploring engagement-driven solutions.",
      },
      {
        kind: "cards",
        items: [
          {
            title: "Executive feedback",
            body: "Praised for scalability, technical feasibility, and editorial alignment — automating newsroom tagging without compromising journalistic integrity.",
          },
          {
            title: "Organizational Impact",
            body: "Approved for a Q1 2026 launch and added to the roadmap, with projected opt-ins rising from 17% to 25%.",
          },
        ],
      },
      {
        kind: "text",
        html: "This was my third project at The Post, and it challenged me to move beyond execution and think like a product strategist. My key takeaways:",
      },
      {
        kind: "cards",
        items: [
          {
            title: "Collaborate early with engineering",
            body: "I partner with engineers early to turn technical constraints into innovative, feasible designs.",
          },
          {
            title: "Embrace iteration and feedback loops",
            body: "I use constant feedback to align my work with user needs and product goals.",
          },
          {
            title: "Go beyond the MVP",
            body: "I design scalable frameworks and flexible templates that ensure products can grow well past their initial launch.",
          },
        ],
      },
    ],
  },

  {
    slug: "graditude",
    title: "Graditude",
    tagline:
      "Designing a centralized dashboard that allows admins to understand their mentorship programs.",
    categories: ["Product Design", "Internship"],
    thumb: { type: "image", src: `${A}/frame-1-2.png`, alt: "Graditude dashboard" },
    accent: "grad",
    hero: {
      headline: "Help students develop impactful career mentorship relationships.",
      media: {
        type: "image",
        src: `${A}/program-dashboard-create-program-1-1.avif`,
        alt: "Graditude program dashboard",
      },
    },
    overview: {
      html: "Graditude is a nonprofit platform connecting students with alumni for career mentorship, in partnership with campus organizations.",
      impact:
        "Delivered a stakeholder presentation that handed my designs to the project's developer, setting the team up for implementation.",
    },
    meta: [
      { label: "Duration", value: "Fall 2024 (Internship)" },
      {
        label: "My Role",
        value: "UX Designer\nLed 3 junior designers",
      },
      {
        label: "Team",
        value: "1 CEO\n1 Design Lead\n1 Developer\n3 Junior Designers",
      },
      { label: "Tools", value: "Figma, FigJam, Google Docs" },
    ],
    blocks: [
      {
        kind: "cards",
        items: [
          {
            title: "Problem — Graditude's admins need more support.",
            body: "Admins struggle to effectively manage mentorship programs due to limited visibility into participant engagement, which leads to poor outcomes and discouraging program launches.",
          },
          {
            title: "Solution — A centralized dashboard that allows admins to view and understand their programs.",
            body: "Admins now have a central dashboard to track member engagement and intervene as needed throughout the mentorship lifecycle, with early priorities focused on Recruiting, Matching, and Solidifying.",
          },
          {
            title: "Outcome — Successful stakeholder presentation and dev handoff",
            body: "During the last days of my internship, I delivered a stakeholder presentation that communicated my solutions to the dev of the project, setting the team up for implementation.",
          },
        ],
      },

      { kind: "heading", text: "Project Process" },
      { kind: "media", media: { type: "image", src: `${A}/design-process-2.webp`, alt: "Design process" } },

      {
        kind: "section",
        label: "Understanding Admin Needs",
        heading: "Understanding Admin Needs",
      },
      { kind: "heading", text: "Stakeholder Interview and Past Documentation" },
      {
        kind: "text",
        html: "I talked to the CEO, Steven, to truly understand the business needs and admins&rsquo; needs to improve program success, ultimately supporting Graditude&rsquo;s overall operations. The following were his intentions for the dashboard, as well as insights taken from interview transcripts from people interested in being a program admin.",
      },
      {
        kind: "cards",
        items: [
          {
            title: "See who signs up, and invite different types of members if needed.",
            icon: `${A}/group-search-24dp-434343-fill0-wght400-grad0-opsz24.svg`,
          },
          {
            title: "Spot which matches engage, and nudge the matches that don't.",
            icon: `${A}/app-registration-24dp-434343-fill0-wght400-grad0-opsz24.svg`,
          },
          {
            title: "Track match progress and follow up on stalled matches.",
            icon: `${A}/progress-activity-24dp-434343-fill0-wght400-grad0-opsz24.svg`,
          },
          {
            title: "View updated program goals and follow up on stagnant relationships.",
            icon: `${A}/add-alert-24dp-434343-fill0-wght400-grad0-opsz24.svg`,
          },
        ],
      },
      { kind: "heading", text: "User Journey" },
      {
        kind: "text",
        html: "After <strong>consolidating</strong> existing documentation and <strong>defining</strong> our approach, I created a detailed user journey for our example admin, &ldquo;Carol.&rdquo; This journey illustrated Carol&rsquo;s workflow, challenges, and decision points, helping stakeholders visualize her needs and guiding the design of dashboard features to support her actions effectively.",
      },
      {
        kind: "media",
        media: { type: "image", src: `${A}/revised-user-journey-map-2.avif`, alt: "User journey map" },
      },

      {
        kind: "section",
        label: "Defining The Scope",
        heading: "Defining The Scope",
      },
      { kind: "heading", text: "User Persona" },
      {
        kind: "text",
        html: "Based on our business goals and existing admin interview transcripts, we created a focused user persona: Carol Thompson, a mentorship program coordinator, who struggles to track mentor–mentee engagement and know when to intervene. The Admin Dashboard solves this by giving her <strong>real-time visibility</strong> into match activity and progress toward goals, enabling <strong>quick, targeted actions</strong> that keep programs on track and deliver stronger outcomes.",
      },
      { kind: "media", media: { type: "image", src: `${A}/basic-information-1.avif`, alt: "User persona" } },
      { kind: "heading", text: "User Flow" },
      {
        kind: "text",
        html: "Our &ldquo;Nudge&rdquo; flow allows admins to quickly identify low-engagement or underperforming mentor–mentee matches from the Admin Dashboard, select them, and send targeted notifications. By <strong>streamlining the process</strong> into just a few steps, admins can efficiently re-engage pairs before progress stalls, which ensures that mentorship programs stay active and productive.",
      },
      { kind: "media", media: { type: "image", src: `${A}/frame-28.avif`, alt: "Nudge user flow" } },
      { kind: "heading", text: "Defining Roles" },
      {
        kind: "text",
        html: "To further define our scope and ensure that our plan was a comprehensive solution for Graditude&rsquo;s mission of providing admins with the tools they need to manage mentee/mentor matches, <strong>I took ownership</strong> over the main dashboard, inviting new members flow, creating new programs flow, and making sure that we had clear action items before and after our weekly meetings.",
      },

      {
        kind: "section",
        label: "Sketching & Testing",
        heading: "Sketching And Testing",
      },
      { kind: "heading", text: "Sketching and Wireframes" },
      {
        kind: "text",
        html: "I hosted a fast sketching exercise just to get an idea of the core functionality of the dashboard and foster creativity in our approach when designing for low to high fidelity. Our primary goal was to allow the admin to:",
      },
      {
        kind: "list",
        items: [
          "View mentor and mentee analytics",
          "Track engagement",
          "Nudge and/or set reminders",
          "Invite prospective members",
          "Create matches",
        ],
      },
      {
        kind: "media",
        media: { type: "image", src: `${A}/frame-427318937-3.avif`, alt: "Sketching exercise" },
      },
      {
        kind: "grid",
        cols: 3,
        media: [
          { type: "image", src: `${A}/frame-427318947.avif`, alt: "Wireframe" },
          { type: "image", src: `${A}/frame-427318938.avif`, alt: "Wireframe" },
          { type: "image", src: `${A}/frame-427318941.avif`, alt: "Wireframe" },
          { type: "image", src: `${A}/frame-427318942.avif`, alt: "Wireframe" },
          { type: "image", src: `${A}/frame-427318946.avif`, alt: "Wireframe" },
          { type: "image", src: `${A}/frame-427318944.avif`, alt: "Wireframe" },
        ],
      },

      { kind: "heading", text: "Main Dashboard" },
      {
        kind: "text",
        html: "After we presented our low-fidelity wireframes to the CEO, we designed for gaps in our designs, including:",
      },
      { kind: "heading", text: "Navigation" },
      {
        kind: "text",
        html: "<strong>Enhancing the side nav bar</strong> to include not only members and mentors, but also giving admins access to programs.",
      },
      { kind: "media", media: { type: "image", src: `${A}/frame-427318949-3.avif`, alt: "Navigation design" } },
      { kind: "heading", text: "Data Display" },
      {
        kind: "text",
        html: "<strong>Including more positive metrics</strong> such as total numbers, active participation rates, and overall satisfaction instead of purely negative such as # of inactive members.",
      },
      { kind: "media", media: { type: "image", src: `${A}/frame-427318951-1.avif`, alt: "Data display design" } },
      { kind: "heading", text: "Feature Consolidation" },
      {
        kind: "text",
        html: "<strong>Consolidating features</strong> such as analytics and managing invites on one page to enable quicker decision-making for admins.",
      },
      {
        kind: "media",
        media: { type: "image", src: `${A}/frame-427318953-2.avif`, alt: "Feature consolidation" },
      },
      { kind: "heading", text: "Usability Testing" },
      { kind: "media", media: { type: "image", src: `${A}/frame-427318960.png`, alt: "Usability testing" } },
      {
        kind: "text",
        html: "My team and I conducted a usability test with our high fidelity design, where we found that we needed to:",
      },
      {
        kind: "list",
        items: [
          "Clarify labels and metric definitions throughout the dashboard.",
          "Replace IDs with names or profile photos for better context.",
          "Reconsider navigation and terminology for Matches/Notifications.",
          "Provide shortcuts or direct paths for program creation and related actions.",
        ],
      },

      {
        kind: "section",
        label: "The Dashboard",
        heading: "Giving Admins Clarity",
      },
      {
        kind: "text",
        html: "Through my dashboard design, admins can now create new programs, engage with their programs&rsquo; members, and view selected statistics to keep track of their programs&rsquo; progress.",
      },
      {
        kind: "grid",
        cols: 2,
        media: [
          { type: "image", src: `${A}/frame-427318957.png`, alt: "Final dashboard" },
          { type: "image", src: `${A}/frame-427318955.png`, alt: "Final dashboard" },
          { type: "image", src: `${A}/frame-427318954.png`, alt: "Final dashboard" },
          { type: "image", src: `${A}/frame-427318958.png`, alt: "Final dashboard" },
        ],
      },
      { kind: "heading", text: "Final Prototype" },
      {
        kind: "media",
        media: {
          type: "video",
          poster: `${A}/video-mp4-996x716-poster-00001.jpg`,
          mp4: `${A}/video-mp4-996x716-transcode.mp4`,
          webm: `${A}/video-mp4-996x716-transcode.webm`,
        },
      },

      { kind: "section", label: "Reflection" },
      {
        kind: "cards",
        items: [
          {
            title: "Stakeholders and User POVs",
            body: "For a design to be successful, I needed to balance what the CEO wanted, past user research, and usability test results. What helped me the most was sorting stakeholder/business and users' needs and connecting them based on pain points and objectives of the tool.",
          },
          {
            title: "Consistency and Organization",
            body: "Since this was a remote internship across multiple time zones, organization was key to the project's success. By managing action items, coordinating meetings, and updating the CEO weekly, I kept my team productive despite being 2000+ miles apart!",
          },
          {
            title: "Designing for an Internal Tool",
            body: "Having only worked on consumer-facing products, designing for admins was a refreshing new challenge. This project really pushed me to draw on my own club leadership and internal tool experience to better empathize with admins' unique needs.",
          },
        ],
      },
      {
        kind: "media",
        media: { type: "image", src: `${A}/frame-427318953-3.png`, alt: "Reflection" },
      },
      {
        kind: "text",
        html: "In the future I&rsquo;d want to include more features that would provide admins with the personalization they need to really cater to their specific program, such as options for different views (tiled, lists) or even options to customize their dashboard through dynamic cards. I&rsquo;m so glad that I got to design for data, and this really sparked my interest in designing for admin-facing tools!",
      },
    ],
  },

  {
    slug: "silicon",
    title: "Si: Silicon",
    tagline:
      "A 64-page informational coffee table book about the element hiding inside everything.",
    categories: ["Editorial Design", "Personal Project"],
    // TODO: replace the pending slots below once the exports land. Each note
    // names the file it is waiting for.
    thumb: {
      type: "slideshow",
      interval: 1000,
      items: [
        { src: `${A}/silicon-spread-silicates.jpg`, alt: "A spread from Si: Silicon on silicate minerals, topographic vectors beside a mineral thin-section photograph" },
        { src: `${A}/silicon-spread-terminology.jpg`, alt: "A spread from Si: Silicon distinguishing silicon, silica, silicate, and silicone" },
        { src: `${A}/silicon-spread-society.jpg`, alt: "A spread from Si: Silicon on AI and surveillance, object-detection labels over a street scene" },
      ],
    },
    hero: {
      headline: "Sixty-four pages on the element hiding inside everything.",
      panel: true,
      media: {
        type: "image",
        src: `${A}/silicon-cover.jpg`,
        alt: "The printed cover of Si: Silicon, styled as the element's periodic table cell",
      },
    },
    overview: {
      html: "Silicon is the second most abundant element in the Earth&rsquo;s crust and almost none of it is ever seen: it is the sand on a beach, the glass in a window, the lens in an eye implant, and the chip inside the phone this is being read on. Over one semester I researched, wrote, designed, and produced <strong>Si: Silicon</strong> &mdash; a <strong>64-page informational coffee table book</strong> that follows the element from geology to geopolitics, built around an <strong>icon system that doubles as the book&rsquo;s navigation</strong>.",
      impact:
        "A finished, printed 64-page book made solo in 2.5 months — 50 spreads across five parts, an original icon set rendered in 3D for every chapter opener, and topographic line work generated from real elevation data in QGIS.",
    },
    meta: [
      { label: "Duration", value: "October – December 2025\nOne semester (~2.5 months)" },
      {
        label: "My Role",
        value: "Sole designer\nResearch, writing, editorial structure, illustration, production",
      },
      {
        label: "Tools",
        value: "Adobe Illustrator, Photoshop, InDesign, Adobe Dimension, QGIS",
      },
    ],
    blocks: [
      {
        kind: "section",
        label: "Why Silicon",
        heading: "An Element Nobody Pictures, In A Format Built Entirely For Pictures.",
      },
      {
        kind: "text",
        html: "A coffee table book is read the way nobody reads a textbook: opened anywhere, put down after two spreads, picked up again a week later. That makes it the hardest possible home for a technical subject, and the reason I chose one. Silicon runs from quartz to wafers to supply chains, so the challenge was never finding material &mdash; it was <strong>giving a reader a way in on whichever page they happened to open</strong>.",
      },
      {
        kind: "callout",
        html: "How might a reader move through 64 pages on a single element and always know where they are, no matter which spread they open to?",
      },
      { kind: "heading", text: "Image research" },
      {
        kind: "text",
        html: "I started by collecting the element visually rather than verbally &mdash; quartz, thin-section photomicrographs, server halls, cleanroom suits, silicone sheeting, solar fields, a chest x-ray, the lunar surface. Laid out together, the collection made the book&rsquo;s real argument obvious before a word was written: <strong>these images have nothing in common except silicon</strong>, and that range is the story.",
      },
      {
        kind: "media",
        media: {
          type: "image",
          src: `${A}/silicon-moodboard.jpg`,
          alt: "A 24-image research grid spanning geology, semiconductors, cleanrooms, and everyday silicon objects",
        },
      },

      {
        kind: "section",
        label: "Structure & Flatplan",
        heading: "Fifty Spreads, Planned Before A Single One Was Designed.",
      },
      {
        kind: "text",
        html: "Before designing anything, I built a flatplan of the whole book &mdash; every spread, its working title, its content, and the reference images pinned underneath it. Working at the spread level first meant I was <strong>designing a reading experience rather than a stack of layouts</strong>: I could see where the book got heavy with text, where it needed a full-bleed image to breathe, and whether each part earned its page count.",
      },
      {
        kind: "media",
        media: {
          type: "image",
          src: `${A}/silicon-flatplan.jpg`,
          alt: "The full 64-page flatplan, spread by spread, with working titles and reference images",
        },
      },
      { kind: "heading", text: "Five parts, and a route through them" },
      {
        kind: "text",
        html: "The research resolved into five parts that move outward from the rock to the world it built:",
      },
      {
        kind: "list",
        items: [
          "Part 01: Origins — sand to silicon, the geology of the crust, silica and the silicates",
          "Part 02: Transformations — semiconductor physics, extraction, zone refining, silicones, and the terminology that separates silicon from silica, silicate, and silicone",
          "Part 03: Tech & Beyond — sand to wafer, the transistor revolution, chips to circuits, the global supply chain, and chips as geopolitics",
          "Part 04: Challenges — the physical limits of silicon, environmental costs, the hidden labour behind it, and the digital divide",
          "Part 05: Futures — quantum, graphene, and AI hardware, silicon and energy, and silicon and society",
        ],
      },
      { kind: "heading", text: "Composing at the spread level" },
      {
        kind: "text",
        html: "I wireframed the spreads as grey blocks before any image or line of copy went in. Designing the rhythm first &mdash; full-bleed against half-page against a single column of text &mdash; is what keeps 50 spreads from settling into the same shape, and it let me <strong>fix the pacing while it was still cheap to change</strong>.",
      },
      {
        kind: "media",
        media: {
          type: "image",
          src: `${A}/silicon-layout-grid.jpg`,
          alt: "Grey-block wireframes for every spread, composed before any image or copy went in",
        },
      },

      {
        kind: "section",
        label: "The Design System",
        heading: "A Grid, A Type Hierarchy, And An Icon Language.",
      },
      {
        kind: "text",
        html: "The system had to hold across 64 pages built over 2.5 months, so I settled it early: a square trim, a single grid, a fixed type hierarchy, and a monospaced voice for anything technical &mdash; molecular diagrams, contour labels, figure references. The cover states the whole logic in one mark: <strong>the element rendered as its periodic-table cell</strong>, 14 &middot; Si &middot; 28.085, white on black. Once those decisions were locked, every later spread became a question of <strong>composition rather than reinvention</strong>.",
      },
      {
        kind: "grid",
        cols: 2,
        media: [
          { type: "pending", note: "silicon-type-specimen.jpg — type hierarchy and palette." },
          { type: "pending", note: "silicon-grid.jpg — the grid and margins." },
        ],
      },
      { kind: "heading", text: "Iconography as the navigation system" },
      {
        kind: "text",
        html: "Rather than leaning on page numbers, I built an <strong>icon set that doubles as wayfinding</strong>. Each part owns a mark, and the mark recurs at its opener, so a reader landing on a random spread can place themselves in the book before reading a word. Keeping the icons in the same visual language as the diagrams is what stops the book feeling like illustration bolted onto text.",
      },
      {
        kind: "media",
        media: { type: "pending", note: "silicon-icons.jpg — the five navigational marks laid out together." },
      },

      {
        kind: "section",
        label: "The Chapters",
        heading: "A Tour Through The Book",
      },
      {
        kind: "text",
        html: "Each part opens on a rendered title page, then moves between full-bleed imagery, diagram spreads, and text pages at the pace the flatplan set.",
      },
      {
        kind: "tabs",
        items: [
          {
            label: "01 Origins",
            cols: 2,
            media: [
              { type: "pending", note: "Part 01 — title page." },
              {
                type: "image",
                src: `${A}/silicon-spread-silicates.jpg`,
                alt: "The Silicates spread, topographic vectors beside a mineral thin-section photograph",
              },
            ],
          },
          {
            label: "02 Transformations",
            cols: 2,
            media: [
              { type: "pending", note: "Part 02 — title page." },
              {
                type: "image",
                src: `${A}/silicon-spread-terminology.jpg`,
                alt: "The Terminology spread, distinguishing silicon, silica, silicate, and silicone",
              },
            ],
          },
          {
            label: "03 Tech & Beyond",
            cols: 2,
            media: [
              { type: "pending", note: "Part 03 — title page." },
              { type: "pending", note: "Part 03 — a spread from inside." },
            ],
          },
          {
            label: "04 Challenges",
            cols: 2,
            media: [
              { type: "pending", note: "Part 04 — title page." },
              { type: "pending", note: "Part 04 — a spread from inside." },
            ],
          },
          {
            label: "05 Futures",
            cols: 2,
            media: [
              { type: "pending", note: "Part 05 — title page." },
              {
                type: "image",
                src: `${A}/silicon-spread-society.jpg`,
                alt: "The Silicon and Society spread, object-detection labels over a street scene",
              },
            ],
          },
        ],
      },

      {
        kind: "section",
        label: "Tools & Techniques",
        heading: "Two Techniques The Book Would Not Exist Without.",
      },
      {
        kind: "text",
        html: "Two of the things holding the book together are not drawn by hand, and neither is made in the software this project would normally be credited to. Both were skills I picked up mid-semester, specifically because the book needed them.",
      },
      { kind: "heading", text: "Coding topography in QGIS" },
      {
        kind: "text",
        html: "The book&rsquo;s contour line work is generated from real elevation data rather than drawn. I used <strong>QGIS</strong> to build contour layers from that data &mdash; Mt. Etna, whose basalt supplies the silicate photomicrograph the lines sit against &mdash; then <strong>exported them and rebuilt the output as clean vectors in Adobe Illustrator</strong>: reweighting the strokes, thinning the density down to what a printed page can actually hold, and setting the elevation labels in the book&rsquo;s own type. The result is topography that is accurate at the source and still reads as part of the design system rather than a screenshot dropped into a layout.",
      },
      {
        kind: "grid",
        cols: 2,
        media: [
          { type: "pending", note: "silicon-qgis.png — the QGIS contour output before vectorising." },
          {
            type: "image",
            src: `${A}/silicon-spread-silicates.jpg`,
            alt: "The finished Silicates spread pairing QGIS contour data with a mineral thin-section photograph",
          },
        ],
      },
      { kind: "heading", text: "Rendering the navigation icons in 3D" },
      {
        kind: "text",
        html: "The part marks live twice. Flat, they are the navigation system. At each opener they appear as <strong>3D renders built in Adobe Dimension</strong> &mdash; given material, lighting, and depth &mdash; so the title pages carry visual weight the flat marks could not. Every part gets a moment of arrival, using an icon the reader already knows.",
      },
      {
        kind: "grid",
        cols: 2,
        media: [
          { type: "pending", note: "silicon-dimension.png — a Dimension render, or the flat vs. 3D pair." },
          { type: "pending", note: "silicon-title-page.jpg — a finished title page using the 3D icon." },
        ],
      },
      {
        kind: "cards",
        items: [
          {
            title: "QGIS → Illustrator",
            body: "Generating contour layers from real elevation data in a GIS tool, then rebuilding them as editable vector artwork that obeys the book's grid, weights, and type.",
          },
          {
            title: "Adobe Dimension",
            body: "Modelling, texturing, and lighting the flat icon set so every part opener gets a rendered counterpart of its navigational mark.",
          },
          {
            title: "InDesign production",
            body: "Master pages, paragraph and object styles, and a print-ready file that holds 50 spreads together without drift.",
          },
        ],
      },

      {
        kind: "section",
        label: "Print & Production",
        heading: "From Screen To Sixty-Four Bound Pages.",
      },
      {
        kind: "text",
        html: "A book only really exists once it is printed. The last stretch of the semester went into production: master pages and styles in InDesign so a late change propagated instead of being retyped fifty times, image resolution and colour checked against print rather than screen, and margins and bleed set so nothing important died in the gutter &mdash; which matters more than usual in a book whose spreads routinely run an image across both pages.",
      },
      {
        kind: "grid",
        cols: 2,
        media: [
          { type: "pending", note: "silicon-cover.jpg — the printed cover." },
          { type: "pending", note: "silicon-print-detail.jpg — a held spread or binding detail." },
        ],
      },

      { kind: "section", label: "Reflection" },
      {
        kind: "cards",
        items: [
          {
            title: "Systems beat spreads",
            body: "Settling the grid, type, and icon language first turned 64 pages from an impossible workload into a sequence of solvable compositions.",
          },
          {
            title: "Learn the tool the idea needs",
            body: "QGIS and Dimension were both outside the Adobe workflow I knew. Picking them up mid-semester was faster than compromising the idea to fit the software I already had.",
          },
          {
            title: "Iconography is information design",
            body: "Treating the icons as navigation rather than decoration gave the book a structure a reader can feel without being told about it.",
          },
        ],
      },
    ],
  },

  {
    slug: "truth-pharm",
    title: "Truth Pharm",
    tagline: "Launching a marketing campaign for a substance use awareness non profit.",
    categories: ["Branding", "Internship"],
    thumb: { type: "image", src: `${A}/splash-2.webp`, alt: "Truth Pharm campaign" },
    hero: {
      headline: "Truth Pharm",
      fullBleed: true,
      media: { type: "image", src: `${A}/splash-2.webp`, alt: "Truth Pharm" },
    },
    overview: {
      media: { type: "image", src: `${A}/frame-1.webp`, alt: "" },
      html: "Truth Pharm is a nonprofit based in Binghamton, NY that focuses on reducing the stigma against substance use disorder and helping affected families heal through advocacy. I designed and marketed for both the nonprofit and their annual event, the Trail of Truth, which is the largest rally for substance use disorder in the US.",
    },
    meta: [
      { label: "Role", value: "Marketing and Design Intern" },
      { label: "Context", value: "May 2023 – Aug 2023, Internship" },
      {
        label: "Tools",
        value: "Adobe Illustrator, Photoshop, InDesign, DaVinci Resolve, Meta Business Suite, Canva",
      },
      {
        label: "Team",
        value: "Executive Director: Alexis Pleus · Community Arts Liaison: Mia Hause",
      },
    ],
    blocks: [
      {
        kind: "section",
        label: "Problem",
        heading: "Truth Pharm needed a way to design and market their upcoming events.",
      },
      { kind: "media", media: { type: "image", src: `${A}/tp-2.webp`, alt: "Truth Pharm event" } },
      { kind: "text", html: "To accomplish this goal, I collaborated with the team to:" },
      {
        kind: "list",
        items: [
          "Schedule social media posts across both Truth Pharm and Trail of Truth accounts",
          "Design event flyers, headers, and posts to advertise upcoming events and rallies",
          "Create and organize printing of brand deliverables, including business and post cards, t-shirts, and tote bags",
          "Photograph, film, and video edit marketing materials",
          "Monitor best performing posts to increase engagement",
          "Gather insights and empathy for people with substance use disorder",
        ],
      },

      { kind: "section", label: "Solution" },
      { kind: "heading", text: "Curated Flyers" },
      {
        kind: "text",
        html: "These are some of the flyers that were printed and posted on social media to promote the event:",
      },
      { kind: "media", media: { type: "image", src: `${A}/delivery-2.webp`, alt: "Event flyers" } },
      { kind: "heading", text: "Trail of Truth Videos" },
      {
        kind: "text",
        html: "Videos created to showcase the impact of substance use disorder on families. An emotional tone was used as a call to action to attend the event.",
      },
      {
        kind: "embed",
        src: "https://drive.google.com/file/d/1k-yVDfn6oBwGsJJLbHOQqzemAgtAaQ6R/preview",
        title: "Tombstone Video",
      },
      {
        kind: "list",
        items: [
          "Painted tombstones symbolize the lives lost from substance use disorder",
          "The intent of the video was to showcase the emotional toll on families, materialized by these tombstones",
        ],
      },
      {
        kind: "embed",
        src: "https://drive.google.com/file/d/1YGrPXIKUK8FOJ1inoFicLMeJWov_KlA1/preview",
        title: "Gracie Parker Video",
      },
      {
        kind: "list",
        items: [
          "Edited and manually subtitled video for accessibility and storytelling",
          "Showcased a case study on the lives of the children and families affected by substance use disorder",
        ],
      },

      { kind: "heading", text: "Project Process" },
      { kind: "media", media: { type: "image", src: `${A}/design-process-3.webp`, alt: "Design process" } },

      { kind: "section", label: "Discovery" },
      { kind: "heading", text: "Research" },
      {
        kind: "media",
        media: { type: "image", src: `${A}/research-pictures-1.webp`, alt: "Research at advocacy events" },
      },
      {
        kind: "text",
        html: "I had the amazing opportunity to market, photograph, and attend Truth Pharm&rsquo;s advocacy events. Talking to those affected by substance use disorder helped me get a better picture of how to message and therefore design my social media campaigns. This hands-on experience <strong>strengthened my understanding and empathy</strong> for the families, victims, and lives affected by substance use. Listening to the speakers and performers detail their experiences inspired me to create materials that would help Truth Pharm spread their messaging.",
      },

      { kind: "section", label: "Design" },
      { kind: "heading", text: "Brand Guidelines" },
      {
        kind: "media",
        media: {
          type: "image",
          src: `${A}/trail-of-truth-national-style-guide.png`,
          alt: "Trail of Truth style guide",
        },
      },
      {
        kind: "text",
        html: "Truth Pharm already had an established brand image that I followed. They prioritized a <strong>mid-century modern, bright, inviting color scheme</strong> that informed my designs. For the Trail of Truth, the brand was more serious, with purple and black being the primary colors of the campaign.",
      },

      { kind: "section", label: "Delivery" },
      { kind: "heading", text: "Printables & Social Media" },
      {
        kind: "text",
        html: "Business cards, postcards, flyers, and other forms of merchandise were designed to promote both Truth Pharm and the Trail of Truth. Alongside printed deliverables, I managed both social media accounts and posted at least 3 times a week, tracking analytics using the Meta Business Suite.",
      },
      {
        kind: "grid",
        cols: 3,
        media: [
          { type: "image", src: `${A}/delivery-t-shirts.webp`, alt: "T-shirts" },
          { type: "image", src: `${A}/delivery-cards.webp`, alt: "Cards" },
          { type: "image", src: `${A}/delivery-posters.webp`, alt: "Posters" },
        ],
      },
      {
        kind: "media",
        media: {
          type: "video",
          poster: `${A}/video-mp4-320x642-4-poster-00001.jpg`,
          mp4: `${A}/video-mp4-320x642-4-transcode.mp4`,
          webm: `${A}/video-mp4-320x642-4-transcode.webm`,
        },
      },
      {
        kind: "media",
        media: { type: "image", src: `${A}/delivery-social-media.webp`, alt: "Social media posts" },
      },

      { kind: "section", label: "Reflection and the future" },
      { kind: "heading", text: "Takeaways" },
      {
        kind: "text",
        html: "<strong>Social media is a relatively inexpensive way to expand any organization&rsquo;s reach.</strong> I&rsquo;m proud to say that my efforts at Truth Pharm led to a <strong>200% increase in account engagement</strong> according to the Meta Business Suite, with the social media videos being the most popular. To my surprise, I also found that people responded positively to text-heavy posts if they were accompanied by an impactful photo. My time at Truth Pharm informed me of a problem that plagues people from all different backgrounds. I truly <strong>looked forward to educating myself and learning about the science of addiction</strong> through people that have lived through so much.",
      },
      { kind: "heading", text: "The Future" },
      {
        kind: "list",
        items: [
          "How can Truth Pharm keep their advertising approach relevant according to changing trends?",
          "How can we change our messaging to include all groups within the “anti drug war” community?",
          "How can we facilitate uploading content and ensure that posts stay fresh and diverse?",
        ],
      },
    ],
  },

  {
    slug: "quorum-bio",
    title: "Quorum Bio",
    tagline: "Modernizing the brand of a microbial solutions startup company.",
    categories: ["Branding", "Internship"],
    thumb: { type: "image", src: `${A}/splash-6.webp`, alt: "Quorum Bio brand" },
    hero: {
      headline: "Quorum Bio",
      fullBleed: true,
      media: { type: "image", src: `${A}/splash-6.webp`, alt: "Quorum Bio" },
    },
    overview: {
      html: "During the fall semester of my second year, I interned for Quorum Bio (QB) through the <strong>New York New Energy Student Startup Experience.</strong> During my time at QB, I learned about the company&rsquo;s mission of helping farmers reduce their fertilizer usage and therefore preventing algal bloom caused by the over-consumption of phosphorous. I worked with the CEO to <strong>modernize QB&rsquo;s brand to attract more shareholders</strong> and establish QB as a leading startup for <strong>precision biologics.</strong>",
    },
    meta: [
      { label: "Role", value: "Design Intern" },
      { label: "Context", value: "Aug 2023 – Dec 2023, Internship" },
      { label: "Tools", value: "Adobe Illustrator, Canva, Wix" },
      { label: "Team", value: "CEO: Sudharsan Dwaraknath · Intern: Anthony Qiu" },
    ],
    blocks: [
      {
        kind: "section",
        label: "Problem",
        heading: "Quorum Bio needed a developed brand image to attract shareholders.",
      },
      {
        kind: "media",
        media: { type: "image", src: `${A}/quorum-bio-problem.webp`, alt: "Quorum Bio problem" },
      },
      { kind: "text", html: "To accomplish this goal, I collaborated with the team to:" },
      {
        kind: "list",
        items: [
          "Redesign their logo to improve professionalism and brand awareness",
          "Develop and execute company site UI",
          "Improve investor pitch deck for Climate Week",
          "Rebrand company colors and typography",
          "Advertise open positions and upcoming events using LinkedIn",
          "Refine investor one pager",
        ],
      },

      { kind: "section", label: "Solution" },
      { kind: "media", media: { type: "image", src: `${A}/frame-5-1.webp`, alt: "Site before" } },
      {
        kind: "beforeAfter",
        before: {
          type: "video",
          poster: `${A}/jul-03-2024-13-03-04-poster-00001.jpg`,
          mp4: `${A}/jul-03-2024-13-03-04-transcode.mp4`,
          webm: `${A}/jul-03-2024-13-03-04-transcode.webm`,
        },
        after: {
          type: "video",
          poster: `${A}/jul-03-2024-13-03-27-poster-00001.jpg`,
          mp4: `${A}/jul-03-2024-13-03-27-transcode.mp4`,
          webm: `${A}/jul-03-2024-13-03-27-transcode.webm`,
        },
      },
      {
        kind: "cards",
        items: [
          {
            title: "Before",
            body: "Text not visible because of clashing background · Walls of hard to digest text · Lack of cohesive brand appearance",
          },
          {
            title: "After",
            body: "All text is clearly legible according to background · Visually interesting screens to captivate audience · Established, professional brand appearance",
          },
        ],
      },

      { kind: "heading", text: "Project Process" },
      { kind: "media", media: { type: "image", src: `${A}/design-process-3.webp`, alt: "Design process" } },

      { kind: "section", label: "Discovery" },
      { kind: "heading", text: "Research" },
      {
        kind: "text",
        html: "I worked closely with the CEO to identify areas where QB could improve. After researching other startups within the same fellowship, past stakeholder behaviors, and the CEO&rsquo;s vision for the company, we identified a guideline for how QB wanted to present itself. Quorum Bio should have a <strong>modern, earthy, and professional brand.</strong>",
      },

      { kind: "section", label: "Design" },
      { kind: "heading", text: "Brand Guidelines" },
      {
        kind: "text",
        html: "I developed brand guidelines for QB to have a clear <strong>understanding of their identity</strong>. I wanted the company to reference this in future materials to have <strong>consistent branding across digital and print media.</strong>",
      },
      {
        kind: "grid",
        cols: 2,
        media: [
          { type: "image", src: `${A}/color-scheme-1.webp`, alt: "Color scheme" },
          { type: "image", src: `${A}/typography-1.webp`, alt: "Typography" },
        ],
      },
      { kind: "heading", text: "Logo" },
      { kind: "media", media: { type: "image", src: `${A}/brainstorming-2.webp`, alt: "Logo brainstorming" } },
      {
        kind: "text",
        html: "The CEO wanted a <strong>new logo that encapsulates QB&rsquo;s mission</strong> while also looking <strong>professional to shareholders.</strong> After many collaborative brainstorming sessions with the team, we identified the best fit for QB&rsquo;s brand.",
      },

      { kind: "section", label: "Delivery" },
      { kind: "heading", text: "Final Designs" },
      {
        kind: "text",
        html: "Here are some mockups presented for a better way to <strong>visualize some of the products</strong> that the CEO decided to print and order using the redesigned logo.",
      },
      { kind: "media", media: { type: "image", src: `${A}/qb-mockups-1-1.webp`, alt: "Product mockups" } },

      { kind: "section", label: "Reflection and the future" },
      { kind: "heading", text: "Takeaways" },
      {
        kind: "text",
        html: "<strong>Being a confident designer.</strong> Before this internship, I had experience with improving a designer&rsquo;s previous branding work, but QB taught me how to create an entire brand without a preexisting foundation. Throughout the entire process, I learned how to shake off the imposter syndrome that comes with being a junior designer and trusting my own research and insights while also being open to criticism and feedback.",
      },
      { kind: "heading", text: "The Future" },
      {
        kind: "list",
        items: [
          "How can usability tests and user interviews help Quorum Bio understand their target audience?",
          "How can we further design our brand to appeal to potential stakeholders?",
          "What CMS methods would make uploading content easier?",
          "What other brand materials could give QB a more established image (slide deck or Google Doc templates)?",
        ],
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
