# ravi-technologies.github.io

## Overview
Ravi is an AI-assisted code review companion built for teams that care about how changes impact live systems, not just isolated code blocks. The product inspects pull requests alongside telemetry, database metrics, and traffic patterns so engineering leaders can spot costly regressions before they reach production.

This repository hosts the public landing page that explains Ravi's value proposition and collects early access sign-ups.

## Key Messaging Points
- **System-aware reviews:** Highlights that Ravi understands dataset sizes, query performance, and API load when recommending changes.
- **Telemetry-guided guardrails:** Communicates Ravi's ability to correlate OpenTelemetry traces and error spikes with incoming PRs.
- **Trade-off coaching:** Emphasizes senior-engineer style guidance that helps teams balance speed, reliability, and cost.

## Local Development
The site is a static bundle (HTML, CSS, JS). To preview locally:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Waitlist Form
Email addresses are posted to a Google Apps Script endpoint. The inline script in `index.html` performs validation, shows status messages, and appends a simple `source` attribute for attribution tracking.

## Deployment
The site is designed for GitHub Pages. Keep the `CNAME` file intact to preserve the custom domain configuration.
