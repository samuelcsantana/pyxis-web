# Security policy

## Supported versions

Only `main`, which is what production runs, receives security fixes.

## Reporting a vulnerability

Please report vulnerabilities privately through
[GitHub's private vulnerability reporting](https://github.com/samuelcsantana/pyxis-web/security/advisories/new).
Do not open a public issue.

Include what you found, how to reproduce it and the impact you expect. You will get an
acknowledgement within a few days, and the fix will be credited to you if you wish.

## Scope

Of particular interest:

- cross-site scripting, or anything that weakens the Content Security Policy;
- reading data of a project the signed-in admin has no access to;
- session handling (fixation, theft, cross-site requests);
- a secret or an API credential reaching the browser bundle;
- the live demo reaching any real API or real data.
